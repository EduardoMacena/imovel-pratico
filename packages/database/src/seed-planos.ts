import "dotenv/config";
import { prisma } from "./index.js";

const planos = [
  {
    nome: "Inicial",
    slug: "inicial",
    descricao: "Plano inicial para pequenas operações",
    limiteMensalConsultas: 300,
    intervaloSegundos: 90,
    precoCentavos: 0,
  },
  {
    nome: "Crescimento",
    slug: "crescimento",
    descricao: "Plano para imobiliárias em crescimento",
    limiteMensalConsultas: 500,
    intervaloSegundos: 70,
    precoCentavos: 0,
  },
  {
    nome: "Profissional",
    slug: "profissional",
    descricao: "Plano para operação comercial mais intensa",
    limiteMensalConsultas: 1000,
    intervaloSegundos: 50,
    precoCentavos: 0,
  },
  {
    nome: "Premium",
    slug: "premium",
    descricao: "Plano avançado com maior volume e menor intervalo",
    limiteMensalConsultas: 2000,
    intervaloSegundos: 40,
    precoCentavos: 0,
  },
];

async function main() {
  for (const plano of planos) {
    await prisma.plano.upsert({
      where: {
        slug: plano.slug,
      },
      update: {
        nome: plano.nome,
        descricao: plano.descricao,
        limiteMensalConsultas: plano.limiteMensalConsultas,
        intervaloSegundos: plano.intervaloSegundos,
        precoCentavos: plano.precoCentavos,
        status: "ATIVO",
      },
      create: {
        ...plano,
        status: "ATIVO",
      },
    });
  }

  const planoInicial = await prisma.plano.findUnique({
    where: {
      slug: "inicial",
    },
  });

  if (planoInicial) {
    await prisma.cliente.updateMany({
      where: {
        planoId: null,
      },
      data: {
        planoId: planoInicial.id,
      },
    });
  }

  console.log("Planos criados/atualizados com sucesso.");
}

main()
  .catch(error => {
    console.error("Erro ao criar planos:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
