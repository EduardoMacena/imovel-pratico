-- CreateEnum
CREATE TYPE "PagamentoStatus" AS ENUM ('PAGO', 'PENDENTE', 'VENCIDO', 'CANCELADO');

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "limiteMensalConsultas" INTEGER NOT NULL DEFAULT 300,
ADD COLUMN     "pagamentoStatus" "PagamentoStatus" NOT NULL DEFAULT 'PENDENTE',
ADD COLUMN     "pagamentoVenceEm" TIMESTAMP(3);
