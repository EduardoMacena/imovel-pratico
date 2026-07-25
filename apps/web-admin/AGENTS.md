# AGENTS.md — Web Admin

## Responsabilidade

Painel interno de super administração para clientes, usuários, planos, tarefas,
faturas, agents e monitoramento operacional.

## Regras

- Preservar `useRequireSuperAdmin` e a autorização da API.
- Não confiar apenas no bloqueio visual; a API continua sendo autoridade.
- Ações financeiras, revogações, cancelamentos e reprocessamentos precisam de
  confirmação e feedback inequívoco.
- Monitoramento deve diferenciar estado registrado e estado operacional.
- Não exibir tokens antigos; tokens novos só aparecem no momento de criação.
- Detalhes extensos devem usar seções expansíveis.
- Componentes não devem replicar cálculo financeiro da API.
- Manter estados de loading, vazio, erro, sucesso e atualização.
- Preservar a linguagem visual premium e a produtividade do operador.

## Validação

```bash
pnpm --filter @imovel-pratico/web-admin typecheck
pnpm --filter @imovel-pratico/web-admin build
```
