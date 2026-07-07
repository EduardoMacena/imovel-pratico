import {
    buscarIndiceCadastral,
    type ImovelEncontrado,
  } from "./buscarIndiceCadastral.js";
  import { buscarCpf, type ProprietarioEncontrado } from "./buscarCpf.js";
  
  type StatusResultado = "success" | "error";
  
  export type ResultadoBuscaProprietario = {
    logradouro: string;
    numero: string;
    imovel: string;
    indiceCadastral: string;
    proprietario: ProprietarioEncontrado | null;
    status: StatusResultado;
    error?: string;
  };
  
  type BuscarProprietariosParams = {
    logradouro: string;
    numero: string;
    mesAnoInicio: string;
    mesAnoFinal: string;
    intervaloSegundos: number;
    onProgress?: (data: {
      total: number;
      current: number;
      item?: ResultadoBuscaProprietario;
      resultados: ResultadoBuscaProprietario[];
    }) => void | Promise<void>;
  };
  
  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function buscarProprietarioDoImovel(params: {
    imovel: ImovelEncontrado;
    logradouro: string;
    numero: string;
    mesAnoInicio: string;
    mesAnoFinal: string;
  }): Promise<ResultadoBuscaProprietario> {
    const { imovel, logradouro, numero, mesAnoInicio, mesAnoFinal } = params;
  
    try {
      const proprietario = await buscarCpf({
        indiceCadastral: imovel.indiceCadastral,
        mesAnoInicio,
        mesAnoFinal,
      });
  
      return {
        logradouro,
        numero,
        imovel: imovel.imovel,
        indiceCadastral: imovel.indiceCadastral,
        proprietario,
        status: "success",
      };
    } catch (error) {
      return {
        logradouro,
        numero,
        imovel: imovel.imovel,
        indiceCadastral: imovel.indiceCadastral,
        proprietario: null,
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Erro ao buscar proprietário",
      };
    }
  }
  
  export async function buscarProprietariosPorEndereco({
    logradouro,
    numero,
    mesAnoInicio,
    mesAnoFinal,
    intervaloSegundos,
    onProgress,
  }: BuscarProprietariosParams) {
    const imoveis = await buscarIndiceCadastral(logradouro, numero);
  
    const resultados: ResultadoBuscaProprietario[] = [];
    const intervaloMs = intervaloSegundos * 1000;
  
    await onProgress?.({
      total: imoveis.length,
      current: 0,
      resultados,
    });
  
    for (let index = 0; index < imoveis.length; index++) {
      const imovel = imoveis[index];
  
      const item = await buscarProprietarioDoImovel({
        imovel,
        logradouro,
        numero,
        mesAnoInicio,
        mesAnoFinal,
      });
  
      resultados.push(item);
  
      await onProgress?.({
        total: imoveis.length,
        current: index + 1,
        item,
        resultados,
      });
  
      if (index < imoveis.length - 1) {
        await sleep(intervaloMs);
      }
    }
  
    return {
      logradouro,
      numero,
      totalImoveis: imoveis.length,
      resultados,
    };
  }