import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./index.js";

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  const cliente = await prisma.cliente.upsert({
    where: {
      slug: "twa-investimentos",
    },
    update: {
      nome: "TWA Investimentos",
      status: "ATIVO",
      intervaloSegundos: 30,
      limiteDiario: 300,
    },
    create: {
      nome: "TWA Investimentos",
      slug: "twa-investimentos",
      status: "ATIVO",
      intervaloSegundos: 30,
      limiteDiario: 300,
    },
  });

  const usuario = await prisma.usuario.upsert({
    where: {
      email: "admin@twa.com.br",
    },
    update: {
      nome: "Administrador TWA",
      senha: senhaHash,
      role: "ADMIN",
      ativo: true,
      clienteId: cliente.id,
    },
    create: {
      nome: "Administrador TWA",
      email: "admin@twa.com.br",
      senha: senhaHash,
      role: "ADMIN",
      ativo: true,
      clienteId: cliente.id,
    },
  });

  console.log("Seed executado com sucesso:");
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
      senha: "123456",
    },
  });
}

main()
  .catch(error => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
