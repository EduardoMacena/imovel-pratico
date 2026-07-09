export const QUEUE_NAMES = {
  BUSCAR_PROPRIETARIOS_BASE: "buscar-proprietarios",
} as const;

export function getBuscarProprietariosQueueName(clienteId: string) {
  return `${QUEUE_NAMES.BUSCAR_PROPRIETARIOS_BASE}-${clienteId}`;
}