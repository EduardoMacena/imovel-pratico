# AGENTS.md — Web Home

## Responsabilidade

Site institucional, apresentação comercial e distribuição pública do instalador
do Imóvel Prático Agent.

## Regras

- Priorizar desempenho, SEO, acessibilidade e clareza comercial.
- Não importar regra de negócio privada nem acessar banco ou Redis.
- URLs públicas devem vir de variáveis `NEXT_PUBLIC_*` documentadas.
- O download do Agent deve apontar para artefato versionado e publicado de forma
  controlada.
- Não usar animação que prejudique leitura, desempenho ou visibilidade.
- Alterações de preço ou plano devem ser sincronizadas com a fonte comercial
  oficial; não inferir valores.
- Imagens e SVGs devem ser otimizados e sem dados sensíveis.

## Validação

```bash
pnpm --filter @imovel-pratico/web-home typecheck
pnpm --filter @imovel-pratico/web-home build
```
