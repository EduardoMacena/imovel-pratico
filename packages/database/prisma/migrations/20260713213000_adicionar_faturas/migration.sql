DO $$
BEGIN
  CREATE TYPE "FaturaStatus" AS ENUM ('ABERTA', 'FECHADA', 'PAGA', 'VENCIDA', 'CANCELADA');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "FaturaItemTipo" AS ENUM ('MENSALIDADE', 'CONSULTA_EXCEDENTE', 'AJUSTE', 'DESCONTO');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "faturas" (
  "id" TEXT NOT NULL,
  "clienteId" TEXT NOT NULL,
  "status" "FaturaStatus" NOT NULL DEFAULT 'ABERTA',

  "referenciaMes" INTEGER NOT NULL,
  "referenciaAno" INTEGER NOT NULL,

  "planoId" TEXT,
  "planoNome" TEXT,

  "consultasInclusas" INTEGER NOT NULL DEFAULT 0,
  "consultasUsadas" INTEGER NOT NULL DEFAULT 0,
  "consultasExcedentes" INTEGER NOT NULL DEFAULT 0,

  "valorMensalidadeCentavos" INTEGER NOT NULL DEFAULT 0,
  "valorConsultaAdicionalCentavos" INTEGER NOT NULL DEFAULT 0,
  "valorExcedenteCentavos" INTEGER NOT NULL DEFAULT 0,
  "valorTotalCentavos" INTEGER NOT NULL DEFAULT 0,

  "vencimentoEm" TIMESTAMP(3),
  "pagaEm" TIMESTAMP(3),

  "observacao" TEXT,

  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "faturas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "fatura_itens" (
  "id" TEXT NOT NULL,
  "faturaId" TEXT NOT NULL,

  "tipo" "FaturaItemTipo" NOT NULL,
  "descricao" TEXT NOT NULL,

  "quantidade" INTEGER NOT NULL DEFAULT 1,
  "valorUnitarioCentavos" INTEGER NOT NULL,
  "valorTotalCentavos" INTEGER NOT NULL,

  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "fatura_itens_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  ALTER TABLE "faturas"
  ADD CONSTRAINT "faturas_clienteId_fkey"
  FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "fatura_itens"
  ADD CONSTRAINT "fatura_itens_faturaId_fkey"
  FOREIGN KEY ("faturaId") REFERENCES "faturas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "faturas_clienteId_referenciaMes_referenciaAno_key"
ON "faturas"("clienteId", "referenciaMes", "referenciaAno");

CREATE INDEX IF NOT EXISTS "faturas_clienteId_idx" ON "faturas"("clienteId");
CREATE INDEX IF NOT EXISTS "faturas_status_idx" ON "faturas"("status");
CREATE INDEX IF NOT EXISTS "faturas_vencimentoEm_idx" ON "faturas"("vencimentoEm");
CREATE INDEX IF NOT EXISTS "fatura_itens_faturaId_idx" ON "fatura_itens"("faturaId");
