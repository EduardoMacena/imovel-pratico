# AGENTS.md — Database

## Responsabilidade

Modelos Prisma, migrations, geração do cliente e seeds do Imóvel Prático.

## Regras

- Toda alteração de schema exige migration nova.
- Nunca editar migration já aplicada.
- Não executar `migrate reset` fora de banco descartável.
- Preservar isolamento por `clienteId` e relações multi-tenant.
- Revisar índices para filtros operacionais e unicidade de contratos.
- Definir explicitamente comportamento de exclusão quando houver risco de órfão.
- Seeds devem ser idempotentes sempre que possível.
- Valores monetários permanecem em centavos inteiros.
- Datas de vencimento e referência devem preservar a convenção existente.
- Mudanças em enums exigem revisão de API, workers e interfaces.

## Validação

```bash
pnpm --filter @imovel-pratico/database typecheck
pnpm --filter @imovel-pratico/database build
```
