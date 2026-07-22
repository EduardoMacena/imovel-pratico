import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export type AgentLocalConfig = {
  apiUrl: string;
  registroToken?: string;
  cndToken?: string;
};

export type AtivacaoSalva = {
  apiUrl: string;
  agents: {
    registro?: {
      identificador: string;
      token: string;
    };
    cnd?: {
      identificador: string;
      token: string;
    };
  };
};

export function getConfigDir() {
  if (process.platform === "win32") {
    return path.join(
      process.env.PROGRAMDATA || "C:\\ProgramData",
      "ImovelPratico",
      "Agent"
    );
  }

  return path.join(os.homedir(), ".imovel-pratico-agent");
}

export function getEnvPath() {
  return path.join(getConfigDir(), ".env");
}

function escapeEnv(value: string) {
  return value.replace(/\r?\n/g, "").replace(/"/g, '\\"');
}

function parseEnv(content: string) {
  const data: Record<string, string> = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const index = trimmed.indexOf("=");

    if (index <= 0) {
      continue;
    }

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();

    data[key] = value.replace(/^"|"$/g, "");
  }

  return data;
}

export async function carregarConfigLocal(): Promise<AgentLocalConfig | null> {
  const envPath = getEnvPath();

  if (!existsSync(envPath)) {
    return null;
  }

  const content = await readFile(envPath, "utf8");
  const env = parseEnv(content);

  if (!env.API_URL) {
    return null;
  }

  return {
    apiUrl: env.API_URL,
    registroToken: env.WORKER_REGISTRO_TOKEN || undefined,
    cndToken: env.WORKER_CND_TOKEN || undefined,
  };
}

export async function salvarAtivacaoLocal(data: AtivacaoSalva) {
  const configDir = getConfigDir();

  await mkdir(configDir, {
    recursive: true,
  });

  const lines = [
    "# Imóvel Prático Agent",
    "# Gerado automaticamente pelo instalador local.",
    `API_URL="${escapeEnv(data.apiUrl)}"`,
    data.agents.registro?.token
      ? `WORKER_REGISTRO_TOKEN="${escapeEnv(data.agents.registro.token)}"`
      : "",
    data.agents.cnd?.token
      ? `WORKER_CND_TOKEN="${escapeEnv(data.agents.cnd.token)}"`
      : "",
    "WORKER_AGENT_POLL_INTERVAL_MS=5000",
    "WORKER_AGENT_HEARTBEAT_INTERVAL_MS=30000",
    "WORKER_AGENT_ERROR_DELAY_MS=15000",
    "WORKER_AGENT_VERSION=0.1.0",
    "PLAYWRIGHT_CHANNEL=chrome",
    "PLAYWRIGHT_HEADLESS=false",
    "PLAYWRIGHT_SLOW_MO=800",
    "PLAYWRIGHT_LOCALE=pt-BR",
    "PLAYWRIGHT_TIMEZONE=America/Sao_Paulo",
    "PLAYWRIGHT_ACCEPT_LANGUAGE=pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "CND_BEFORE_SEARCH_DELAY_MS=15000",
    "CND_CLICK_MODE=js",
    ""
  ].filter(Boolean);

  await writeFile(getEnvPath(), lines.join("\n"), "utf8");

  return {
    configDir,
    envPath: getEnvPath(),
  };
}
