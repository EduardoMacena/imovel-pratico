ALTER TYPE "BuscaPreviaStatus" ADD VALUE IF NOT EXISTS 'PROCESSANDO';
ALTER TYPE "BuscaPreviaStatus" ADD VALUE IF NOT EXISTS 'AGUARDANDO_INTERVALO';
ALTER TYPE "BuscaPreviaStatus" ADD VALUE IF NOT EXISTS 'CONSULTANDO_REGISTRO';
ALTER TYPE "BuscaPreviaStatus" ADD VALUE IF NOT EXISTS 'PRONTA';
ALTER TYPE "BuscaPreviaStatus" ADD VALUE IF NOT EXISTS 'AGUARDANDO_AUTORIZACAO_EXCEDENTE';
ALTER TYPE "BuscaPreviaStatus" ADD VALUE IF NOT EXISTS 'AUTORIZANDO';
ALTER TYPE "BuscaPreviaStatus" ADD VALUE IF NOT EXISTS 'ERRO';

ALTER TABLE "buscas_previas"
ALTER COLUMN "quantidadeRegistros" SET DEFAULT 0;

ALTER TABLE "buscas_previas"
ALTER COLUMN "registros" SET DEFAULT '[]'::jsonb;

UPDATE "buscas_previas"
SET "registros" = '[]'::jsonb
WHERE "registros" IS NULL;

UPDATE "buscas_previas"
SET "quantidadeRegistros" = 0
WHERE "quantidadeRegistros" IS NULL;
