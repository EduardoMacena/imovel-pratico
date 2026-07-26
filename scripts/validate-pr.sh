#!/usr/bin/env bash

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
ORIGINAL_ROOT="$ROOT"
TEMP_ROOT=""
WORKTREE=""

fail() {
  printf 'ERRO: %s\n' "$1" >&2
  exit 1
}

cleanup() {
  local status=$?

  cd "$ORIGINAL_ROOT" 2>/dev/null || true

  if [[ -n "$WORKTREE" ]] && git worktree list --porcelain |
      grep -Fqx "worktree $WORKTREE"; then
    git worktree remove --force "$WORKTREE" >/dev/null 2>&1 || true
  fi

  if [[ -n "$TEMP_ROOT" && -d "$TEMP_ROOT" ]]; then
    rm -rf "$TEMP_ROOT"
  fi

  git worktree prune >/dev/null 2>&1 || true

  exit "$status"
}

trap cleanup EXIT INT TERM

cd "$ROOT"

if ! git diff --quiet || ! git diff --cached --quiet; then
  fail "Há alterações versionadas sem commit. A validação pré-push verifica somente o HEAD."
fi

EXPECTED_NODE="$(
  node -e 'const p=require("./package.json"); process.stdout.write(p.engines.node)'
)"
EXPECTED_PNPM="$(
  node -e 'const p=require("./package.json"); process.stdout.write(p.engines.pnpm)'
)"
CURRENT_NODE="$(node --version | sed 's/^v//')"
CURRENT_PNPM="$(pnpm --version)"
HEAD_SHA="$(git rev-parse HEAD)"
HEAD_SHORT="$(git rev-parse --short HEAD)"

[[ "$CURRENT_NODE" == "$EXPECTED_NODE" ]] ||
  fail "Node atual $CURRENT_NODE; esperado $EXPECTED_NODE."

[[ "$CURRENT_PNPM" == "$EXPECTED_PNPM" ]] ||
  fail "pnpm atual $CURRENT_PNPM; esperado $EXPECTED_PNPM."

TEMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/imovel-pratico-validacao-pr.XXXXXX")"
WORKTREE="$TEMP_ROOT/repository"

printf '\nValidando o commit %s em worktree temporário...\n\n' "$HEAD_SHORT"

git worktree add --detach "$WORKTREE" "$HEAD_SHA" >/dev/null

cd "$WORKTREE"

export CI=true
export TURBO_TELEMETRY_DISABLED=1

pnpm install --frozen-lockfile

BASE_REF="${BASE_REF:-origin/master}"

if git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  BASE_SHA="$(git merge-base HEAD "$BASE_REF")"
  git diff --check "$BASE_SHA...HEAD"
else
  echo "Aviso: $BASE_REF não encontrado; executando git diff-tree no HEAD."
  git diff-tree --check -r HEAD
fi

rm -rf \
  .turbo \
  apps/*/.turbo \
  packages/*/.turbo \
  packages/agent-client/dist \
  packages/database/dist \
  packages/queue/dist

pnpm typecheck:ci

for file in \
  packages/agent-client/dist/index.d.ts \
  packages/database/dist/index.d.ts \
  packages/queue/dist/index.d.ts
do
  [[ -f "$file" ]] ||
    fail "O typecheck não gerou a dependência interna esperada: $file"
done

printf '\nValidação pré-push aprovada para %s.\n' "$HEAD_SHORT"
