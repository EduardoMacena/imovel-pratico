export type BuscarProprietariosJobData = {
  tarefaId: string;
  clienteId: string;
  logradouro: string;
  numero: string;
  mesAnoInicio: string;
  mesAnoFinal: string;
  intervaloSegundos: number;
  forceRefresh: boolean;
};
