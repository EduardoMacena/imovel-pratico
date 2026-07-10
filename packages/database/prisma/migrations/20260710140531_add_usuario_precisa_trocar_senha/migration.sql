-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "precisaTrocarSenha" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "senhaAlteradaEm" TIMESTAMP(3);
