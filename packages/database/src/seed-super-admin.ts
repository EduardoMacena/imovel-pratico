import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./index.js";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável ${name} não configurada`);
  }

  return value;
}

async function main() {
  const nome = process.env.SEED_SUPER_ADMIN_NOME ?? "Super Admin";
  const email = getRequiredEnv("SEED_SUPER_ADMIN_EMAIL");
  const senha = getRequiredEnv("SEED_SUPER_ADMIN_PASSWORD");

  if (senha.length < 8) {
    throw new Error("SEED_SUPER_ADMIN_PASSWORD precisa ter pelo menos 8 caracteres");
  }

  const clienteNome =
    process.env.SEED_SUPER_ADMIN_CLIENTE_NOME ?? "Imóvel Prático Staging";

  const clienteSlug =
    process.env.SEED_SUPER_ADMIN_CLIENTE_SLUG ?? "imovel-pratico-staging";

  const senhaHash = await bcrypt.hash(senha, 10);

  const cliente = await prisma.cliente.upsert({
    where: {
      slug: clienteSlug,
    },
    update: {
      nome: clienteNome,
      status: "ATIVO",
      pagamentoStatus: "PAGO",
      intervaloSegundos: 30,
      limiteDiario: 1000,
      limiteMensalConsultas: 10000,
    },
    create: {
      nome: clienteNome,
      slug: clienteSlug,
      status: "ATIVO",
      pagamentoStatus: "PAGO",
      intervaloSegundos: 30,
      limiteDiario: 1000,
      limiteMensalConsultas: 10000,
    },
  });

  const usuario = await prisma.usuario.upsert({
    where: {
      email,
    },
    update: {
      nome,
      senha: senhaHash,
      role: "SUPER_ADMIN",
      ativo: true,
      precisaTrocarSenha: true,
      clienteId: cliente.id,
    },
    create: {
      nome,
      email,
      senha: senhaHash,
      role: "SUPER_ADMIN",
      ativo: true,
      precisaTrocarSenha: true,
      clienteId: cliente.id,
    },
  });

  console.log("Super admin criado/atualizado com sucesso:");
  console.log({
    cliente: {
      id: cliente.id,
      nome: cliente.nome,
      slug: cliente.slug,
    },
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      precisaTrocarSenha: usuario.precisaTrocarSenha,
    },
  });
}

main()
  .catch(error => {
    console.error("Erro ao criar super admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
