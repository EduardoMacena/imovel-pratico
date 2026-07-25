import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import { app } from "electron";
import type { AgentLocalConfig } from "./config.js";

type AgentTipo = "REGISTRO" | "CND";

type ProcessoAgent = {
  tipo: AgentTipo;
  processo: ChildProcess;
  startedAt: string;
};

type LogHandler = (message: string) => void;

const WORKER_DIR_BY_TIPO: Record<AgentTipo, string> = {
  REGISTRO: "worker-registro",
  CND: "worker-cnd"
};

function montarEnvBase(config: AgentLocalConfig, token: string) {
  return {
    ...process.env,
    API_URL: config.apiUrl,
    WORKER_TOKEN: token,
    WORKER_AGENT_POLL_INTERVAL_MS:
      process.env.WORKER_AGENT_POLL_INTERVAL_MS || "5000",
    WORKER_AGENT_HEARTBEAT_INTERVAL_MS:
      process.env.WORKER_AGENT_HEARTBEAT_INTERVAL_MS || "30000",
    WORKER_AGENT_ERROR_DELAY_MS:
      process.env.WORKER_AGENT_ERROR_DELAY_MS || "15000",
    WORKER_AGENT_VERSION: process.env.WORKER_AGENT_VERSION || "0.1.0",
    PLAYWRIGHT_CHANNEL: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    PLAYWRIGHT_HEADLESS: process.env.PLAYWRIGHT_HEADLESS || "true",
    PLAYWRIGHT_SLOW_MO: process.env.PLAYWRIGHT_SLOW_MO || "800",
    PLAYWRIGHT_LOCALE: process.env.PLAYWRIGHT_LOCALE || "pt-BR",
    PLAYWRIGHT_TIMEZONE:
      process.env.PLAYWRIGHT_TIMEZONE || "America/Sao_Paulo",
    PLAYWRIGHT_ACCEPT_LANGUAGE:
      process.env.PLAYWRIGHT_ACCEPT_LANGUAGE ||
      "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    CND_BEFORE_SEARCH_DELAY_MS:
      process.env.CND_BEFORE_SEARCH_DELAY_MS || "15000",
    CND_CLICK_MODE: process.env.CND_CLICK_MODE || "js",

    /**
     * Faz o Electron executar este processo filho como Node.js.
     * Assim o cliente final não precisa instalar Node nem pnpm.
     */
    ELECTRON_RUN_AS_NODE: "1"
  };
}

function getWorkerEntry(tipo: AgentTipo) {
  const workerDir = WORKER_DIR_BY_TIPO[tipo];

  return path.join(
    app.getAppPath(),
    "dist",
    "workers",
    workerDir,
    "agent.cjs"
  );
}

export class AgentSupervisor {
  private processos = new Map<AgentTipo, ProcessoAgent>();
  private readonly onLog: LogHandler;

  constructor(onLog: LogHandler) {
    this.onLog = onLog;
  }

  status() {
    return {
      registro: {
        running: this.processos.has("REGISTRO"),
        startedAt: this.processos.get("REGISTRO")?.startedAt ?? null
      },
      cnd: {
        running: this.processos.has("CND"),
        startedAt: this.processos.get("CND")?.startedAt ?? null
      }
    };
  }

  start(config: AgentLocalConfig) {
    if (config.registroToken) {
      this.startOne("REGISTRO", config.registroToken, config);
    }

    if (config.cndToken) {
      this.startOne("CND", config.cndToken, config);
    }

    return this.status();
  }

  stop() {
    for (const [tipo, item] of this.processos.entries()) {
      this.onLog(`[supervisor] Encerrando ${tipo}...`);

      item.processo.kill("SIGTERM");
      this.processos.delete(tipo);
    }

    return this.status();
  }

  private startOne(tipo: AgentTipo, token: string, config: AgentLocalConfig) {
    if (this.processos.has(tipo)) {
      this.onLog(`[supervisor] ${tipo} já está em execução.`);
      return;
    }

    const entry = getWorkerEntry(tipo);
    const command = process.execPath;
    const args = [entry];

    this.onLog(`[supervisor] Iniciando ${tipo}: ${command} ${args.join(" ")}`);

    const processo = spawn(command, args, {
      cwd: app.getPath("userData"),
      env: montarEnvBase(config, token),
      shell: false,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });

    const startedAt = new Date().toISOString();

    this.processos.set(tipo, {
      tipo,
      processo,
      startedAt
    });

    processo.stdout?.on("data", chunk => {
      this.onLog(`[${tipo}] ${chunk.toString().trimEnd()}`);
    });

    processo.stderr?.on("data", chunk => {
      this.onLog(`[${tipo}:erro] ${chunk.toString().trimEnd()}`);
    });

    processo.on("exit", code => {
      this.onLog(`[supervisor] ${tipo} encerrado com código ${code ?? "-"}`);
      this.processos.delete(tipo);
    });

    processo.on("error", error => {
      this.onLog(`[supervisor] Erro ao iniciar ${tipo}: ${error.message}`);
      this.processos.delete(tipo);
    });
  }
}