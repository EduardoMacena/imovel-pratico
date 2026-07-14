import type { FastifyInstance } from "fastify";
import websocket from "@fastify/websocket";
import {
  createRealtimeSubscriber,
  type RealtimeEvent,
} from "@imovel-pratico/queue";
import { autenticarRealtimeToken } from "./realtime.auth.js";

type SocketLike = {
  readyState: number;
  send: (data: string) => void;
  close: () => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
};

const socketsByClienteId = new Map<string, Set<SocketLike>>();

let subscriberStarted = false;

function getSocket(connection: unknown): SocketLike {
  const maybeSocket = connection as SocketLike;
  const maybeConnection = connection as { socket?: SocketLike };

  if (maybeSocket && typeof maybeSocket.send === "function") {
    return maybeSocket;
  }

  if (maybeConnection.socket && typeof maybeConnection.socket.send === "function") {
    return maybeConnection.socket;
  }

  throw new Error("Socket inválido");
}

function addSocket(clienteId: string, socket: SocketLike) {
  const current = socketsByClienteId.get(clienteId) ?? new Set<SocketLike>();

  current.add(socket);
  socketsByClienteId.set(clienteId, current);

  socket.on("close", () => {
    current.delete(socket);

    if (current.size === 0) {
      socketsByClienteId.delete(clienteId);
    }
  });
}

function sendToCliente(clienteId: string, event: RealtimeEvent) {
  const sockets = socketsByClienteId.get(clienteId);

  if (!sockets?.size) {
    return;
  }

  const payload = JSON.stringify(event);

  for (const socket of sockets) {
    if (socket.readyState === 1) {
      socket.send(payload);
    }
  }
}

function startRealtimeSubscriber(app: FastifyInstance) {
  if (subscriberStarted) {
    return;
  }

  subscriberStarted = true;

  const subscriber = createRealtimeSubscriber(event => {
    sendToCliente(event.clienteId, event);
  });

  app.addHook("onClose", async () => {
    await subscriber.close();
  });
}

export async function realtimeRoutes(app: FastifyInstance) {
  await app.register(websocket);

  startRealtimeSubscriber(app);

  app.get("/ws", { websocket: true }, async (connection, request) => {
    const socket = getSocket(connection);

    try {
      const query = request.query as {
        token?: string;
      };

      const auth = await autenticarRealtimeToken(query.token);

      addSocket(auth.clienteId, socket);

      socket.send(
        JSON.stringify({
          type: "realtime.connected",
          clienteId: auth.clienteId,
          usuarioId: auth.usuarioId,
          connectedAt: new Date().toISOString(),
        })
      );

      socket.on("message", message => {
        const raw = String(message);

        if (raw === "ping") {
          socket.send("pong");
        }
      });
    } catch (error) {
      socket.send(
        JSON.stringify({
          type: "realtime.error",
          message:
            error instanceof Error
              ? error.message
              : "Erro ao autenticar WebSocket",
        })
      );

      socket.close();
    }
  });
}
