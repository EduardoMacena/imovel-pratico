-- Fundação de identidade empresarial opcional para clientes existentes.
ALTER TABLE "clientes"
ADD COLUMN "cnpj" TEXT,
ADD COLUMN "razaoSocial" TEXT,
ADD COLUMN "nomeFantasia" TEXT,
ADD COLUMN "emailComercial" TEXT,
ADD COLUMN "telefoneComercial" TEXT,
ADD COLUMN "enderecoCep" TEXT,
ADD COLUMN "enderecoLogradouro" TEXT,
ADD COLUMN "enderecoNumero" TEXT,
ADD COLUMN "enderecoComplemento" TEXT,
ADD COLUMN "enderecoBairro" TEXT,
ADD COLUMN "enderecoCidade" TEXT,
ADD COLUMN "enderecoUf" TEXT;

-- PostgreSQL permite múltiplos NULLs em índice UNIQUE.
-- Assim, clientes legados continuam válidos e CNPJs informados são exclusivos.
CREATE UNIQUE INDEX "clientes_cnpj_key" ON "clientes"("cnpj");
