# Docker — Imóvel Prático

Este projeto usa Docker para publicação em staging e produção.

Importante: a máquina local de desenvolvimento não precisa rodar Docker.
No ambiente local, valide com pnpm build e pnpm typecheck.
As imagens Docker devem ser construídas no GitHub Actions ou diretamente na VPS Hostinger.


Este projeto usa três Dockerfiles base:

- docker/Dockerfile.api
- docker/Dockerfile.next
- docker/Dockerfile.worker

## API Gateway

Build local:

docker build -f docker/Dockerfile.api --build-arg "APP_NAME=@imovel-pratico/api-gateway" -t imovel-pratico/api-gateway:local .

## Web Home

docker build -f docker/Dockerfile.next --build-arg "APP_NAME=@imovel-pratico/web-home" --build-arg "APP_PORT=3000" --build-arg "NEXT_PUBLIC_API_URL=http://localhost:3333/api" -t imovel-pratico/web-home:local .

## Web Client

docker build -f docker/Dockerfile.next --build-arg "APP_NAME=@imovel-pratico/web-client" --build-arg "APP_PORT=3001" --build-arg "NEXT_PUBLIC_API_URL=http://localhost:3333/api" -t imovel-pratico/web-client:local .

## Web Admin

docker build -f docker/Dockerfile.next --build-arg "APP_NAME=@imovel-pratico/web-admin" --build-arg "APP_PORT=3002" --build-arg "NEXT_PUBLIC_API_URL=http://localhost:3333/api" -t imovel-pratico/web-admin:local .

## Worker Registro

docker build -f docker/Dockerfile.worker --build-arg "APP_NAME=@imovel-pratico/worker-registro" -t imovel-pratico/worker-registro:local .

## Worker CND

docker build -f docker/Dockerfile.worker --build-arg "APP_NAME=@imovel-pratico/worker-cnd" -t imovel-pratico/worker-cnd:local .

## Observações

- Os segredos reais devem ficar em .env.staging ou .env.production no servidor.
- Não versionar arquivos .env reais.
- Workers usam Playwright e instalam Chromium durante o build da imagem.
- Os apps Next recebem NEXT_PUBLIC_API_URL em tempo de build.
