export type BuscarProprietariosJobData = {
  tarefaId: string;
  clienteId: string;
  buscaPreviaId?: string | null;
  logradouro?: string;
  numero?: string;
  mesAnoInicio: string;
  mesAnoFinal: string;
  intervaloSegundos: number;
  forceRefresh: boolean;
};

export type BuscarRegistrosJobData = {
  buscaPreviaId: string;
  clienteId: string;
  logradouro: string;
  numero: string;
};
