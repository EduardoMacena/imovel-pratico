-- CreateEnum
CREATE TYPE "ClienteStatus" AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO');

-- CreateEnum
CREATE TYPE "UsuarioRole" AS ENUM ('ADMIN', 'GERENTE', 'OPERADOR');

-- CreateEnum
CREATE TYPE "TarefaStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'ERROR', 'CANCELED');

-- CreateEnum
CREATE TYPE "ResultadoStatus" AS ENUM ('SUCCESS', 'ERROR');

-- CreateEnum
CREATE TYPE "CacheStatus" AS ENUM ('VALID', 'EXPIRED', 'UPDATING', 'ERROR');

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ClienteStatus" NOT NULL DEFAULT 'ATIVO',
    "workerUrl" TEXT,
    "intervaloSegundos" INTEGER NOT NULL DEFAULT 30,
    "limiteDiario" INTEGER NOT NULL DEFAULT 300,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "UsuarioRole" NOT NULL DEFAULT 'OPERADOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "status" "TarefaStatus" NOT NULL DEFAULT 'PENDING',
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "mesAnoInicio" TEXT NOT NULL,
    "mesAnoFinal" TEXT NOT NULL,
    "intervaloSegundos" INTEGER NOT NULL DEFAULT 30,
    "forceRefresh" BOOLEAN NOT NULL DEFAULT false,
    "total" INTEGER NOT NULL DEFAULT 0,
    "current" INTEGER NOT NULL DEFAULT 0,
    "erro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefa_resultados" (
    "id" TEXT NOT NULL,
    "tarefaId" TEXT NOT NULL,
    "status" "ResultadoStatus" NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "indiceCadastral" TEXT NOT NULL,
    "nome" TEXT,
    "cpf" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "erro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarefa_resultados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imoveis_cache" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "indiceCadastral" TEXT NOT NULL,
    "nome" TEXT,
    "cpf" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "status" "CacheStatus" NOT NULL DEFAULT 'VALID',
    "ultimaConsultaEm" TIMESTAMP(3) NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imoveis_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas_logs" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT,
    "fonte" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "sucesso" BOOLEAN NOT NULL,
    "duracaoMs" INTEGER,
    "mensagemErro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultas_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_slug_key" ON "clientes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_clienteId_idx" ON "usuarios"("clienteId");

-- CreateIndex
CREATE INDEX "tarefas_clienteId_idx" ON "tarefas"("clienteId");

-- CreateIndex
CREATE INDEX "tarefas_status_idx" ON "tarefas"("status");

-- CreateIndex
CREATE INDEX "tarefa_resultados_tarefaId_idx" ON "tarefa_resultados"("tarefaId");

-- CreateIndex
CREATE INDEX "tarefa_resultados_indiceCadastral_idx" ON "tarefa_resultados"("indiceCadastral");

-- CreateIndex
CREATE INDEX "imoveis_cache_clienteId_idx" ON "imoveis_cache"("clienteId");

-- CreateIndex
CREATE INDEX "imoveis_cache_indiceCadastral_idx" ON "imoveis_cache"("indiceCadastral");

-- CreateIndex
CREATE INDEX "imoveis_cache_expiraEm_idx" ON "imoveis_cache"("expiraEm");

-- CreateIndex
CREATE UNIQUE INDEX "imoveis_cache_clienteId_indiceCadastral_key" ON "imoveis_cache"("clienteId", "indiceCadastral");

-- CreateIndex
CREATE INDEX "consultas_logs_clienteId_idx" ON "consultas_logs"("clienteId");

-- CreateIndex
CREATE INDEX "consultas_logs_fonte_idx" ON "consultas_logs"("fonte");

-- CreateIndex
CREATE INDEX "consultas_logs_createdAt_idx" ON "consultas_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefa_resultados" ADD CONSTRAINT "tarefa_resultados_tarefaId_fkey" FOREIGN KEY ("tarefaId") REFERENCES "tarefas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis_cache" ADD CONSTRAINT "imoveis_cache_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas_logs" ADD CONSTRAINT "consultas_logs_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
