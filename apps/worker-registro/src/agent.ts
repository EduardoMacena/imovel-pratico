import "dotenv/config";
import {
  AgentApiClient,
  formatError,
  getAgentConfig,
  sleep,
  type RegistroAgentJob,
} from "@imovel-pratico/agent-client";
import { closeBrowser } from "./playwright/browser.js";
import { buscarIndiceCadastral } from "./services/buscarIndiceCadastral.js";
import { executarComControleRegistro } from "./services/registro-rate-limiter.js";

type RegistroEncontrado = {
  indiceCadastral?: unknown;
  complemento?: unknown;
  imovel?: unknown;
};

let shuttingDown = false;

function getWorkerMetadata() {
  return {
    pid: process.pid,
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    hostname: process.env.COMPUTERNAME || process.env.HOSTNAME || null,
    startedAt: new Date().toISOString(),
  };
}

function normalizarRegistros(registros: RegistroEncontrado[]) {
  return registros
    .map(registro => {
      const indiceCadastral =
        typeof registro.indiceCadastral === "string"
          ? registro.indiceCadastral.trim()
          : "";

      const complementoRaw =
        typeof registro.complemento === "string"
          ? registro.complemento
          : typeof registro.imovel === "string"
            ? registro.imovel
            : "";

      return {
        indiceCadastral,
        complemento: complementoRaw.trim() || null,
      };
    })
    .filter(registro => registro.indiceCadastral.length > 0);
}

async function enviarHeartbeat(
  client: AgentApiClient,
  versao: string,
  metadata?: Record<string, unknown>
) {
  await client.heartbeat({
    versao,
    metadata: {
      ...getWorkerMetadata(),
      ...(metadata ?? {}),
    },
  });
}

async function processarRegistroJob(
  client: AgentApiClient,
  job: RegistroAgentJob
) {
  console.log(
    `[agent-registro] Processando busca prévia ${job.id}: ${job.logradouro}, ${job.numero}`
  );

  await client.progress(job.id, {
    status: "CONSULTANDO_REGISTRO",
  });

  const registrosRaw = await executarComControleRegistro(async () => {
    return buscarIndiceCadastral(job.logradouro, job.numero);
  });

  const registros = normalizarRegistros(registrosRaw);

  await client.success(job.id, {
    registros,
  });

  console.log(
    `[agent-registro] Busca prévia ${job.id} concluída com ${registros.length} registro(s)`
  );
}

async function main() {
  const config = getAgentConfig();
  const client = new AgentApiClient(config);

  console.log("[agent-registro] Iniciando agent Registro");
  console.log(`[agent-registro] API_URL=${config.apiUrl}`);

  await enviarHeartbeat(client, config.versao, {
    event: "startup",
  });

  const heartbeatTimer = setInterval(() => {
    void enviarHeartbeat(client, config.versao, {
      event: "interval",
    }).catch(error => {
      console.error("[agent-registro] Erro ao enviar heartbeat:", error);
    });
  }, config.heartbeatIntervalMs);

  while (!shuttingDown) {
    try {
      const claimed = await client.claim();

      if (!claimed.hasJob || !claimed.job) {
        await sleep(config.pollIntervalMs);
        continue;
      }

      if (claimed.job.tipo !== "REGISTRO") {
        console.warn(
          `[agent-registro] Job ignorado por tipo inesperado: ${claimed.job.tipo}`
        );

        await sleep(config.pollIntervalMs);
        continue;
      }

      try {
        await processarRegistroJob(client, claimed.job);
      } catch (error) {
        const formatted = formatError(error);

        console.error(
          `[agent-registro] Erro ao processar job ${claimed.job.id}:`,
          formatted
        );

        await client.error(claimed.job.id, {
          message: formatted.message,
          stack: formatted.stack,
          metadata: {
            name: formatted.name,
          },
        });
      }
    } catch (error) {
      console.error("[agent-registro] Erro no loop principal:", error);
      await sleep(config.errorDelayMs);
    }
  }

  clearInterval(heartbeatTimer);

  await closeBrowser();

  console.log("[agent-registro] Agent Registro encerrado");
}

function requestShutdown(signal: string) {
  console.log(`[agent-registro] Recebido ${signal}. Encerrando...`);
  shuttingDown = true;
}

process.on("SIGINT", () => requestShutdown("SIGINT"));
process.on("SIGTERM", () => requestShutdown("SIGTERM"));

main().catch(async error => {
  console.error("[agent-registro] Erro fatal:", error);

  await closeBrowser();

  process.exit(1);
});
