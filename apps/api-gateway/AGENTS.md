# AGENTS.md — API Gateway

## Responsabilidade

Centralizar autenticação, autorização, regras de domínio, persistência,
orquestração de filas, endpoints administrativos, realtime e contratos usados
pelos agents.

## Regras

- Controllers validam entrada, traduzem HTTP e chamam services.
- Services concentram regra de negócio e acesso ao banco.
- Schemas Zod são a fonte de validação de parâmetros, query e body.
- Não retornar senha, hash, token persistido ou detalhes internos de erro.
- Toda consulta de usuário comum deve ser limitada por `clienteId`.
- Rotas administrativas exigem `authMiddleware` e `adminMiddleware`.
- Operações multi-etapas que precisam ser atômicas usam transação Prisma.
- Erros esperados devem ter tipo ou código claro; evitar `catch` genérico
  repetido em cada controller.
- Não colocar novas responsabilidades em `admin.service.ts`; criar módulo ou
  service específico por domínio.
- Mudanças de contrato devem atualizar tipos e consumidores web/agent.
- Logs devem ser estruturados e sem dados pessoais completos.

## Validação

```bash
pnpm --filter @imovel-pratico/api-gateway typecheck
pnpm --filter @imovel-pratico/api-gateway build
```
