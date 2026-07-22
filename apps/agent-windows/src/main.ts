import path from "node:path";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import {
	carregarConfigLocal,
	getConfigDir,
	getEnvPath,
	salvarAtivacaoLocal,
} from "./config.js";
import { ativarInstalacaoAgent } from "./installer-api.js";
import { AgentSupervisor } from "./agent-supervisor.js";

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

const supervisor = new AgentSupervisor((message) => {
	console.log(message);
	mainWindow?.webContents.send("agents:log", message);
});

function configurarAutoStart() {
	if (process.platform !== "win32") {
		return;
	}

	app.setLoginItemSettings({
		openAtLogin: true,
		openAsHidden: true,
		path: process.execPath,
		args: ["--hidden"],
	});
}

async function iniciarAgentsAutomaticamente() {
	const config = await carregarConfigLocal();

	if (!config) {
		return;
	}

	supervisor.start(config);

	mainWindow?.webContents.send(
		"agents:log",
		"[supervisor] Agents iniciados automaticamente"
	);
}

function showMainWindow() {
	if (!mainWindow) {
		createWindow();
	}

	if (!mainWindow) {
		return;
	}

	if (mainWindow.isMinimized()) {
		mainWindow.restore();
	}

	mainWindow.show();
	mainWindow.focus();
}

function createWindow() {
	const shouldStartHidden = process.argv.includes("--hidden");

	mainWindow = new BrowserWindow({
		width: 1040,
		height: 760,
		minWidth: 900,
		minHeight: 650,
		show: false,
		title: "Imóvel Prático Agent",
		backgroundColor: "#f4f1ea",
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	mainWindow.setMenu(null);
	mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

	mainWindow.once("ready-to-show", () => {
		if (!shouldStartHidden) {
			showMainWindow();
		}
	});

	mainWindow.on("close", (event) => {
		if (isQuitting) {
			return;
		}

		event.preventDefault();
		mainWindow?.hide();
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

ipcMain.handle("config:get", async () => {
	const config = await carregarConfigLocal();

	return {
		configDir: getConfigDir(),
		envPath: getEnvPath(),
		hasConfig: Boolean(config),
		hasRegistroToken: Boolean(config?.registroToken),
		hasCndToken: Boolean(config?.cndToken),
		apiUrl: config?.apiUrl ?? "https://api-staging.imovelpratico.com",
		status: supervisor.status(),
	};
});

ipcMain.handle(
	"install:activate",
	async (
		_event,
		payload: {
			entrada: string;
			apiUrlFallback: string;
		}
	) => {
		const result = await ativarInstalacaoAgent(payload);

		const saved = await salvarAtivacaoLocal({
			apiUrl: result.apiUrl,
			agents: result.agents,
		});

		const config = await carregarConfigLocal();
		const status = config ? supervisor.start(config) : supervisor.status();

		mainWindow?.webContents.send(
			"agents:log",
			`[instalador] Agent ativado para ${result.cliente.nome}`
		);

		mainWindow?.webContents.send(
			"agents:log",
			"[supervisor] Agents iniciados após ativação"
		);

		return {
			...result,
			saved,
			status,
		};
	}
);

ipcMain.handle("agents:start", async () => {
	const config = await carregarConfigLocal();

	if (!config) {
		throw new Error(
			"Configuração local não encontrada. Ative o link de instalação primeiro."
		);
	}

	return supervisor.start(config);
});

ipcMain.handle("agents:stop", async () => {
	return supervisor.stop();
});

ipcMain.handle("agents:status", async () => {
	return supervisor.status();
});

ipcMain.handle("config:open-folder", async () => {
	await shell.openPath(getConfigDir());

	return {
		ok: true,
	};
});

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
	app.quit();
} else {
	app.on("second-instance", () => {
		showMainWindow();
	});

	app.whenReady().then(async () => {
		configurarAutoStart();
		createWindow();

		await iniciarAgentsAutomaticamente();

		app.on("activate", () => {
			showMainWindow();
		});
	});

	app.on("before-quit", () => {
		isQuitting = true;
		supervisor.stop();
	});

	app.on("window-all-closed", () => {
		if (process.platform === "darwin") {
			app.quit();
		}
	});
}