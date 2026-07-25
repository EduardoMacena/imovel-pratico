-- CreateEnum
CREATE TYPE "WorkerAgentTipo" AS ENUM ('REGISTRO', 'CND');

-- CreateEnum
CREATE TYPE "WorkerAgentStatus" AS ENUM ('ATIVO', 'INATIVO', 'REVOGADO');

-- AlterTable
ALTER TABLE "buscas_previas" ADD COLUMN     "agentLeaseExpiraEm" TIMESTAMP(3),
ADD COLUMN     "agentTentativas" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "agentWorkerId" TEXT;

-- AlterTable
ALTER TABLE "tarefas" ADD COLUMN     "agentLeaseExpiraEm" TIMESTAMP(3),
ADD COLUMN     "agentTentativas" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "agentWorkerId" TEXT;

-- CreateTable
CREATE TABLE "worker_agents" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipo" "WorkerAgentTipo" NOT NULL,
    "identificador" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "WorkerAgentStatus" NOT NULL DEFAULT 'ATIVO',
    "ultimoSinalEm" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "worker_agents_tokenHash_key" ON "worker_agents"("tokenHash");

-- CreateIndex
CREATE INDEX "worker_agents_clienteId_idx" ON "worker_agents"("clienteId");

-- CreateIndex
CREATE INDEX "worker_agents_tipo_idx" ON "worker_agents"("tipo");

-- CreateIndex
CREATE INDEX "worker_agents_status_idx" ON "worker_agents"("status");

-- CreateIndex
CREATE INDEX "worker_agents_ultimoSinalEm_idx" ON "worker_agents"("ultimoSinalEm");

-- CreateIndex
CREATE UNIQUE INDEX "worker_agents_clienteId_tipo_identificador_key" ON "worker_agents"("clienteId", "tipo", "identificador");

-- CreateIndex
CREATE INDEX "buscas_previas_agentWorkerId_idx" ON "buscas_previas"("agentWorkerId");

-- CreateIndex
CREATE INDEX "buscas_previas_agentLeaseExpiraEm_idx" ON "buscas_previas"("agentLeaseExpiraEm");

-- CreateIndex
CREATE INDEX "tarefas_agentWorkerId_idx" ON "tarefas"("agentWorkerId");

-- CreateIndex
CREATE INDEX "tarefas_agentLeaseExpiraEm_idx" ON "tarefas"("agentLeaseExpiraEm");

-- AddForeignKey
ALTER TABLE "worker_agents" ADD CONSTRAINT "worker_agents_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
