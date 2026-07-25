# AGENTS.md — Worker Registro

## Responsabilidade

Consultar a fonte de Registro para descobrir índices cadastrais e preparar a
busca de proprietários.

## Regras

- Preservar o rate limiter e o intervalo mínimo configurado.
- Não executar consultas paralelas do mesmo cliente sem decisão arquitetural.
- Tornar jobs idempotentes e respeitar cancelamento, lease e tentativas.
- Queue e Agent devem produzir o mesmo resultado de domínio.
- Mudanças em seletores Playwright exigem logs diagnósticos claros.
- Não contornar CAPTCHA, bloqueios ou controles de acesso.
- Nunca registrar tokens ou dados pessoais desnecessários.
- Falha externa deve atualizar status e monitoramento de forma recuperável.

## Validação

```bash
pnpm --filter @imovel-pratico/worker-registro typecheck
pnpm --filter @imovel-pratico/worker-registro build
```
