/*
  Warnings:

  - A unique constraint covering the columns `[resetSenhaTokenHash]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "resetSenhaExpiraEm" TIMESTAMP(3),
ADD COLUMN     "resetSenhaTokenHash" TEXT,
ADD COLUMN     "resetSenhaUsadoEm" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_resetSenhaTokenHash_key" ON "usuarios"("resetSenhaTokenHash");
