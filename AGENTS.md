# AGENTS.md — Imóvel Prático

## Objetivo do produto

O Imóvel Prático é uma plataforma SaaS de inteligência para captação imobiliária.
Ela coordena aplicações web, API, banco de dados, filas, workers Playwright e um
Agent Windows instalado na infraestrutura do cliente.

A prioridade é entregar automação confiável, experiência premium e operação
segura sem enfraquecer isolamento por cliente, rastreabilidade ou regras de
cobrança.

## Estrutura principal

- `apps/web-home`: site institucional e distribuição do Agent Windows.
- `apps/web-client`: aplicação das imobiliárias.
- `apps/web-admin`: administração interna da plataforma.
- `apps/api-gateway`: API central, autenticação, domínio e realtime.
- `apps/worker-registro`: descoberta de índices cadastrais.
- `apps/worker-cnd`: consulta de proprietário, cache e contatos.
- `apps/agent-windows`: instalador e supervisor local dos workers.
- `packages/database`: Prisma, modelos, migrations e seeds.
- `packages/queue`: filas BullMQ, contratos de jobs e Redis.
- `packages/agent-client`: cliente HTTPS usado pelos agents.

## Ambiente obrigatório

- Node.js: `24.18.0`.
- pnpm: `10.0.0`.
- Respeitar `.nvmrc`, `.node-version`, `packageManager` e `engines`.
- Não atualizar versões por conveniência durante tarefas de funcionalidade.
- Alterações de dependências devem ocorrer em tarefa isolada, com justificativa,
  lockfile revisado e validação completa.

## Regras de trabalho

1. Ler este arquivo e o `AGENTS.md` mais próximo da área alterada.
2. Diagnosticar o estado real antes de editar.
3. Fazer tarefas pequenas, com escopo e critérios de aceite explícitos.
4. Preservar autenticação, autorização, isolamento por cliente, billing,
   contratos de API, filas, cache, leases e monitoramento.
5. Não misturar refatoração estrutural com nova funcionalidade sem necessidade.
6. Não alterar múltiplas camadas por suposição. Seguir o fluxo real do dado.
7. Não criar abstrações compartilhadas antes de confirmar uso real em pelo
   menos duas áreas.
8. Evitar `any`; quando legado impedir, isolar e documentar.
9. Não registrar senhas, tokens, CPF completo, chaves ou conteúdo sensível.
10. Não commitar artefatos de build, diagnósticos locais ou arquivos `.env`.

## Qualidade mínima

Antes de concluir uma tarefa:

```bash
pnpm typecheck
git diff --check
```

Antes de publicar uma branch:

```bash
pnpm validate:pr
```

Quando a tarefa alterar execução ou empacotamento:

```bash
pnpm build
```

Além disso, executar a validação específica do workspace alterado.

## Banco de dados

- Toda mudança de schema deve ter migration.
- Nunca editar migration já aplicada.
- Toda relação por cliente deve preservar isolamento multi-tenant.
- Revisar índices, unicidade, `onDelete` e impacto em dados existentes.
- Não executar migrations de produção automaticamente em scripts locais.

## Workers e automação externa

- Respeitar limites, intervalos, leases, cancelamento e idempotência.
- Consultar cache antes de fontes externas quando a regra permitir.
- Uma falha externa deve produzir erro observável e recuperável.
- Não aumentar concorrência ou reduzir throttling sem análise específica.
- Queue e Agent são modos de processamento válidos; mudanças devem considerar
  ambos quando o fluxo for compartilhado.

## UI/UX

- A interface deve ser moderna, sofisticada, clara e produtiva.
- Preservar regras de negócio, hooks, guards, API e armazenamento de autenticação.
- Dados longos de proprietário, telefones, e-mails, endereços e informações
  extras devem usar grupos expansíveis quando isso reduzir ruído.
- Estados de carregamento, vazio, erro, sucesso e indisponibilidade são
  obrigatórios.
- Manter responsividade, navegação por teclado, foco visível e semântica.

## Git

- A branch principal é `master`.
- Toda alteração entra por Pull Request.
- Branches devem ser curtas, específicas e seguir `tipo/descricao`.
- Usar Conventional Commits em português:
  - `feat(escopo): ...`
  - `fix(escopo): ...`
  - `refactor(escopo): ...`
  - `chore(escopo): ...`
  - `docs(escopo): ...`
  - `test(escopo): ...`
  - `ci(escopo): ...`
- Seguir `CONTRIBUTING.md` e `docs/GIT_WORKFLOW.md`.
- Nunca excluir uma branch antes de confirmar que `master` contém seu commit.
- Não criar commit, push, merge ou exclusão automaticamente sem solicitação
  explícita.
- Depois da validação e do commit, remover scripts, relatórios e backups
  temporários que não serão mais usados.
