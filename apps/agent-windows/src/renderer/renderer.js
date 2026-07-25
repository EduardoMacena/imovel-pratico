const api = window.imovelPraticoAgent;

const elements = {
	apiUrl: document.getElementById("apiUrl"),
	installInput: document.getElementById("installInput"),
	activateButton: document.getElementById("activateButton"),
	openConfigButton: document.getElementById("openConfigButton"),
	startButton: document.getElementById("startButton"),
	stopButton: document.getElementById("stopButton"),
	clearLogsButton: document.getElementById("clearLogsButton"),
	result: document.getElementById("activationResult"),
	logs: document.getElementById("logs"),
	statusText: document.getElementById("statusText"),
	statusConfigText: document.getElementById("statusConfigText"),
	dashboardConfigText: document.getElementById("dashboardConfigText"),
	registroStatus: document.getElementById("registroStatus"),
	cndStatus: document.getElementById("cndStatus"),
	activationSection: document.getElementById("activationSection"),
	dashboardSection: document.getElementById("dashboardSection"),
	reconfigureButton: document.getElementById("reconfigureButton"),
	openConfigButtonDashboard: document.getElementById("openConfigButtonDashboard"),
};

function isAnyServiceRunning(status) {
	return Boolean(status?.registro?.running || status?.cnd?.running);
}

function toggleButtonVisibility(button, visible) {
	button.classList.toggle("hidden", !visible);
}

function renderScreens(data) {
	const shouldShowDashboard = data.hasConfig;

	elements.activationSection.classList.toggle("hidden", shouldShowDashboard);
	elements.dashboardSection.classList.toggle("hidden", !shouldShowDashboard);
}

function renderServiceButtons(status) {
	const running = isAnyServiceRunning(status);

	elements.startButton.disabled = running;
	toggleButtonVisibility(elements.startButton, !running);
	toggleButtonVisibility(elements.stopButton, running);
}

function setResult(message, type = "success") {
	elements.result.textContent = message;
	elements.result.classList.remove("hidden", "error");

	if (type === "error") {
		elements.result.classList.add("error");
	}
}

function addLog(message) {
	const now = new Date().toLocaleTimeString("pt-BR");

	elements.logs.textContent += `[${now}] ${message}\n`;
	elements.logs.scrollTop = elements.logs.scrollHeight;
}

function serviceLabel(isRunning) {
	return isRunning ? "Rodando" : "Parado";
}

async function refreshConfig() {
	const data = await api.getConfig();

	elements.apiUrl.value = data.apiUrl || "https://api-staging.imovelpratico.com";

	elements.statusText.textContent = data.hasConfig ? "Configurado" : "Pendente";

	const configMessage = data.hasConfig
		? `Configuração salva em ${data.envPath}`
		: "Ative o link de instalação para salvar os tokens.";

	elements.statusConfigText.textContent = configMessage;
	elements.dashboardConfigText.textContent = configMessage;

	elements.registroStatus.textContent = serviceLabel(data.status.registro.running);
	elements.cndStatus.textContent = serviceLabel(data.status.cnd.running);

	renderScreens(data);
	renderServiceButtons(data.status);
}

elements.activateButton.addEventListener("click", async () => {
	elements.activateButton.disabled = true;

	try {
		const result = await api.activateInstallLink({
			entrada: elements.installInput.value,
			apiUrlFallback: elements.apiUrl.value,
		});

		setResult(
			`Instalação ativada para ${result.cliente.nome}. Tokens salvos localmente.`
		);

		addLog(`Instalação ativada para ${result.cliente.nome}`);

		await refreshConfig();
	} catch (error) {
		setResult(error instanceof Error ? error.message : String(error), "error");
		addLog(`Erro na ativação: ${error instanceof Error ? error.message : error}`);
	} finally {
		elements.activateButton.disabled = false;
	}
});

elements.startButton.addEventListener("click", async () => {
	elements.startButton.disabled = true;

	try {
		const status = await api.startAgents();

		addLog("Agents iniciados.");
		elements.registroStatus.textContent = serviceLabel(status.registro.running);
		elements.cndStatus.textContent = serviceLabel(status.cnd.running);
		renderServiceButtons(status);
	} catch (error) {
		setResult(error instanceof Error ? error.message : String(error), "error");
		addLog(`Erro ao iniciar agents: ${error instanceof Error ? error.message : error}`);
	} finally {
		elements.startButton.disabled = false;
	}
});

elements.stopButton.addEventListener("click", async () => {
	elements.stopButton.disabled = true;

	try {
		const status = await api.stopAgents();

		addLog("Agents parados.");
		elements.registroStatus.textContent = serviceLabel(status.registro.running);
		elements.cndStatus.textContent = serviceLabel(status.cnd.running);
		renderServiceButtons(status);
	} finally {
		elements.stopButton.disabled = false;
	}
});

elements.reconfigureButton.addEventListener("click", () => {
	elements.activationSection.classList.remove("hidden");
	elements.dashboardSection.classList.add("hidden");
});

elements.openConfigButtonDashboard.addEventListener("click", async () => {
	await api.openConfigFolder();
});

elements.openConfigButton.addEventListener("click", async () => {
	await api.openConfigFolder();
});

elements.clearLogsButton.addEventListener("click", () => {
	elements.logs.textContent = "";
});

api.onLog((message) => {
	addLog(message);
	refreshConfig().catch(() => {});
});

refreshConfig().catch((error) => {
	addLog(`Erro ao carregar configuração: ${error.message}`);
});
