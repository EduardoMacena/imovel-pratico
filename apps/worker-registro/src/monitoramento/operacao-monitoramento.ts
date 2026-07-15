import { Prisma, prisma } from "@imovel-pratico/database";

type OperacaoNivel = "INFO" | "WARN" | "ERROR";

type OperacaoServico =
  | "API_GATEWAY"
  | "WORKER_REGISTRO"
  | "WORKER_CND"
  | "QUEUE"
  | "REALTIME";

type WorkerStatus = "ONLINE" | "OFFLINE" | "ERROR";

type RegistrarOperacaoParams = {
  clienteId?: string | null;
  tarefaId?: string | null;
  buscaPreviaId?: string | null;
  nivel?: OperacaoNivel;
  servico: OperacaoServico;
  tipo: string;
  mensagem: string;
  detalhes?: string | null;
  metadata?: Record<string, unknown> | null;
};

type RegistrarHeartbeatParams = {
  clienteId: string;
  servico: OperacaoServico;
  identificador: string;
  fila?: string | null;
  status?: WorkerStatus;
  metadata?: Record<string, unknown> | null;
};

function toPrismaJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  try {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  } catch {
    return {
      erroSerializacao: "Não foi possível serializar metadata",
    } as Prisma.InputJsonValue;
  }
}

function normalizarErro(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    name: "UnknownError",
    message: String(error),
  };
}

export async function registrarOperacaoEvento(
  params: RegistrarOperacaoParams
) {
  try {
    await prisma.operacaoEvento.create({
      data: {
        clienteId: params.clienteId ?? null,
        tarefaId: params.tarefaId ?? null,
        buscaPreviaId: params.buscaPreviaId ?? null,
        nivel: params.nivel ?? "INFO",
        servico: params.servico,
        tipo: params.tipo,
        mensagem: params.mensagem,
        detalhes: params.detalhes ?? null,
        metadata: toPrismaJson(params.metadata),
      },
    });
  } catch (error) {
    console.error("[monitoramento] Erro ao registrar evento operacional:", error);
  }
}

export async function registrarErroOperacao(
  params: Omit<RegistrarOperacaoParams, "nivel">,
  error: unknown
) {
  const erro = normalizarErro(error);

  await registrarOperacaoEvento({
    ...params,
    nivel: "ERROR",
    detalhes: params.detalhes ?? erro.message,
    metadata: {
      ...(params.metadata ?? {}),
      error: erro,
    },
  });
}

export async function registrarHeartbeatWorker(
  params: RegistrarHeartbeatParams
) {
  try {
    await prisma.workerHeartbeat.upsert({
      where: {
        clienteId_servico_identificador: {
          clienteId: params.clienteId,
          servico: params.servico,
          identificador: params.identificador,
        },
      },
      create: {
        clienteId: params.clienteId,
        servico: params.servico,
        identificador: params.identificador,
        fila: params.fila ?? null,
        status: params.status ?? "ONLINE",
        ultimoSinalEm: new Date(),
        metadata: toPrismaJson(params.metadata),
      },
      update: {
        fila: params.fila ?? null,
        status: params.status ?? "ONLINE",
        ultimoSinalEm: new Date(),
        metadata: toPrismaJson(params.metadata),
      },
    });
  } catch (error) {
    console.error("[monitoramento] Erro ao registrar heartbeat:", error);
  }
}

export function iniciarHeartbeatWorker(
  params: RegistrarHeartbeatParams,
  intervaloMs = 30_000
) {
  void registrarHeartbeatWorker(params);

  const interval = setInterval(() => {
    void registrarHeartbeatWorker(params);
  }, intervaloMs);

  return interval;
}
