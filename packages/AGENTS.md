# AGENTS.md — Packages compartilhados

Estas regras complementam o `AGENTS.md` da raiz.

- Packages não devem depender de aplicações em `apps/`.
- Manter API pública pequena e explícita.
- Evitar efeitos colaterais na importação.
- Mudanças incompatíveis exigem atualização coordenada dos consumidores.
- Validar build e typecheck do package e dos workspaces consumidores.
