-- CreateEnum
CREATE TYPE "OperacaoEventoNivel" AS ENUM ('INFO', 'WARN', 'ERROR');

-- CreateEnum
CREATE TYPE "OperacaoEventoServico" AS ENUM ('API_GATEWAY', 'WORKER_REGISTRO', 'WORKER_CND', 'QUEUE', 'REALTIME');

-- CreateEnum
CREATE TYPE "WorkerHeartbeatStatus" AS ENUM ('ONLINE', 'OFFLINE', 'ERROR');

-- DropIndex
DROP INDEX "tarefas_buscaPreviaId_idx";

-- AlterTable
ALTER TABLE "buscas_previas" ALTER COLUMN "status" SET DEFAULT 'PROCESSANDO',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "faturas" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "operacao_eventos" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT,
    "tarefaId" TEXT,
    "buscaPreviaId" TEXT,
    "nivel" "OperacaoEventoNivel" NOT NULL DEFAULT 'INFO',
    "servico" "OperacaoEventoServico" NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "detalhes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operacao_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_heartbeats" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "servico" "OperacaoEventoServico" NOT NULL,
    "identificador" TEXT NOT NULL,
    "fila" TEXT,
    "status" "WorkerHeartbeatStatus" NOT NULL DEFAULT 'ONLINE',
    "ultimoSinalEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_heartbeats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "operacao_eventos_clienteId_idx" ON "operacao_eventos"("clienteId");

-- CreateIndex
CREATE INDEX "operacao_eventos_tarefaId_idx" ON "operacao_eventos"("tarefaId");

-- CreateIndex
CREATE INDEX "operacao_eventos_buscaPreviaId_idx" ON "operacao_eventos"("buscaPreviaId");

-- CreateIndex
CREATE INDEX "operacao_eventos_nivel_idx" ON "operacao_eventos"("nivel");

-- CreateIndex
CREATE INDEX "operacao_eventos_servico_idx" ON "operacao_eventos"("servico");

-- CreateIndex
CREATE INDEX "operacao_eventos_tipo_idx" ON "operacao_eventos"("tipo");

-- CreateIndex
CREATE INDEX "operacao_eventos_createdAt_idx" ON "operacao_eventos"("createdAt");

-- CreateIndex
CREATE INDEX "worker_heartbeats_clienteId_idx" ON "worker_heartbeats"("clienteId");

-- CreateIndex
CREATE INDEX "worker_heartbeats_servico_idx" ON "worker_heartbeats"("servico");

-- CreateIndex
CREATE INDEX "worker_heartbeats_status_idx" ON "worker_heartbeats"("status");

-- CreateIndex
CREATE INDEX "worker_heartbeats_ultimoSinalEm_idx" ON "worker_heartbeats"("ultimoSinalEm");

-- CreateIndex
CREATE UNIQUE INDEX "worker_heartbeats_clienteId_servico_identificador_key" ON "worker_heartbeats"("clienteId", "servico", "identificador");

-- AddForeignKey
ALTER TABLE "operacao_eventos" ADD CONSTRAINT "operacao_eventos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operacao_eventos" ADD CONSTRAINT "operacao_eventos_tarefaId_fkey" FOREIGN KEY ("tarefaId") REFERENCES "tarefas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operacao_eventos" ADD CONSTRAINT "operacao_eventos_buscaPreviaId_fkey" FOREIGN KEY ("buscaPreviaId") REFERENCES "buscas_previas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_heartbeats" ADD CONSTRAINT "worker_heartbeats_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
