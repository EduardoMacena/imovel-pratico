# Handoff do projeto Imóvel Prático

Atualize este documento ao encerrar uma sessão relevante de desenvolvimento.

## Estado atual

- Branch principal: `master`.
- Branch da fase atual: `chore/organiza-workflow-git`.
- Último baseline técnico: 25/07/2026.
- Typecheck do monorepo: aprovado em 10 workspaces.
- Node obrigatório: `24.18.0`.
- pnpm obrigatório: `10.0.0`.
- Fase 1 concluída: governança técnica e documentação.
- Fase 1.5 em execução: governança Git e Pull Requests.

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
- Dependências diretas fixadas; TypeScript alinhado em `5.9.3` em todos os workspaces. Next/React e BullMQ permanecem para fatias separadas.
- `tsx` alinhado em `4.23.1` em todos os workspaces que o utilizam.
- TypeScript alinhado em `5.9.3` em todos os workspaces; Next/React e BullMQ permanecem para fatias separadas.
- Scripts de lint ainda são placeholders.
- Cobertura automatizada de testes ainda não foi confirmada.
- O typecheck em checkout limpo exige build prévio das dependências internas que publicam tipos em `dist`.
- README anterior descrevia packages que não existem no estado atual.

## Próxima tarefa recomendada

Concluir a governança Git:

1. revisar os arquivos de workflow e contribuição;
2. validar o Pull Request;
3. configurar proteção da `master` no GitHub;
4. analisar a branch remota legada `origin/develop`;
5. fazer merge;
6. confirmar a integração antes de excluir branches;
7. limpar scripts, relatórios e backups temporários.

Depois, iniciar a estabilização das dependências em branch própria.

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
