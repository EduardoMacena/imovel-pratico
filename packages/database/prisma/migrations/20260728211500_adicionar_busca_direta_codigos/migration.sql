-- CreateEnum
CREATE TYPE "TipoBusca" AS ENUM (
  'ENDERECO',
  'CODIGOS_CADASTRAIS'
);

-- AlterTable
ALTER TABLE "tarefas"
ADD COLUMN "tipoBusca" "TipoBusca" NOT NULL DEFAULT 'ENDERECO';

-- AlterTable
ALTER TABLE "buscas_previas"
ADD COLUMN "tipoBusca" "TipoBusca" NOT NULL DEFAULT 'ENDERECO';

-- CreateIndex
CREATE INDEX "tarefas_tipoBusca_idx"
ON "tarefas"("tipoBusca");

-- CreateIndex
CREATE INDEX "buscas_previas_tipoBusca_idx"
ON "buscas_previas"("tipoBusca");
