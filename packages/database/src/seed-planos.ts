import "dotenv/config";
import { prisma } from "./index.js";

const planos = [
  {
    nome: "Start",
    slug: "start",
    descricao: "Plano de entrada para imobiliárias pequenas validarem a operação.",
    limiteMensalConsultas: 250,
    intervaloSegundos: 90,
    precoCentavos: 59700,
    valorConsultaAdicionalCentavos: 290,
    limiteCorretores: 6,
  },
  {
    nome: "Growth",
    slug: "growth",
    descricao: "Plano para imobiliárias em crescimento com volume recorrente.",
    limiteMensalConsultas: 500,
    intervaloSegundos: 70,
    precoCentavos: 89700,
    valorConsultaAdicionalCentavos: 250,
    limiteCorretores: 12,
  },
  {
    nome: "Business",
    slug: "business",
    descricao: "Plano para operação comercial estruturada e time maior.",
    limiteMensalConsultas: 750,
    intervaloSegundos: 50,
    precoCentavos: 119700,
    valorConsultaAdicionalCentavos: 210,
    limiteCorretores: 18,
  },
  {
    nome: "Premium",
    slug: "premium",
    descricao: "Plano avançado para imobiliárias com alta demanda de captação.",
    limiteMensalConsultas: 1000,
    intervaloSegundos: 40,
    precoCentavos: 149700,
    valorConsultaAdicionalCentavos: 180,
    limiteCorretores: 26,
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
        valorConsultaAdicionalCentavos: plano.valorConsultaAdicionalCentavos,
        limiteCorretores: plano.limiteCorretores,
        status: "ATIVO",
      },
      create: {
        ...plano,
        status: "ATIVO",
      },
    });
  }

  const planoStart = await prisma.plano.findUnique({
    where: {
      slug: "start",
    },
  });

  if (planoStart) {
    await prisma.cliente.updateMany({
      where: {
        planoId: null,
      },
      data: {
        planoId: planoStart.id,
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
