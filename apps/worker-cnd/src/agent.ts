import "dotenv/config";
import {
  AgentApiClient,
  formatError,
  getAgentConfig,
  sleep,
  type CndAgentJob,
} from "@imovel-pratico/agent-client";
import { closeBrowser } from "./playwright/browser.js";
import { buscarCpf, type ProprietarioEncontrado } from "./services/buscarCpf.js";
import { buscarContatoPorCpf } from "./services/contatos/buscarContatoPorCpf.js";

type RegistroCndAgent = {
  indiceCadastral: string;
  complemento: string | null;
};

let shuttingDown = false;

function mascararCpfPrimeirosTres(cpf: string | null | undefined) {
  if (!cpf) {
    return null;
  }

  const digits = cpf.replace(/\D/g, "");

  if (digits.length < 3) {
    return null;
  }

  return `${digits.slice(0, 3)}.***.***-**`;
}

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

function normalizarRegistros(registros: CndAgentJob["registros"]) {
  return registros
    .map(registro => ({
      indiceCadastral: String(registro.indiceCadastral ?? "").trim(),
      complemento: registro.complemento
        ? String(registro.complemento).trim()
        : null,
    }))
    .filter(registro => registro.indiceCadastral.length > 0);
}

function montarProprietarioFinal(params: {
  proprietario: ProprietarioEncontrado;
  contato: Awaited<ReturnType<typeof buscarContatoPorCpf>>;
}) {
  const cpfCompleto = params.proprietario.cpf ?? params.contato.cpf ?? null;

  return {
    nome: params.proprietario.nome ?? params.contato.nome ?? null,
    cpf: mascararCpfPrimeirosTres(cpfCompleto),
    endereco: params.proprietario.endereco ?? params.contato.endereco ?? null,
  };
}

async function processarRegistroCnd(params: {
  client: AgentApiClient;
  job: CndAgentJob;
  registro: RegistroCndAgent;
  total: number;
  current: number;
}) {
  const { client, job, registro, total, current } = params;

  try {
    console.log(
      `[agent-cnd] Consultando índice ${registro.indiceCadastral} (${current}/${total})`
    );

    const proprietario = await buscarCpf({
      indiceCadastral: registro.indiceCadastral,
      mesAnoInicio: job.mesAnoInicio,
      mesAnoFinal: job.mesAnoFinal,
    });

    const contato = await buscarContatoPorCpf({
      cpf: proprietario.cpf,
    });

    await client.progress(job.id, {
      total,
      current,
      item: {
        status: "success",
        logradouro: job.logradouro,
        numero: job.numero,
        imovel: registro.complemento,
        indiceCadastral: registro.indiceCadastral,
        proprietario: montarProprietarioFinal({
          proprietario,
          contato,
        }),
        telefone: contato.telefone,
        email: contato.email,
        fonteContato: contato.fonte,
        dadosContato: null,
        fromCache: false,
      },
    });

    console.log(
      `[agent-cnd] Índice ${registro.indiceCadastral} concluído com sucesso`
    );
  } catch (error) {
    const formatted = formatError(error);

    await client.progress(job.id, {
      total,
      current,
      item: {
        status: "error",
        logradouro: job.logradouro,
        numero: job.numero,
        imovel: registro.complemento,
        indiceCadastral: registro.indiceCadastral,
        proprietario: null,
        telefone: null,
        email: null,
        fonteContato: "NONE",
        dadosContato: null,
        error: formatted.message,
        fromCache: false,
      },
    });

    console.error(
      `[agent-cnd] Erro no índice ${registro.indiceCadastral}:`,
      formatted.message
    );
  }
}

async function processarCndJob(client: AgentApiClient, job: CndAgentJob) {
  const registros = normalizarRegistros(job.registros);
  const total = registros.length;

  console.log(
    `[agent-cnd] Processando tarefa ${job.id} com ${total} registro(s)`
  );

  await client.progress(job.id, {
    total,
    current: 0,
    status: "PROCESSING",
  });

  if (total <= 0) {
    await client.success(job.id, {});
    console.log(`[agent-cnd] Tarefa ${job.id} concluída sem registros`);
    return;
  }

  const intervaloMs = Math.max(job.intervaloSegundos, 0) * 1000;

  for (let index = 0; index < registros.length; index++) {
    if (shuttingDown) {
      throw new Error("Agent CND encerrado durante o processamento");
    }

    const registro = registros[index];

    await processarRegistroCnd({
      client,
      job,
      registro,
      total,
      current: index + 1,
    });

    const deveAguardar = index < registros.length - 1 && intervaloMs > 0;

    if (deveAguardar) {
      console.log(
        `[agent-cnd] Aguardando ${job.intervaloSegundos}s antes da próxima consulta`
      );

      await sleep(intervaloMs);
    }
  }

  await client.success(job.id, {});

  console.log(`[agent-cnd] Tarefa ${job.id} concluída`);
}

async function main() {
  const config = getAgentConfig();
  const client = new AgentApiClient(config);

  console.log("[agent-cnd] Iniciando agent CND");
  console.log(`[agent-cnd] API_URL=${config.apiUrl}`);

  await enviarHeartbeat(client, config.versao, {
    event: "startup",
  });

  const heartbeatTimer = setInterval(() => {
    void enviarHeartbeat(client, config.versao, {
      event: "interval",
    }).catch(error => {
      console.error("[agent-cnd] Erro ao enviar heartbeat:", error);
    });
  }, config.heartbeatIntervalMs);

  while (!shuttingDown) {
    try {
      const claimed = await client.claim();

      if (!claimed.hasJob || !claimed.job) {
        await sleep(config.pollIntervalMs);
        continue;
      }

      if (claimed.job.tipo !== "CND") {
        console.warn(
          `[agent-cnd] Job ignorado por tipo inesperado: ${claimed.job.tipo}`
        );

        await sleep(config.pollIntervalMs);
        continue;
      }

      try {
        await processarCndJob(client, claimed.job);
      } catch (error) {
        const formatted = formatError(error);

        console.error(
          `[agent-cnd] Erro ao processar job ${claimed.job.id}:`,
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
      console.error("[agent-cnd] Erro no loop principal:", error);
      await sleep(config.errorDelayMs);
    }
  }

  clearInterval(heartbeatTimer);

  await closeBrowser();

  console.log("[agent-cnd] Agent CND encerrado");
}

function requestShutdown(signal: string) {
  console.log(`[agent-cnd] Recebido ${signal}. Encerrando...`);
  shuttingDown = true;
}

process.on("SIGINT", () => requestShutdown("SIGINT"));
process.on("SIGTERM", () => requestShutdown("SIGTERM"));

main().catch(async error => {
  console.error("[agent-cnd] Erro fatal:", error);

  await closeBrowser();

  process.exit(1);
});
