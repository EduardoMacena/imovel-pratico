import * as RedisModule from "ioredis";

export const REALTIME_REDIS_CHANNEL = "imovel-pratico:realtime";

export type BuscaPreviaRealtimeStatus =
  | "PENDENTE"
  | "PROCESSANDO"
  | "AGUARDANDO_INTERVALO"
  | "CONSULTANDO_REGISTRO"
  | "PRONTA"
  | "AGUARDANDO_AUTORIZACAO_EXCEDENTE"
  | "AUTORIZANDO"
  | "CONFIRMADA"
  | "CANCELADA"
  | "EXPIRADA"
  | "ERRO";

export type RealtimeEvent =
  | {
      type: "busca_previa.updated";
      clienteId: string;
      previaId: string;
      status: BuscaPreviaRealtimeStatus;
      quantidadeRegistros: number;
      updatedAt: string;
    }
  | {
      type: "pendencias.updated";
      clienteId: string;
      updatedAt: string;
    }
  | {
      type: "tarefa.progress";
      clienteId: string;
      tarefaId: string;
      status: string;
      current: number;
      total: number;
      percentage: number;
      updatedAt: string;
    }
  | {
      type: "tarefa.completed";
      clienteId: string;
      tarefaId: string;
      status: string;
      current: number;
      total: number;
      percentage: number;
      updatedAt: string;
    };

type RedisClient = {
  publish: (channel: string, message: string) => Promise<number>;
  subscribe: (channel: string) => Promise<number>;
  quit: () => Promise<unknown>;
  on: (
    event: "message" | "error",
    handler: (...args: unknown[]) => void,
  ) => RedisClient;
};

type RedisConstructor = new (
  url: string,
  options?: Record<string, unknown>,
) => RedisClient;

let publisher: RedisClient | null = null;

function getRedisUrl() {
  return process.env.REDIS_URL ?? "redis://localhost:6379";
}

function getRedisConstructor() {
  const moduleValue = RedisModule as unknown as {
    default?: RedisConstructor;
    Redis?: RedisConstructor;
  } & RedisConstructor;

  return (moduleValue.default ??
    moduleValue.Redis ??
    moduleValue) as RedisConstructor;
}

function createRedisClient() {
  const Redis = getRedisConstructor();

  return new Redis(getRedisUrl(), {
    maxRetriesPerRequest: null,
  });
}

function getPublisher() {
  if (publisher) {
    return publisher;
  }

  publisher = createRedisClient();

  return publisher;
}

export async function publishRealtimeEvent(event: RealtimeEvent) {
  try {
    await getPublisher().publish(REALTIME_REDIS_CHANNEL, JSON.stringify(event));
  } catch (error) {
    console.error("[realtime] Erro ao publicar evento:", error);
  }
}

export function createRealtimeSubscriber(
  onEvent: (event: RealtimeEvent) => void,
) {
  const subscriber = createRedisClient();

  subscriber.on("message", (...args: unknown[]) => {
    const [_channel, message] = args;

    if (typeof message !== "string") {
      return;
    }

    try {
      const event = JSON.parse(message) as RealtimeEvent;

      if (!event?.type || !event?.clienteId) {
        return;
      }

      onEvent(event);
    } catch (error) {
      console.error("[realtime] Erro ao processar evento:", error);
    }
  });

  subscriber.on("error", (...args: unknown[]) => {
    console.error("[realtime] Erro no Redis subscriber:", args[0]);
  });

  subscriber.subscribe(REALTIME_REDIS_CHANNEL).catch((error: unknown) => {
    console.error("[realtime] Erro ao assinar canal Redis:", error);
  });

  return {
    close: async () => {
      await subscriber.quit();
    },
  };
}
