# Workers Windows — Imóvel Prático

Este documento explica como instalar os workers worker-cnd e worker-registro como serviços Windows usando WinSW.

## Visão geral

O modelo atual dos workers conecta diretamente em Redis e Postgres.

Esse modo é indicado para:
- ambiente interno;
- máquina controlada pela empresa;
- testes de CND em Windows;
- laboratório de validação.

Para instalação em cliente final, a arquitetura recomendada é evoluir para Agent via API HTTPS, sem expor DATABASE_URL e REDIS_URL.

## Diretórios padrão

Worker CND:

C:\ProgramData\ImovelPratico\worker-cnd\
  app\
  service\
  logs\
  .env

Worker Registro:

C:\ProgramData\ImovelPratico\worker-registro\
  app\
  service\
  logs\
  .env

## Requisitos

- Windows 10/11 ou Windows Server
- Node.js 24.18.0
- pnpm 10.0.0
- Google Chrome instalado, recomendado para worker-cnd
- WinSW x64
- PowerShell executado como Administrador

## Instalar worker-cnd

No PowerShell como Administrador:

cd C:\caminho\imovel-pratico

.\scripts\windows\install-worker-cnd.ps1 `
  -AppSource "C:\caminho\imovel-pratico" `
  -WinSwExe "C:\Temp\WinSW-x64.exe"

Editar:

C:\ProgramData\ImovelPratico\worker-cnd\.env

Depois iniciar:

Start-Service ImovelPraticoWorkerCnd

Ver status:

Get-Service ImovelPraticoWorkerCnd

Ver logs:

C:\ProgramData\ImovelPratico\worker-cnd\service\logs

## Instalar worker-registro

cd C:\caminho\imovel-pratico

.\scripts\windows\install-worker-registro.ps1 `
  -AppSource "C:\caminho\imovel-pratico" `
  -WinSwExe "C:\Temp\WinSW-x64.exe"

Editar:

C:\ProgramData\ImovelPratico\worker-registro\.env

Iniciar:

Start-Service ImovelPraticoWorkerRegistro

## Usar Chrome real no worker-cnd

No .env do worker-cnd:

PLAYWRIGHT_CHANNEL=chrome
PLAYWRIGHT_HEADLESS=false
PLAYWRIGHT_SLOW_MO=800

Se quiser apontar direto para o executável:

PLAYWRIGHT_EXECUTABLE_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe

## Modo sem janela

PLAYWRIGHT_HEADLESS=true

A CND precisa ser validada nesse modo. Se falhar, usar Chrome real com PLAYWRIGHT_HEADLESS=false.

## Desinstalar

Worker CND:

.\scripts\windows\uninstall-worker-cnd.ps1

Worker Registro:

.\scripts\windows\uninstall-worker-registro.ps1

## Observações de segurança

No modelo atual, o worker precisa de DATABASE_URL e REDIS_URL.

Para cliente final, a recomendação é substituir por:

API_URL
WORKER_TOKEN
WORKER_ID
CLIENTE_ID

E fazer o worker buscar jobs via HTTPS.
