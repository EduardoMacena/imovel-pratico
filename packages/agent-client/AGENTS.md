# AGENTS.md — Agent Client

## Responsabilidade

Cliente HTTP compartilhado pelos agents para autenticação, polling, heartbeat,
progresso e conclusão de jobs.

## Regras

- Token deve ir somente no header autorizado e nunca em logs.
- Preservar timeouts específicos por operação.
- Erros HTTP devem manter status e contexto seguro para retry.
- Não acoplar o package ao Electron, Playwright ou banco.
- Mudanças de endpoint precisam ser coordenadas com a API e ambos os workers.
- Operações de sucesso e erro devem ser idempotentes do lado servidor.

## Validação

```bash
pnpm --filter @imovel-pratico/agent-client typecheck
pnpm --filter @imovel-pratico/agent-client build
```
