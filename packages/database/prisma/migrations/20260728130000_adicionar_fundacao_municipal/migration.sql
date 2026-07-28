-- CreateEnum
CREATE TYPE "MunicipioStatus" AS ENUM (
  'EM_IMPLANTACAO',
  'EM_HOMOLOGACAO',
  'ATIVO',
  'INSTAVEL',
  'PAUSADO',
  'DESCONTINUADO'
);

-- CreateTable
CREATE TABLE "municipios" (
  "id" TEXT NOT NULL,
  "codigoIbge" TEXT NOT NULL,
  "nome" TEXT NOT NULL,
  "uf" TEXT NOT NULL,
  "status" "MunicipioStatus" NOT NULL DEFAULT 'EM_IMPLANTACAO',
  "configuracao" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "municipios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente_municipios" (
  "id" TEXT NOT NULL,
  "clienteId" TEXT NOT NULL,
  "municipioId" TEXT NOT NULL,
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "principal" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "cliente_municipios_pkey" PRIMARY KEY ("id")
);

-- Seed do municipio legado
INSERT INTO "municipios" (
  "id",
  "codigoIbge",
  "nome",
  "uf",
  "status",
  "configuracao",
  "createdAt",
  "updatedAt"
)
VALUES (
  '31062000-0000-4000-8000-000000000001',
  '3106200',
  'Belo Horizonte',
  'MG',
  'ATIVO',
  '{
    "buscaPorEndereco": true,
    "buscaPorCodigo": true,
    "monitoramentoTitularidade": false,
    "execucaoPorAgent": true,
    "cacheDias": 90
  }'::jsonb,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- AlterTable
ALTER TABLE "tarefas"
ADD COLUMN "municipioId" TEXT NOT NULL
DEFAULT '31062000-0000-4000-8000-000000000001';

-- AlterTable
ALTER TABLE "buscas_previas"
ADD COLUMN "municipioId" TEXT NOT NULL
DEFAULT '31062000-0000-4000-8000-000000000001';

-- AlterTable
ALTER TABLE "imoveis_cache"
ADD COLUMN "municipioId" TEXT NOT NULL
DEFAULT '31062000-0000-4000-8000-000000000001';

-- CreateIndex
CREATE UNIQUE INDEX "municipios_codigoIbge_key"
ON "municipios"("codigoIbge");

-- CreateIndex
CREATE INDEX "municipios_uf_nome_idx"
ON "municipios"("uf", "nome");

-- CreateIndex
CREATE INDEX "municipios_status_idx"
ON "municipios"("status");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_municipios_clienteId_municipioId_key"
ON "cliente_municipios"("clienteId", "municipioId");

-- CreateIndex
CREATE INDEX "cliente_municipios_municipioId_idx"
ON "cliente_municipios"("municipioId");

-- CreateIndex
CREATE INDEX "cliente_municipios_clienteId_ativo_idx"
ON "cliente_municipios"("clienteId", "ativo");

-- Backfill dos clientes existentes
INSERT INTO "cliente_municipios" (
  "id",
  "clienteId",
  "municipioId",
  "ativo",
  "principal",
  "createdAt",
  "updatedAt"
)
SELECT
  SUBSTRING(MD5("clientes"."id" || ':3106200'), 1, 8)
    || '-'
    || SUBSTRING(MD5("clientes"."id" || ':3106200'), 9, 4)
    || '-4'
    || SUBSTRING(MD5("clientes"."id" || ':3106200'), 14, 3)
    || '-a'
    || SUBSTRING(MD5("clientes"."id" || ':3106200'), 18, 3)
    || '-'
    || SUBSTRING(MD5("clientes"."id" || ':3106200'), 21, 12),
  "clientes"."id",
  '31062000-0000-4000-8000-000000000001',
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "clientes";

-- CreateIndex
CREATE INDEX "tarefas_municipioId_idx"
ON "tarefas"("municipioId");

-- CreateIndex
CREATE INDEX "buscas_previas_municipioId_idx"
ON "buscas_previas"("municipioId");

-- CreateIndex
CREATE UNIQUE INDEX "imoveis_cache_municipioId_indiceCadastral_key"
ON "imoveis_cache"("municipioId", "indiceCadastral");

-- CreateIndex
CREATE INDEX "imoveis_cache_municipioId_idx"
ON "imoveis_cache"("municipioId");

-- AddForeignKey
ALTER TABLE "cliente_municipios"
ADD CONSTRAINT "cliente_municipios_clienteId_fkey"
FOREIGN KEY ("clienteId")
REFERENCES "clientes"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_municipios"
ADD CONSTRAINT "cliente_municipios_municipioId_fkey"
FOREIGN KEY ("municipioId")
REFERENCES "municipios"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefas"
ADD CONSTRAINT "tarefas_municipioId_fkey"
FOREIGN KEY ("municipioId")
REFERENCES "municipios"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buscas_previas"
ADD CONSTRAINT "buscas_previas_municipioId_fkey"
FOREIGN KEY ("municipioId")
REFERENCES "municipios"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis_cache"
ADD CONSTRAINT "imoveis_cache_municipioId_fkey"
FOREIGN KEY ("municipioId")
REFERENCES "municipios"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
