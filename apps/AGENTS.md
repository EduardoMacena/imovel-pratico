# AGENTS.md — Aplicações

Estas regras complementam o `AGENTS.md` da raiz.

- Cada aplicação deve continuar implantável e validável de forma independente.
- Não importar código diretamente de outra pasta em `apps/`.
- Código compartilhado deve viver em `packages/` somente quando houver contrato
  estável e reutilização comprovada.
- Variáveis públicas e privadas não podem ser misturadas.
- Toda chamada entre aplicações deve usar contrato explícito de API, fila ou
  package compartilhado.
- Alterações em fluxos críticos devem documentar origem, transformação,
  persistência e destino dos dados.
