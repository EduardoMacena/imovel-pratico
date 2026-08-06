export type ClienteAdminErrorCode =
  | "CLIENTE_NAO_ENCONTRADO"
  | "PLANO_NAO_ENCONTRADO"
  | "PLANO_INATIVO"
  | "MUNICIPIO_NAO_ENCONTRADO"
  | "MUNICIPIO_INDISPONIVEL"
  | "SLUG_CLIENTE_INVALIDO"
  | "PAGAMENTO_VENCIMENTO_INVALIDO"
  | "SLUG_CLIENTE_DUPLICADO"
  | "CNPJ_CLIENTE_DUPLICADO"
  | "EMAIL_USUARIO_DUPLICADO"
  | "CLIENTE_ATIVO_SEM_PLANO"
  | "CLIENTE_ATIVO_SEM_MUNICIPIO";

export class ClienteAdminError extends Error {
  constructor(
    message: string,
    readonly code: ClienteAdminErrorCode,
    readonly statusCode: number,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ClienteAdminError";
  }
}
