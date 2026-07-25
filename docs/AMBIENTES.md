# Ambientes — Imóvel Prático

O projeto possui dois ambientes principais:

## Staging

Ambiente de teste e homologação.

URLs:

- Home: https://staging.imovelpratico.com
- Cliente: https://app-staging.imovelpratico.com
- Admin: https://admin-staging.imovelpratico.com
- API: https://api-staging.imovelpratico.com

Banco:

- Database: `imovel_pratico_staging`

Redis:

- Instância separada para staging.

Uso:

- Validar deploy
- Testar migrations
- Testar workers
- Testar fluxo de busca prévia e CND
- Testar faturas e monitoramento antes da produção

## Produção

Ambiente real dos clientes.

URLs:

- Home: https://imovelpratico.com
- Cliente: https://app.imovelpratico.com
- Admin: https://admin.imovelpratico.com
- API: https://api.imovelpratico.com

Banco:

- Database: `imovel_pratico_prod`

Redis:

- Instância separada para produção.

## Regras importantes

- Nunca usar banco de produção para testes.
- Nunca compartilhar Redis entre staging e produção.
- Nunca commitar `.env.staging` ou `.env.production`.
- Os arquivos versionados devem ser apenas `.env.staging.example` e `.env.production.example`.
- Toda migration deve ser testada em staging antes de produção.
- Workers de staging não podem consumir filas de produção.
- Workers de produção não podem consumir filas de staging.
