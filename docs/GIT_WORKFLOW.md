# Workflow Git do Imóvel Prático

## Objetivo

Manter histórico rastreável, branches pequenas e uma `master` estável para
trabalho humano e desenvolvimento assistido por agentes.

## Branch principal

A `master` é a única branch permanente.

Ela deve:

- receber alterações somente por Pull Request;
- permanecer compilável e implantável;
- passar pelos checks obrigatórios;
- bloquear force push e exclusão;
- exigir resolução das conversas do PR.

Não é necessário manter uma branch permanente `develop`.

## Ciclo de uma tarefa

### 1. Atualizar a base

```bash
git switch master
git pull --ff-only origin master
```

### 2. Criar a branch

```bash
git switch -c <tipo>/<descricao-curta>
```

### 3. Trabalhar em escopo pequeno

- ler `AGENTS.md` e skills relevantes;
- diagnosticar antes de editar;
- não misturar funcionalidade, infraestrutura e refatoração;
- criar checkpoints coerentes;
- não commitar artefatos temporários.

### 4. Validar

```bash
pnpm typecheck
git diff --check
```

Executar `pnpm build` quando houver impacto em build, runtime ou empacotamento.

### 5. Publicar e abrir PR

```bash
git push -u origin <branch>
```

Base do PR:

```text
master
```

### 6. Integrar

Use `Squash and merge` por padrão. Use `Rebase and merge` quando houver valor
real em preservar commits independentes e já organizados.

### 7. Confirmar antes de apagar

```bash
git switch master
git pull --ff-only origin master
git branch --contains <hash-da-branch>
```

Só exclua quando `master` aparecer:

```bash
git branch -d <branch>
git push origin --delete <branch>
git fetch --prune
```

## Tipos de branch

| Prefixo | Uso |
| --- | --- |
| `feat/` | funcionalidade |
| `fix/` | correção |
| `refactor/` | refatoração sem alterar comportamento |
| `chore/` | manutenção, infraestrutura e dependências |
| `docs/` | documentação |
| `test/` | testes |
| `hotfix/` | correção urgente de produção |

## Commits

Formato:

```text
tipo(escopo): descrição
```

Tipos aceitos:

```text
feat fix refactor chore docs test perf build ci revert
```

Exemplos:

```text
feat(client): adiciona filtro por período
fix(agent): preserva lease durante consulta
refactor(api): separa cálculo de consumo
chore(toolchain): fixa versões compartilhadas
docs(arquitetura): registra fluxo de processamento
```

## Pull Requests

Um PR deve ter:

- escopo único;
- título Conventional Commit;
- descrição preenchida;
- checks verdes;
- diff revisado;
- nenhuma credencial ou PII exposta;
- evidência de teste;
- rollback descrito quando o risco justificar.

## Proteção recomendada da master no GitHub

Configurar Ruleset ou Branch protection para `master`:

- exigir Pull Request;
- exigir os checks `Título do PR` e `Repositório`;
- exigir branch atualizada antes do merge;
- exigir resolução de conversas;
- bloquear force push;
- bloquear exclusão;
- permitir apenas squash e rebase;
- excluir branch automaticamente após o merge.

Como o projeto possui atualmente um mantenedor principal, não exigir aprovação de
terceiros até existir outro revisor ativo. O PR continua obrigatório para
rastreabilidade e execução do CI.

## Branch develop existente

A branch remota `origin/develop` é considerada legada até análise.

Antes de qualquer exclusão:

```bash
git fetch origin
git log --oneline master..origin/develop
git log --oneline origin/develop..master
```

Se houver commits exclusivos, revisar e integrar conscientemente. Nenhum script
de governança deve apagá-la automaticamente.

## Tags e releases

Enquanto o produto estiver em evolução inicial:

- usar SemVer;
- criar tag somente para versões implantadas ou marcos operacionais;
- não criar tag para cada commit;
- registrar release notes a partir dos PRs integrados.

Exemplo:

```text
v0.2.0
```

## Recuperação

Ao suspeitar de perda:

```bash
git status --short --branch
git branch -a
git reflog --all --date=local --oneline -50
```

Não executar `git gc`, `git prune`, `git reset --hard` ou `git clean -fd` antes
de localizar os commits.
