/*
  Warnings:

  - You are about to drop the column `clienteId` on the `imoveis_cache` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[indiceCadastral]` on the table `imoveis_cache` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "imoveis_cache" DROP CONSTRAINT "imoveis_cache_clienteId_fkey";

-- DropIndex
DROP INDEX "imoveis_cache_clienteId_idx";

-- DropIndex
DROP INDEX "imoveis_cache_clienteId_indiceCadastral_key";

-- AlterTable
ALTER TABLE "imoveis_cache" DROP COLUMN "clienteId";

-- CreateIndex
CREATE UNIQUE INDEX "imoveis_cache_indiceCadastral_key" ON "imoveis_cache"("indiceCadastral");
