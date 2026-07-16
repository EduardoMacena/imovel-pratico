DO $$
BEGIN
  CREATE TYPE "BuscaPreviaStatus" AS ENUM ('PENDENTE', 'CONFIRMADA', 'EXPIRADA', 'CANCELADA');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "buscas_previas" (
  "id" TEXT NOT NULL,
  "clienteId" TEXT NOT NULL,
  "status" "BuscaPreviaStatus" NOT NULL DEFAULT 'PENDENTE',
  "logradouro" TEXT NOT NULL,
  "numero" TEXT NOT NULL,
  "quantidadeRegistros" INTEGER NOT NULL,
  "registros" JSONB NOT NULL,
  "consultasDisponiveisNoMomento" INTEGER NOT NULL,
  "consultasExcedentesEstimadas" INTEGER NOT NULL,
  "valorConsultaAdicionalCentavos" INTEGER NOT NULL,
  "valorExcedenteEstimadoCentavos" INTEGER NOT NULL,
  "workerUrl" TEXT,
  "erro" TEXT,
  "expiraEm" TIMESTAMP(3) NOT NULL,
  "confirmadaEm" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "buscas_previas_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "tarefas"
ADD COLUMN IF NOT EXISTS "buscaPreviaId" TEXT;

DO $$
BEGIN
  ALTER TABLE "buscas_previas"
  ADD CONSTRAINT "buscas_previas_clienteId_fkey"
  FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "tarefas"
  ADD CONSTRAINT "tarefas_buscaPreviaId_fkey"
  FOREIGN KEY ("buscaPreviaId") REFERENCES "buscas_previas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "buscas_previas_clienteId_idx" ON "buscas_previas"("clienteId");
CREATE INDEX IF NOT EXISTS "buscas_previas_status_idx" ON "buscas_previas"("status");
CREATE INDEX IF NOT EXISTS "buscas_previas_expiraEm_idx" ON "buscas_previas"("expiraEm");
CREATE INDEX IF NOT EXISTS "tarefas_buscaPreviaId_idx" ON "tarefas"("buscaPreviaId");
