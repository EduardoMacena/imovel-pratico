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

Status: concluída em 26/07/2026.

- `master` definida como única branch permanente.
- Nomes de branches e Conventional Commits padronizados.
- Fluxo obrigatório de Pull Request documentado.
- Templates de PR e issues adicionados.
- `CODEOWNERS` adicionado.
- CI mínimo criado com instalação congelada, whitespace e typecheck.
- Proteção da `master`, merge, exclusão segura e recuperação documentados.
- Branch remota legada analisada antes de qualquer exclusão.
- Pull Requests pequenos e independentes adotados como fluxo padrão.

## Fase 2 — Estabilização da toolchain

Status: concluída em 27/07/2026.

- Node `24.18.0` e pnpm `10.0.0` definidos como toolchain obrigatória.
- Dependências diretas fixadas nas versões já resolvidas e validadas.
- Declarações `latest` substituídas por versões explícitas.
- TypeScript alinhado em `5.9.3` em todos os workspaces.
- `tsx` alinhado em `4.23.1` nos workspaces que o utilizam.
- BullMQ alinhado em `5.80.10` nos workers e no pacote de fila.
- Aplicações web alinhadas em Next.js `16.2.11`, React `19.2.8` e
  React DOM `19.2.8`.
- Dependências transitivas seguras corrigidas:
  `fast-uri`, `find-my-way`, `postcss`, `sharp` e `valibot`.
- Árvore do ExcelJS mitigada com `uuid 11.1.1`,
  `brace-expansion 1.1.16` e `brace-expansion 2.1.2`.
- Instalação limpa e lockfile congelado validados.
- Exportação XLSX real validada com dados, cabeçalho em negrito,
  painel congelado e autofiltro.
- Prisma, Sharp, Fastify e BullMQ passaram em testes funcionais.
- Typecheck aprovado em 13 tarefas e build aprovado em 10 tarefas.

Risco aceito da fase:

- Permanecem dois alertas altos do `GHSA-mh99-v99m-4gvg` na árvore do
  ExcelJS.
- A correção integral exigiria `brace-expansion 5.0.8`, salto incompatível
  rejeitado após simulação.
- O risco deve ser reavaliado quando o ExcelJS ou suas dependências
  transitivas publicarem uma atualização compatível.

## Início do desenvolvimento funcional

A base estável permite iniciar novas funcionalidades.

Cada entrega deve ser uma fatia vertical pequena, contendo:

- problema e usuário afetado;
- regra de negócio;
- fluxo de interface;
- contrato de API;
- persistência e processamento assíncrono, quando aplicáveis;
- segurança, privacidade e isolamento por cliente;
- critérios de aceite;
- testes mínimos do comportamento alterado;
- typecheck, build e plano de rollback.

A qualidade automatizada deve avançar junto às funcionalidades. Não é
necessário concluir todas as fases de refatoração antes de entregar valor.

## Fase 3 — Qualidade automatizada

Status: próxima fase incremental.

- Adicionar ESLint real em vez de scripts placeholder.
- Padronizar Prettier e verificação sem escrita.
- Criar testes unitários para cálculos, datas, autorização e contratos.
- Criar testes de integração para API e banco descartável.
- Criar testes de caracterização dos workers sem acessar fontes reais.
- Evoluir o pipeline CI com lint, testes e build.

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
