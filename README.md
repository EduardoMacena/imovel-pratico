# Imóvel Prático

Plataforma de inteligência para captação imobiliária.

## Estrutura

- `apps/web-home`: site público
- `apps/web-admin`: painel administrativo interno
- `apps/web-client`: sistema usado pelas imobiliárias
- `apps/api-gateway`: API central
- `apps/worker-registro`: worker de busca de índice cadastral
- `apps/worker-cnd`: worker de busca de proprietário/CPF
- `apps/worker-contatos`: worker de busca de contatos

## Packages

- `packages/database`: Prisma/PostgreSQL
- `packages/redis`: conexão Redis
- `packages/queue`: filas BullMQ
- `packages/logger`: logs
- `packages/config`: variáveis de ambiente
- `packages/types`: tipos compartilhados
- `packages/validators`: schemas Zod
- `packages/ui`: componentes compartilhados
- `packages/utils`: funções utilitárias
