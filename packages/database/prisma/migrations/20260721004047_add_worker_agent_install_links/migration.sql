-- CreateEnum
CREATE TYPE "WorkerAgentInstallLinkStatus" AS ENUM ('PENDENTE', 'USADO', 'EXPIRADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "worker_agent_install_links" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "codigoHash" TEXT NOT NULL,
    "status" "WorkerAgentInstallLinkStatus" NOT NULL DEFAULT 'PENDENTE',
    "identificadorBase" TEXT NOT NULL,
    "incluirRegistro" BOOLEAN NOT NULL DEFAULT true,
    "incluirCnd" BOOLEAN NOT NULL DEFAULT true,
    "usadoEm" TIMESTAMP(3),
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_agent_install_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "worker_agent_install_links_codigoHash_key" ON "worker_agent_install_links"("codigoHash");

-- CreateIndex
CREATE INDEX "worker_agent_install_links_clienteId_idx" ON "worker_agent_install_links"("clienteId");

-- CreateIndex
CREATE INDEX "worker_agent_install_links_status_idx" ON "worker_agent_install_links"("status");

-- CreateIndex
CREATE INDEX "worker_agent_install_links_expiraEm_idx" ON "worker_agent_install_links"("expiraEm");

-- AddForeignKey
ALTER TABLE "worker_agent_install_links" ADD CONSTRAINT "worker_agent_install_links_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
