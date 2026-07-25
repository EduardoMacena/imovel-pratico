-- CreateEnum
CREATE TYPE "ClienteModoProcessamento" AS ENUM ('QUEUE', 'AGENT');

-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "modoProcessamento" "ClienteModoProcessamento" NOT NULL DEFAULT 'QUEUE';
