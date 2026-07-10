import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@imovel-pratico/database";
import { env } from "../../config/env.js";
import type {
  LoginInput,
  RedefinirSenhaInput,
  SolicitarRedefinicaoSenhaInput,
  TrocarMinhaSenhaInput,
} from "./auth.schemas.js";

export type AuthTokenPayload = {
  usuarioId: string;
  clienteId: string;
  email: string;
  role: string;
};

const RESET_TOKEN_EXPIRACAO_MINUTOS = 60;

export class CredenciaisInvalidasError extends Error {
  constructor() {
    super("E-mail ou senha inválidos");
    this.name = "CredenciaisInvalidasError";
  }
}

export class UsuarioInativoError extends Error {
  constructor() {
    super("Usuário inativo");
    this.name = "UsuarioInativoError";
  }
}

export class ClienteInativoError extends Error {
  constructor() {
    super("Cliente inativo ou suspenso");
    this.name = "ClienteInativoError";
  }
}

export class SenhaAtualInvalidaError extends Error {
  constructor() {
    super("Senha atual inválida");
    this.name = "SenhaAtualInvalidaError";
  }
}

export class UsuarioNaoEncontradoError extends Error {
  constructor() {
    super("Usuário não encontrado");
    this.name = "UsuarioNaoEncontradoError";
  }
}

export class TokenRedefinicaoSenhaInvalidoError extends Error {
  constructor() {
    super("Link de redefinição inválido ou expirado");
    this.name = "TokenRedefinicaoSenhaInvalidoError";
  }
}

function gerarResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function gerarTokenHash(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getWebClientUrl() {
  return process.env.WEB_CLIENT_URL ?? "http://localhost:3001";
}

function getResetSenhaExpiraEm() {
  const expiraEm = new Date();

  expiraEm.setMinutes(expiraEm.getMinutes() + RESET_TOKEN_EXPIRACAO_MINUTOS);

  return expiraEm;
}

export async function login(data: LoginInput) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      email: data.email,
    },
    include: {
      cliente: {
        select: {
          id: true,
          nome: true,
          slug: true,
          status: true,
        },
      },
    },
  });

  if (!usuario) {
    throw new CredenciaisInvalidasError();
  }

  const senhaValida = await bcrypt.compare(data.senha, usuario.senha);

  if (!senhaValida) {
    throw new CredenciaisInvalidasError();
  }

  if (!usuario.ativo) {
    throw new UsuarioInativoError();
  }

  if (usuario.cliente.status !== "ATIVO") {
    throw new ClienteInativoError();
  }

  const payload: AuthTokenPayload = {
    usuarioId: usuario.id,
    clienteId: usuario.clienteId,
    email: usuario.email,
    role: usuario.role,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      precisaTrocarSenha: usuario.precisaTrocarSenha,
      senhaAlteradaEm: usuario.senhaAlteradaEm,
    },
    cliente: {
      id: usuario.cliente.id,
      nome: usuario.cliente.nome,
      slug: usuario.cliente.slug,
    },
  };
}

export async function trocarMinhaSenha(
  usuarioId: string,
  data: TrocarMinhaSenhaInput
) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: usuarioId,
    },
  });

  if (!usuario) {
    throw new UsuarioNaoEncontradoError();
  }

  const senhaAtualValida = await bcrypt.compare(
    data.senhaAtual,
    usuario.senha
  );

  if (!senhaAtualValida) {
    throw new SenhaAtualInvalidaError();
  }

  const novaSenhaHash = await bcrypt.hash(data.novaSenha, 10);

  const usuarioAtualizado = await prisma.usuario.update({
    where: {
      id: usuarioId,
    },
    data: {
      senha: novaSenhaHash,
      precisaTrocarSenha: false,
      senhaAlteradaEm: new Date(),
      resetSenhaTokenHash: null,
      resetSenhaExpiraEm: null,
      resetSenhaUsadoEm: null,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      ativo: true,
      precisaTrocarSenha: true,
      senhaAlteradaEm: true,
      clienteId: true,
    },
  });

  return {
    usuario: usuarioAtualizado,
    message: "Senha alterada com sucesso.",
  };
}

export async function solicitarRedefinicaoSenha(
  data: SolicitarRedefinicaoSenhaInput
) {
  const mensagem =
    "Se o e-mail existir na plataforma, enviaremos as instruções para redefinir a senha.";

  const usuario = await prisma.usuario.findUnique({
    where: {
      email: data.email,
    },
    include: {
      cliente: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!usuario || !usuario.ativo || usuario.cliente.status !== "ATIVO") {
    return {
      message: mensagem,
      resetUrl: null,
    };
  }

  const token = gerarResetToken();
  const tokenHash = gerarTokenHash(token);
  const expiraEm = getResetSenhaExpiraEm();

  await prisma.usuario.update({
    where: {
      id: usuario.id,
    },
    data: {
      resetSenhaTokenHash: tokenHash,
      resetSenhaExpiraEm: expiraEm,
      resetSenhaUsadoEm: null,
    },
  });

  const resetUrl = `${getWebClientUrl()}/redefinir-senha?token=${token}`;

  console.log("[RESET_SENHA_URL]", resetUrl);

  return {
    message: mensagem,
    resetUrl,
  };
}

export async function redefinirSenha(data: RedefinirSenhaInput) {
  const tokenHash = gerarTokenHash(data.token);
  const agora = new Date();

  const usuario = await prisma.usuario.findFirst({
    where: {
      resetSenhaTokenHash: tokenHash,
      resetSenhaExpiraEm: {
        gt: agora,
      },
      resetSenhaUsadoEm: null,
      ativo: true,
      cliente: {
        status: "ATIVO",
      },
    },
  });

  if (!usuario) {
    throw new TokenRedefinicaoSenhaInvalidoError();
  }

  const senhaHash = await bcrypt.hash(data.novaSenha, 10);

  await prisma.usuario.update({
    where: {
      id: usuario.id,
    },
    data: {
      senha: senhaHash,
      precisaTrocarSenha: false,
      senhaAlteradaEm: agora,
      resetSenhaTokenHash: null,
      resetSenhaExpiraEm: null,
      resetSenhaUsadoEm: agora,
    },
  });

  return {
    message: "Senha redefinida com sucesso. Faça login com a nova senha.",
  };
}