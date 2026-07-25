# Docker Compose — Imóvel Prático

O projeto possui dois arquivos principais:

- docker-compose.staging.yml
- docker-compose.production.yml

## Staging

Usa:

- .env.staging
- banco imovel_pratico_staging
- redis-staging
- portas locais 13000, 13001, 13002 e 13333

Comando na VPS:

docker compose --env-file .env.staging -f docker-compose.staging.yml up -d --build

URLs internas temporárias na VPS:

- Home staging: http://127.0.0.1:13000
- App staging: http://127.0.0.1:13001
- Admin staging: http://127.0.0.1:13002
- API staging: http://127.0.0.1:13333

## Produção

Usa:

- .env.production
- banco imovel_pratico_prod
- redis-prod
- portas locais 3000, 3001, 3002 e 3333

Comando na VPS:

docker compose --env-file .env.production -f docker-compose.production.yml up -d --build

URLs internas temporárias na VPS:

- Home produção: http://127.0.0.1:3000
- App produção: http://127.0.0.1:3001
- Admin produção: http://127.0.0.1:3002
- API produção: http://127.0.0.1:3333

## Regras

- Não usar .env real no Git.
- Não compartilhar Redis entre staging e produção.
- Não compartilhar banco entre staging e produção.
- Testar migrations primeiro em staging.
- Produção deve ser atualizada somente depois de staging validado.
