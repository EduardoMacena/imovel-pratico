import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./index.js";

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  const clientePlataforma = await prisma.cliente.upsert({
    where: {
      slug: "imovel-pratico",
    },
    update: {
      nome: "Imóvel Prático",
      status: "ATIVO",
      intervaloSegundos: 30,
      limiteDiario: 1000,
    },
    create: {
      nome: "Imóvel Prático",
      slug: "imovel-pratico",
      status: "ATIVO",
      intervaloSegundos: 30,
      limiteDiario: 1000,
    },
  });

  const superAdmin = await prisma.usuario.upsert({
    where: {
      email: "dudumacen@gmail.com",
    },
    update: {
      nome: "Eduardo Macena",
      senha: senhaHash,
      role: "SUPER_ADMIN",
      ativo: true,
      clienteId: clientePlataforma.id,
    },
    create: {
      nome: "Eduardo Macena",
      email: "dudumacen@gmail.com",
      senha: senhaHash,
      role: "SUPER_ADMIN",
      ativo: true,
      clienteId: clientePlataforma.id,
    },
  });

  const clienteTwa = await prisma.cliente.upsert({
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

  const usuarioTwa = await prisma.usuario.upsert({
    where: {
      email: "admin@twa.com.br",
    },
    update: {
      nome: "Administrador TWA",
      senha: senhaHash,
      role: "ADMIN",
      ativo: true,
      clienteId: clienteTwa.id,
    },
    create: {
      nome: "Administrador TWA",
      email: "admin@twa.com.br",
      senha: senhaHash,
      role: "ADMIN",
      ativo: true,
      clienteId: clienteTwa.id,
    },
  });

  console.log("Seed executado com sucesso:");
  console.log({
    superAdmin: {
      id: superAdmin.id,
      nome: superAdmin.nome,
      email: superAdmin.email,
      senha: "123456",
      role: superAdmin.role,
    },
    clienteTwa: {
      id: clienteTwa.id,
      nome: clienteTwa.nome,
      slug: clienteTwa.slug,
    },
    usuarioTwa: {
      id: usuarioTwa.id,
      nome: usuarioTwa.nome,
      email: usuarioTwa.email,
      senha: "123456",
      role: usuarioTwa.role,
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