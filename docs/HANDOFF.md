# Handoff do projeto Imóvel Prático

Atualize este documento ao encerrar uma sessão relevante de desenvolvimento.

## Estado atual

- Branch de trabalho observada no baseline: `chore/infra-publicacao`.
- Último baseline técnico: 25/07/2026.
- Typecheck do monorepo: aprovado em 10 workspaces.
- Node obrigatório: `24.18.0`.
- pnpm obrigatório: `10.0.0`.
- Fase atual: governança e documentação.

## Arquitetura em uso

- Aplicações: home, client, admin, API, workers e Agent Windows.
- Banco: PostgreSQL + Prisma.
- Filas: Redis + BullMQ.
- Processamento por cliente: Queue ou Agent.
- Agent final comunica por API HTTPS e não recebe acesso direto ao banco/Redis.

## Invariantes a preservar

- Isolamento por `clienteId`.
- Billing e excedente calculados no backend.
- Cache antes de CND quando permitido.
- `forceRefresh` força atualização.
- Tokens de agent exibidos apenas no momento permitido.
- Worker Registro e CND respeitam intervalos e leases.
- Alterações visuais não mudam regra de domínio.

## Riscos conhecidos

- O repositório ainda declarava Node 20.19.5, versão EOL, antes desta fase.
- Alguns workspaces resolveram TypeScript 7.0.2 enquanto outros usam 5.9.3.
- Vários `package.json` ainda usam `latest`.
- Scripts de lint ainda são placeholders.
- Cobertura automatizada de testes ainda não foi confirmada.
- README anterior descrevia packages que não existem no estado atual.

## Próxima tarefa recomendada

Estabilizar a toolchain em uma branch própria:

1. confirmar Node 24.18.0 em desenvolvimento, CI e Docker;
2. registrar versões resolvidas;
3. propor versões explícitas;
4. aplicar em um patch isolado;
5. instalar com lockfile revisado;
6. rodar typecheck e build;
7. testar o instalador Windows.

## Formato de continuidade

Ao concluir uma tarefa, registrar:

- objetivo;
- arquivos alterados;
- decisões;
- comandos executados;
- validações;
- pendências;
- próximo passo;
- commit sugerido.
