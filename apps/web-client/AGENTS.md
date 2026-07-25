# AGENTS.md — Web Client

## Responsabilidade

Aplicação usada pelas imobiliárias para assinatura, novas buscas, acompanhamento
em tempo real, histórico e visualização/exportação de resultados.

## Regras

- Preservar `useRequireAuth`, `auth-storage`, API e redirecionamentos de senha.
- Não duplicar regra financeira ou de autorização já definida pela API.
- Toda tela remota deve tratar loading, vazio, erro e sucesso.
- Eventos realtime devem reconciliar estado sem duplicar resultados.
- Dados detalhados de proprietário devem usar agrupamento progressivo e áreas
  expansíveis quando forem longos.
- Ações destrutivas ou cobradas exigem confirmação clara.
- Não expor tokens em logs, URL ou mensagens de erro.
- Componentes de apresentação não devem fazer chamadas HTTP diretamente.
- Manter foco visível, labels, navegação por teclado e contraste.
- Preservar a linguagem visual premium, sem sacrificar legibilidade.

## Validação

```bash
pnpm --filter @imovel-pratico/web-client typecheck
pnpm --filter @imovel-pratico/web-client build
```
