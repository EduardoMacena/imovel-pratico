ALTER TABLE "planos"
ADD COLUMN IF NOT EXISTS "valorConsultaAdicionalCentavos" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "limiteCorretores" INTEGER;

ALTER TABLE "tarefas"
ADD COLUMN IF NOT EXISTS "excedenteAutorizado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "excedenteAutorizadoEm" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "consultasEstimadas" INTEGER,
ADD COLUMN IF NOT EXISTS "consultasDisponiveisNoMomento" INTEGER,
ADD COLUMN IF NOT EXISTS "consultasExcedentesEstimadas" INTEGER,
ADD COLUMN IF NOT EXISTS "valorConsultaAdicionalCentavos" INTEGER,
ADD COLUMN IF NOT EXISTS "valorExcedenteEstimadoCentavos" INTEGER;
