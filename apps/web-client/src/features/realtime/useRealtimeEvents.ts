"use client";

import { useEffect, useRef } from "react";
import type { RealtimeEvent } from "./types";

function getApiBaseUrl() {
  const value =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:3333/api";

  return value.replace(/\/$/, "");
}

function getWebSocketUrl(token: string) {
  const apiBase = getApiBaseUrl();
  const url = new URL(apiBase);

  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `${url.pathname.replace(/\/$/, "")}/ws`;
  url.searchParams.set("token", token);

  return url.toString();
}

function extractTokenFromValue(value: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.split(".").length === 3 &&
    !trimmed.startsWith("{") &&
    !trimmed.startsWith("[")
  ) {
    return trimmed.replace(/^"|"$/g, "");
  }

  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;

    const keys = [
      "accessToken",
      "token",
      "access_token",
      "jwt",
      "jwtToken",
    ];

    for (const key of keys) {
      const token = parsed[key];

      if (typeof token === "string" && token.split(".").length === 3) {
        return token;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const preferredKeys = [
    "imovel-pratico:access-token",
    "imovel-pratico:token",
    "imovel-pratico:auth",
    "accessToken",
    "token",
    "auth",
    "auth_token",
  ];

  for (const key of preferredKeys) {
    const token = extractTokenFromValue(window.localStorage.getItem(key));

    if (token) {
      return token;
    }
  }

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key) {
      continue;
    }

    const value = window.localStorage.getItem(key);
    const token = extractTokenFromValue(value);

    if (token) {
      return token;
    }
  }

  return null;
}

export function useRealtimeEvents(
  onEvent: (event: RealtimeEvent) => void,
  dependencies: unknown[] = []
) {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent, ...dependencies]);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let isClosed = false;
    let reconnectTimer: number | null = null;
    let reconnectAttempts = 0;
    let pingTimer: number | null = null;

    function clearTimers() {
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      if (pingTimer) {
        window.clearInterval(pingTimer);
        pingTimer = null;
      }
    }

    function connect() {
      const token = getAuthToken();

      if (!token) {
        return;
      }

      socket = new WebSocket(getWebSocketUrl(token));

      socket.addEventListener("open", () => {
        reconnectAttempts = 0;

        pingTimer = window.setInterval(() => {
          if (socket?.readyState === WebSocket.OPEN) {
            socket.send("ping");
          }
        }, 30000);
      });

      socket.addEventListener("message", event => {
        if (event.data === "pong") {
          return;
        }

        try {
          const data = JSON.parse(String(event.data)) as RealtimeEvent;

          onEventRef.current(data);
        } catch (error) {
          console.error("Erro ao processar evento realtime:", error);
        }
      });

      socket.addEventListener("close", () => {
        clearTimers();

        if (isClosed) {
          return;
        }

        reconnectAttempts += 1;

        const delay = Math.min(1000 * reconnectAttempts, 10000);

        reconnectTimer = window.setTimeout(connect, delay);
      });

      socket.addEventListener("error", () => {
        socket?.close();
      });
    }

    connect();

    return () => {
      isClosed = true;
      clearTimers();
      socket?.close();
    };
  }, []);
}
