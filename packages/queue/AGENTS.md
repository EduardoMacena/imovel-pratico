# AGENTS.md — Queue

## Responsabilidade

Contratos de jobs, nomes de filas por cliente, conexão Redis, realtime e
operações BullMQ compartilhadas.

## Regras

- Filas devem continuar isoladas por cliente.
- Jobs precisam de identificador estável quando a idempotência for necessária.
- Payloads devem ser tipados, pequenos e sem segredos.
- Não alterar tentativas, backoff, retenção ou concorrência silenciosamente.
- Remoção/cancelamento deve considerar estados waiting, delayed e active.
- Queue não deve importar services das aplicações.
- Mudanças de contrato exigem atualização coordenada de produtores e consumidores.

## Validação

```bash
pnpm --filter @imovel-pratico/queue typecheck
pnpm --filter @imovel-pratico/queue build
```
