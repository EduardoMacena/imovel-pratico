# AGENTS.md — Worker CND

## Responsabilidade

Consultar CND, recuperar dados de proprietário, aplicar cache e enriquecer
contatos por fontes autorizadas.

## Regras

- Consultar cache antes da fonte externa quando `forceRefresh` não exigir nova
  consulta.
- Preservar intervalo, lease, tentativas, cancelamento e progresso.
- Não criar concorrência por cliente sem análise de limite da fonte.
- Queue e Agent devem respeitar o mesmo contrato de resultado.
- CPF deve permanecer mascarado em logs e respostas que não exijam valor completo.
- Tokens e chaves nunca podem aparecer em logs.
- Dados de contato completos ficam em estrutura própria, sem perda do retorno
  original necessário para auditoria.
- Falhas de CND ou contato devem ser distinguíveis e observáveis.
- Mudanças Playwright precisam considerar headless, Chrome real, locale,
  timezone e comportamento em Windows.

## Validação

```bash
pnpm --filter @imovel-pratico/worker-cnd typecheck
pnpm --filter @imovel-pratico/worker-cnd build
```
