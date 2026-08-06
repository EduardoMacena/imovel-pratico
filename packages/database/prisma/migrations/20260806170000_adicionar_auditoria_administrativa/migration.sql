CREATE TABLE "auditorias_administrativas" (
  "id" TEXT NOT NULL,
  "clienteId" TEXT,
  "usuarioId" TEXT,
  "acao" TEXT NOT NULL,
  "entidade" TEXT NOT NULL,
  "entidadeId" TEXT,
  "mensagem" TEXT NOT NULL,
  "executorEmail" TEXT NOT NULL,
  "executorRole" "UsuarioRole" NOT NULL,
  "requestId" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "dadosAntes" JSONB,
  "dadosDepois" JSONB,
  "camposAlterados" JSONB,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "auditorias_administrativas_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "auditorias_administrativas_clienteId_idx" ON "auditorias_administrativas"("clienteId");
CREATE INDEX "auditorias_administrativas_usuarioId_idx" ON "auditorias_administrativas"("usuarioId");
CREATE INDEX "auditorias_administrativas_acao_idx" ON "auditorias_administrativas"("acao");
CREATE INDEX "auditorias_administrativas_entidade_entidadeId_idx" ON "auditorias_administrativas"("entidade", "entidadeId");
CREATE INDEX "auditorias_administrativas_createdAt_idx" ON "auditorias_administrativas"("createdAt");
ALTER TABLE "auditorias_administrativas" ADD CONSTRAINT "auditorias_administrativas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "auditorias_administrativas" ADD CONSTRAINT "auditorias_administrativas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
