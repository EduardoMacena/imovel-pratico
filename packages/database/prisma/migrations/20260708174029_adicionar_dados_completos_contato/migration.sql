-- AlterTable
ALTER TABLE "imoveis_cache" ADD COLUMN     "dadosContato" JSONB,
ADD COLUMN     "fonteContato" TEXT;

-- AlterTable
ALTER TABLE "tarefa_resultados" ADD COLUMN     "dadosContato" JSONB,
ADD COLUMN     "fonteContato" TEXT;
