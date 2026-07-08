import {
    buscarIndiceCadastral,
    type ImovelEncontrado,
  } from "./buscarIndiceCadastral.js";
  import { buscarCpf, type ProprietarioEncontrado } from "./buscarCpf.js";
  import {
    buscarImovelCacheValido,
    salvarImovelCache,
  } from "./cache/imovel-cache.service.js";
  
  type StatusResultado = "success" | "error";
  
  export type ResultadoBuscaProprietario = {
    logradouro: string;
    numero: string;
    imovel: string;
    indiceCadastral: string;
    proprietario: ProprietarioEncontrado | null;
    status: StatusResultado;
    fromCache?: boolean;
    error?: string;
  };
  
  type BuscarProprietariosParams = {
    logradouro: string;
    numero: string;
    mesAnoInicio: string;
    mesAnoFinal: string;
    intervaloSegundos: number;
    forceRefresh?: boolean;
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
    forceRefresh?: boolean;
  }): Promise<ResultadoBuscaProprietario> {
    const {
      imovel,
      logradouro,
      numero,
      mesAnoInicio,
      mesAnoFinal,
      forceRefresh,
    } = params;
  
    try {
      const cache = await buscarImovelCacheValido({
        indiceCadastral: imovel.indiceCadastral,
        forceRefresh,
      });
  
      if (cache) {
        const proprietario = {
          nome: cache.nome,
          cpf: cache.cpf,
          endereco: cache.endereco,
          indiceCadastral: cache.indiceCadastral,
        } as ProprietarioEncontrado;
  
        return {
          logradouro,
          numero,
          imovel: imovel.imovel,
          indiceCadastral: imovel.indiceCadastral,
          proprietario,
          status: "success",
          fromCache: true,
        };
      }
  
      const proprietario = await buscarCpf({
        indiceCadastral: imovel.indiceCadastral,
        mesAnoInicio,
        mesAnoFinal,
      });
  
      await salvarImovelCache({
        logradouro,
        numero,
        complemento: null,
        indiceCadastral: imovel.indiceCadastral,
        nome: proprietario.nome ?? null,
        cpf: proprietario.cpf ?? null,
        endereco: proprietario.endereco ?? null,
        telefone: null,
        email: null,
      });
  
      return {
        logradouro,
        numero,
        imovel: imovel.imovel,
        indiceCadastral: imovel.indiceCadastral,
        proprietario,
        status: "success",
        fromCache: false,
      };
    } catch (error) {
      return {
        logradouro,
        numero,
        imovel: imovel.imovel,
        indiceCadastral: imovel.indiceCadastral,
        proprietario: null,
        status: "error",
        fromCache: false,
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
    forceRefresh = false,
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
        forceRefresh,
      });
  
      resultados.push(item);
  
      await onProgress?.({
        total: imoveis.length,
        current: index + 1,
        item,
        resultados,
      });
  
      /**
       * Se veio do cache, não precisa esperar intervalo da CND.
       * O intervalo só é necessário quando houve consulta real na CND.
       */
      const deveAguardarIntervalo =
        index < imoveis.length - 1 && !item.fromCache;
  
      if (deveAguardarIntervalo) {
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