import { prisma } from "@imovel-pratico/database";
import { publishRealtimeEvent } from "@imovel-pratico/queue";

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return 0;
}

export async function publicarTarefaAtualizada(tarefaId: string) {
  try {
    const prismaAny = prisma as unknown as {
      tarefa: {
        findUnique: (args: unknown) => Promise<Record<string, unknown> | null>;
      };
    };

    const tarefa = await prismaAny.tarefa.findUnique({
      where: {
        id: tarefaId,
      },
    });

    if (!tarefa) {
      return;
    }

    const clienteId = String(tarefa.clienteId ?? "");
    const status = String(tarefa.status ?? "");
    const total = toNumber(tarefa.progressTotal);
    const current = toNumber(tarefa.progressCurrent);
    const percentage =
      total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

    if (!clienteId) {
      return;
    }

    await publishRealtimeEvent({
      type:
        status === "COMPLETED" || status === "ERROR" || status === "CANCELED"
          ? "tarefa.completed"
          : "tarefa.progress",
      clienteId,
      tarefaId,
      status,
      current,
      total,
      percentage,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[worker-cnd] Erro ao publicar realtime da tarefa:", error);
  }
}
