export const QUEUE_NAMES = {
  BUSCAR_PROPRIETARIOS_BASE: "buscar-proprietarios",
  BUSCAR_REGISTROS_BASE: "buscar-registros",
} as const;

export function getBuscarProprietariosQueueName(clienteId: string) {
  return `${QUEUE_NAMES.BUSCAR_PROPRIETARIOS_BASE}-${clienteId}`;
}

export function getBuscarRegistrosQueueName(clienteId: string) {
  return `${QUEUE_NAMES.BUSCAR_REGISTROS_BASE}-${clienteId}`;
}
