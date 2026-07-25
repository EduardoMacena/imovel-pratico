# Arquitetura do Imóvel Prático

## Visão geral

O Imóvel Prático é um SaaS multiaplicação para captação imobiliária. A plataforma
separa apresentação, administração, domínio, persistência, filas e automação
externa.

```text
web-home ───────────────► distribuição e aquisição
web-client ─┐
web-admin ──┼───────────► api-gateway ─► PostgreSQL
agents ─────┘                  │
                               ├────────► Redis / BullMQ
                               ├────────► realtime
                               └────────► serviços de e-mail

Redis / BullMQ ─────────► worker-registro ─► fonte de Registro
Redis / BullMQ ─────────► worker-cnd ──────► CND / cache / contatos

api-gateway ◄───────────► agent-windows + agent-client
```

## Aplicações web

### Web Home

Site público, posicionamento comercial e download do Agent Windows. Não contém
regra privada de negócio.

### Web Client

Aplicação das imobiliárias. Permite autenticação, assinatura, busca prévia,
autorização de excedente, acompanhamento em tempo real, histórico e resultados.

### Web Admin

Aplicação interna para clientes, usuários, planos, consumo, tarefas, faturas,
instalação de agents e monitoramento.

## API Gateway

A API centraliza:

- autenticação e autorização;
- regras de assinatura e cobrança;
- criação e acompanhamento de buscas;
- administração da plataforma;
- filas e contratos de processamento;
- realtime;
- ativação e operação dos agents;
- exportações e notificações.

Controllers traduzem HTTP. Schemas Zod validam entrada. Services executam regras
e persistência.

## Persistência

PostgreSQL, acessado por Prisma, armazena clientes, usuários, planos, tarefas,
resultados, cache, consumo, faturas, eventos operacionais, heartbeats, agents e
links de instalação.

O isolamento multi-tenant é baseado em `clienteId`. Cache de imóvel é global por
índice cadastral quando a regra de reutilização permitir.

## Processamento

Há dois modos por cliente:

- `QUEUE`: API publica jobs em filas BullMQ consumidas por workers conectados ao
  Redis e ao banco.
- `AGENT`: Agent local consulta jobs pela API HTTPS, processa e devolve progresso
  e resultado sem expor Postgres ou Redis ao cliente final.

Os dois modos devem preservar o mesmo resultado de domínio.

## Worker Registro

Descobre os índices cadastrais de um endereço. Deve respeitar throttling,
idempotência, cancelamento, lease e limitações da fonte.

## Worker CND

Consulta proprietário, reutiliza cache válido, enriquece contato e registra
progresso. Deve proteger CPF, tokens e dados pessoais em logs.

## Agent Windows

Aplicativo Electron instalado no Windows do cliente. Ativa agents por código de
uso único, salva tokens localmente, supervisiona REGISTRO e CND, inicia com o
Windows e permanece na bandeja.

O cliente final não precisa instalar Node.js, pnpm, Postgres ou Redis.

## Ambientes

Staging e produção usam bancos, Redis, URLs e segredos separados. Migrations e
fluxos críticos são validados primeiro em staging.

## Invariantes

- Isolamento por cliente.
- Valores monetários em centavos.
- Tokens e senhas nunca retornam após o momento previsto.
- Cache não pode ignorar `forceRefresh`.
- Cancelamento e reprocessamento precisam reconciliar banco e fila/agent.
- Monitoramento diferencia estado persistido de estado operacional.
- Alteração visual não pode mudar regra de domínio por acidente.
