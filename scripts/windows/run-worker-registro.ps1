$ErrorActionPreference = "Stop"

$BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$WorkerRoot = Split-Path -Parent $BaseDir
$AppDir = Join-Path $WorkerRoot "app"
$EnvFile = Join-Path $WorkerRoot ".env"
$LogDir = Join-Path $BaseDir "logs"

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

if (!(Test-Path $AppDir)) {
  throw "Diretório da aplicação não encontrado: $AppDir"
}

if (!(Test-Path $EnvFile)) {
  throw "Arquivo .env não encontrado: $EnvFile"
}

$env:DOTENV_CONFIG_PATH = $EnvFile
$env:NODE_ENV = "production"

Set-Location $AppDir

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Output "[$timestamp] Iniciando Imóvel Prático Worker Registro"
Write-Output "AppDir: $AppDir"
Write-Output "EnvFile: $EnvFile"

pnpm --filter "@imovel-pratico/worker-registro" start
