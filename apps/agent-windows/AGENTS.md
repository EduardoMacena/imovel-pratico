# AGENTS.md — Agent Windows

## Responsabilidade

Instalar, ativar e supervisionar localmente os workers REGISTRO e CND sem exigir
Node.js ou pnpm na máquina do cliente.

## Regras

- O aplicativo deve continuar single-instance e operar pela bandeja.
- Fechar a janela não pode derrubar serviços em execução.
- Tokens são salvos apenas na configuração local protegida e nunca exibidos em
  logs.
- O processo filho deve usar o Electron como Node via `ELECTRON_RUN_AS_NODE`.
- Preservar ativação por código de uso único e comunicação HTTPS com a API.
- Não reintroduzir conexão direta do cliente final ao Postgres ou Redis.
- Atualizações devem considerar instalação, desinstalação, autostart e upgrade.
- Não alterar empacotamento, `asar`, Playwright ou Electron sem testar o
  instalador Windows.
- Mensagens de erro devem orientar o operador sem revelar segredo.

## Validação

```bash
pnpm --filter @imovel-pratico/agent-windows typecheck
pnpm --filter @imovel-pratico/agent-windows build
```
