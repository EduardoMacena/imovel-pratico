-- CreateEnum
CREATE TYPE "PlanoStatus" AS ENUM ('ATIVO', 'INATIVO');

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "planoId" TEXT,
ALTER COLUMN "intervaloSegundos" SET DEFAULT 60;

-- CreateTable
CREATE TABLE "planos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "limiteMensalConsultas" INTEGER NOT NULL,
    "intervaloSegundos" INTEGER NOT NULL,
    "precoCentavos" INTEGER NOT NULL,
    "status" "PlanoStatus" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "planos_slug_key" ON "planos"("slug");

-- CreateIndex
CREATE INDEX "clientes_planoId_idx" ON "clientes"("planoId");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "planos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
