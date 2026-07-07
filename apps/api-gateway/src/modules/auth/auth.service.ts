import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@imovel-pratico/database";
import { env } from "../../config/env.js";
import type { LoginInput } from "./auth.schemas.js";

export type AuthTokenPayload = {
  usuarioId: string;
  clienteId: string;
  email: string;
  role: string;
};

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
    },
    cliente: {
      id: usuario.cliente.id,
      nome: usuario.cliente.nome,
      slug: usuario.cliente.slug,
    },
  };
}
