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
		"[supervisor] Agents iniciados automaticamente com o Windows"
	);
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1040,
		height: 760,
		minWidth: 900,
		minHeight: 650,
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

		mainWindow?.webContents.send(
			"agents:log",
			`[instalador] Agent ativado para ${result.cliente.nome}`
		);

		return {
			...result,
			saved,
		};
	}
);

ipcMain.handle("agents:start", async () => {
	const config = await carregarConfigLocal();

	if (!config) {
		throw new Error("Configuração local não encontrada. Ative o link mágico primeiro.");
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

app.whenReady().then(async () => {
	configurarAutoStart();
	createWindow();

	await iniciarAgentsAutomaticamente();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("before-quit", () => {
	supervisor.stop();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
