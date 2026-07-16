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
      type: "realtime.connected";
      clienteId: string;
      usuarioId: string | null;
      connectedAt: string;
    }
  | {
      type: "realtime.error";
      message: string;
    }
  | {
      type: "busca_previa.updated";
      clienteId: string;
      previaId: string;
      status: BuscaPreviaRealtimeStatus;
      quantidadeRegistros: number;
      consultasExcedentesEstimadas: number;
      valorExcedenteEstimadoCentavos: number;
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
