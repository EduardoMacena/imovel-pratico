# Imóvel Prático

Plataforma SaaS de inteligência para captação imobiliária, com aplicações web,
API, filas, workers Playwright e Agent Windows para processamento local seguro.

## Requisitos

- Node.js `24.18.0`
- pnpm `10.0.0`
- PostgreSQL
- Redis
- Google Chrome para os fluxos Playwright que usam o canal `chrome`

As versões de Node estão declaradas em `.nvmrc`, `.node-version` e
`package.json`.

## Estrutura atual

### Aplicações

- `apps/web-home`: site institucional e download do Agent.
- `apps/web-client`: sistema das imobiliárias.
- `apps/web-admin`: administração interna.
- `apps/api-gateway`: API central.
- `apps/worker-registro`: busca de índices cadastrais.
- `apps/worker-cnd`: proprietário, cache e contatos.
- `apps/agent-windows`: instalador e supervisor local.

### Packages

- `packages/database`: Prisma, PostgreSQL, migrations e seeds.
- `packages/queue`: Redis, BullMQ, contratos de jobs e realtime.
- `packages/agent-client`: comunicação HTTPS dos agents com a API.

## Instalação

```bash
pnpm install
```

Configure os `.env` de desenvolvimento a partir dos respectivos
`.env.example`. Nunca versione arquivos `.env` reais.

## Desenvolvimento

Todos os workspaces:

```bash
pnpm dev
```

Um workspace específico:

```bash
pnpm --filter @imovel-pratico/api-gateway dev
pnpm --filter @imovel-pratico/web-client dev
pnpm --filter @imovel-pratico/web-admin dev
pnpm --filter @imovel-pratico/web-home dev
```

## Qualidade

```bash
pnpm typecheck
pnpm build
git diff --check
```

Os scripts de lint ainda serão substituídos por validação real na fase de
qualidade automatizada.

## Banco de dados

```bash
pnpm --filter @imovel-pratico/database db:generate
pnpm --filter @imovel-pratico/database db:migrate
pnpm --filter @imovel-pratico/database db:seed
```

Teste migrations em staging antes da produção.

## Documentação

- `AGENTS.md`: regras gerais para agentes de desenvolvimento.
- `docs/ARQUITETURA.md`: visão consolidada da arquitetura.
- `docs/PLANO_REFATORACAO.md`: fases da refatoração.
- `docs/HANDOFF.md`: continuidade entre sessões.
- `docs/AMBIENTES.md`: staging e produção.
- `docs/DOCKER.md`: imagens e builds.
- `docs/COMPOSE.md`: execução por Docker Compose.
- `docs/WINDOWS_WORKERS.md`: modo legado/controlado de serviços Windows.

## Commits

Usar Conventional Commits em português:

```text
feat(escopo): adiciona ...
fix(escopo): corrige ...
refactor(escopo): reorganiza ...
chore(escopo): configura ...
docs(escopo): documenta ...
```
