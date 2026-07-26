# Contribuindo com o Imóvel Prático

Este documento define o fluxo mínimo para alterações no repositório.

## Antes de alterar

1. Atualize a `master`.
2. Crie uma branch curta e específica.
3. Leia o `AGENTS.md` raiz e o mais próximo da área alterada.
4. Leia a skill relevante em `.agents/skills`, quando estiver disponível.
5. Confirme o estado real dos arquivos antes de editar.

## Branches

A `master` é a única branch permanente e deve permanecer implantável.

Use:

- `feat/<descricao>` para funcionalidade;
- `fix/<descricao>` para correção;
- `refactor/<descricao>` para refatoração sem mudança funcional;
- `chore/<descricao>` para manutenção, infraestrutura e dependências;
- `docs/<descricao>` para documentação;
- `test/<descricao>` para testes;
- `hotfix/<descricao>` para correção urgente de produção.

Exemplos:

```text
feat/busca-por-mapa
fix/cache-force-refresh
refactor/billing-periodo
chore/padroniza-dependencias
docs/fluxo-agent
```

Não use a branch para mais de um objetivo independente.

## Commits

Use Conventional Commits em português:

```text
feat(escopo): adiciona ...
fix(escopo): corrige ...
refactor(escopo): reorganiza ...
chore(escopo): configura ...
docs(escopo): documenta ...
test(escopo): cobre ...
ci(escopo): valida ...
```

O título deve ser objetivo, no presente, sem ponto final.

## Validação local

Obrigatório antes do Pull Request:

```bash
pnpm typecheck
git diff --check
```

Quando a alteração afetar execução ou empacotamento:

```bash
pnpm build
```

Também execute a validação específica do workspace alterado.

## Pull Request

Todo trabalho entra na `master` por Pull Request.

O PR deve conter:

- problema e objetivo;
- escopo;
- arquivos ou áreas alteradas;
- decisões e riscos;
- evidências de validação;
- plano de teste manual;
- impactos em segurança, privacidade, billing, filas e multi-tenant;
- screenshots quando houver mudança visual.

O título do PR segue Conventional Commits.

## Estratégia de merge

Preferência:

1. `Squash and merge` para branches com commits intermediários;
2. `Rebase and merge` quando os commits forem deliberadamente independentes;
3. não usar `Create a merge commit` como padrão.

A branch só pode ser excluída depois de:

```bash
git switch master
git pull --ff-only origin master
git branch --contains <hash-final-da-branch>
```

A saída deve incluir `master`.

## Encerramento

Depois do merge:

1. atualizar a `master`;
2. confirmar os commits;
3. excluir a branch local e remota;
4. executar `git fetch --prune`;
5. remover scripts, relatórios e backups temporários;
6. confirmar `git status` limpo;
7. criar a próxima branch a partir da `master` atualizada.

Nunca apagar branches, usar `reset --hard`, `clean -fd`, `gc` ou `prune` sem
confirmar o estado do histórico.
