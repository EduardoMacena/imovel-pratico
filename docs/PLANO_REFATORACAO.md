# Plano de refatoração do Imóvel Prático

## Princípios

- Refatorar por fatias pequenas e verificáveis.
- Preservar comportamento antes de mudar arquitetura.
- Criar baseline e testes de caracterização antes de mudanças profundas.
- Separar estabilidade técnica de novas funcionalidades.
- Validar cada fase com typecheck, build e testes aplicáveis.

## Fase 0 — Baseline

Status: concluída em 25/07/2026.

- Estrutura e arquivos versionados coletados.
- Dez workspaces passaram no typecheck.
- Confirmado Node `24.18.0` LTS como runtime oficial do projeto.
- Identificada ausência de `AGENTS.md`.
- Identificado uso de versões `latest` e TypeScript divergente.
- Identificada documentação raiz desatualizada.

## Fase 1 — Governança e documentação

Status: concluída em 25/07/2026.

- `AGENTS.md` hierárquicos criados.
- Arquitetura real consolidada.
- README atualizado.
- Handoff e regras de continuidade registrados.
- Artefatos locais de diagnóstico ignorados.
- Node `24.18.0` alinhado em ambiente, Docker e documentação.

Esta fase não alterou comportamento de produção.

## Fase 1.5 — Governança Git

Status: em execução.

- Definir `master` como única branch permanente.
- Padronizar nomes de branches e Conventional Commits.
- Criar fluxo obrigatório de Pull Request.
- Adicionar templates de PR e issues.
- Adicionar `CODEOWNERS`.
- Criar CI mínimo com instalação congelada, whitespace e typecheck.
- Documentar proteção da `master`, merge, exclusão segura e recuperação.
- Analisar a branch remota legada `origin/develop` antes de qualquer exclusão.

## Fase 2 — Estabilização da toolchain

Status: em execução.

- Executar somente com Node `24.18.0`.
- Fixar primeiro todas as dependências diretas nas versões já resolvidas e
  validadas, sem atualização automática.
- Substituir dependências `latest` por versões explícitas validadas.
- TypeScript alinhado em `5.9.3` em todos os workspaces.
- Alinhar TypeScript entre todos os workspaces.
- Alinhar Next.js, React, Playwright, BullMQ e ferramentas compartilhadas.
- Revisar `pnpm.onlyBuiltDependencies` e `allowBuilds`.
- Reinstalar de forma limpa e revisar o lockfile.
- Validar builds individuais, monorepo e instalador Windows.
- `tsx` alinhado em `4.23.1` em todos os workspaces que o utilizam.

## Fase 3 — Qualidade automatizada

- Adicionar ESLint real em vez de scripts placeholder.
- Padronizar Prettier e verificação sem escrita.
- Criar testes unitários para cálculos, datas, autorização e contratos.
- Criar testes de integração para API e banco descartável.
- Criar testes de caracterização dos workers sem acessar fontes reais.
- Criar pipeline CI com install congelado, typecheck, lint, testes e build.

## Fase 4 — Refatoração da API

- Dividir services grandes por domínio.
- Padronizar erros de domínio e mapeamento HTTP.
- Remover duplicação de cálculo de consumo e período.
- Tipar serializadores e eliminar `any` gradual.
- Revisar transações, isolamento por cliente e consultas N+1.
- Consolidar contratos usados por web e agents.

## Fase 5 — Confiabilidade dos workers

- Formalizar máquina de estados de jobs e leases.
- Reforçar idempotência, retry e cancelamento.
- Centralizar redaction de PII e logs estruturados.
- Criar adaptadores testáveis para fontes externas.
- Padronizar execução Queue e Agent.
- Revisar métricas, heartbeat, offline e instabilidade.

## Fase 6 — Design system e frontends

- Auditar componentes duplicados de web-client e web-admin.
- Consolidar tokens de design antes de compartilhar componentes.
- Criar package de UI apenas para componentes realmente comuns.
- Padronizar estados de tela, formulários, feedback e acessibilidade.
- Refatorar telas por fluxo, preservando hooks, guards e APIs.
- Usar revelação progressiva para detalhes extensos.

## Fase 7 — Novas funcionalidades

Cada funcionalidade nova deve conter:

- problema e usuário;
- regra de negócio;
- fluxo de interface;
- contrato de API;
- persistência;
- processamento assíncrono, quando aplicável;
- segurança e privacidade;
- critérios de aceite;
- telemetria;
- plano de rollout e rollback.

A implementação começa somente depois de identificar as dependências da fase
correspondente. Não é necessário terminar toda a refatoração para entregar valor,
mas cada fatia deve entrar sobre uma base estável.
