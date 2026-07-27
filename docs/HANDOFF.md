# Handoff do projeto Imóvel Prático

Atualize este documento ao encerrar uma sessão relevante de desenvolvimento.

## Estado atual

- Branch principal: `master`.
- Branch da fase atual: `docs/atualiza-estabilizacao`.
- Último baseline técnico: 27/07/2026.
- Typecheck do monorepo: 13 tarefas aprovadas em 10 workspaces.
- Build do monorepo: 10 tarefas aprovadas em 10 workspaces.
- Node obrigatório: `24.18.0`.
- pnpm obrigatório: `10.0.0`.
- Fase 0 concluída: baseline técnico.
- Fase 1 concluída: governança técnica e documentação.
- Fase 1.5 concluída: governança Git e Pull Requests.
- Fase 2 concluída: estabilização da toolchain e das dependências.

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

## Estabilização concluída

- Node `24.18.0` e pnpm `10.0.0` fixados no projeto.
- Dependências diretas fixadas em versões explícitas.
- TypeScript alinhado em `5.9.3` em todos os workspaces.
- `tsx` alinhado em `4.23.1` nos workspaces que o utilizam.
- BullMQ alinhado em `5.80.10` nos workers e no pacote de fila.
- Aplicações web alinhadas em Next.js `16.2.11`, React `19.2.8` e
  React DOM `19.2.8`.
- Dependências transitivas seguras corrigidas:
  `fast-uri`, `find-my-way`, `postcss`, `sharp` e `valibot`.
- Árvore do ExcelJS mitigada com `uuid 11.1.1`,
  `brace-expansion 1.1.16` e `brace-expansion 2.1.2`.
- Instalação com lockfile congelado, exportação XLSX, Prisma, Sharp,
  Fastify, BullMQ, typecheck e build foram validados.

## Riscos e pendências conhecidos

- O `pnpm audit --prod` ainda reporta dois alertas altos do
  `GHSA-mh99-v99m-4gvg`, originados por `brace-expansion` na árvore do
  ExcelJS.
- A correção integral desse advisory exigiria forçar
  `brace-expansion 5.0.8` em dependências antigas. Essa mudança foi
  rejeitada após incompatibilidade comprovada em simulação.
- Scripts de lint ainda são placeholders.
- A cobertura automatizada de testes ainda não foi consolidada.
- O typecheck em checkout limpo exige build prévio das dependências internas
  que publicam tipos em `dist`.
- Builds Next.js no Windows podem emitir avisos de caminho longo ao processar
  diretórios `.next/standalone`, sem falhar o build.

## Próxima tarefa recomendada

1. concluir este PR de atualização documental;
2. retornar à `master` e sincronizar com `origin/master`;
3. definir a primeira entrega funcional vertical com critérios de aceite;
4. criar uma branch `feat/*` exclusiva para essa entrega;
5. implementar a funcionalidade preservando as invariantes de domínio;
6. incluir validações e testes mínimos do fluxo alterado;
7. executar typecheck, build e testes aplicáveis antes do PR.

A Fase 3 de qualidade automatizada deve avançar incrementalmente junto às
entregas funcionais, sem criar outra etapa longa de preparação.

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
