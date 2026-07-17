param(
  [string]$AppSource = "",
  [string]$InstallDir = "C:\ProgramData\ImovelPratico\worker-cnd",
  [string]$WinSwExe = ""
)

$ErrorActionPreference = "Stop"

function Assert-Admin {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($identity)

  if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Execute este script como Administrador."
  }
}

Assert-Admin

if ([string]::IsNullOrWhiteSpace($AppSource)) {
  $AppSource = (Resolve-Path ".").Path
}

if ([string]::IsNullOrWhiteSpace($WinSwExe)) {
  throw "Informe o caminho do WinSW x64 em -WinSwExe. Exemplo: -WinSwExe C:\Temp\WinSW-x64.exe"
}

if (!(Test-Path $WinSwExe)) {
  throw "WinSW não encontrado em: $WinSwExe"
}

$AppDir = Join-Path $InstallDir "app"
$ServiceDir = Join-Path $InstallDir "service"
$LogDir = Join-Path $ServiceDir "logs"

New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
New-Item -ItemType Directory -Force -Path $AppDir | Out-Null
New-Item -ItemType Directory -Force -Path $ServiceDir | Out-Null
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

Write-Output "Copiando aplicação para $AppDir"

robocopy $AppSource $AppDir /MIR /XD node_modules .git .next dist .turbo /XF .env .env.local .env.staging .env.production | Out-Null

$ServiceExe = Join-Path $ServiceDir "ImovelPraticoWorkerCnd.exe"
$ServiceXml = Join-Path $ServiceDir "ImovelPraticoWorkerCnd.xml"

Copy-Item $WinSwExe $ServiceExe -Force
Copy-Item (Join-Path $AppDir "scripts\windows\templates\ImovelPraticoWorkerCnd.xml") $ServiceXml -Force
Copy-Item (Join-Path $AppDir "scripts\windows\run-worker-cnd.ps1") (Join-Path $ServiceDir "run-worker-cnd.ps1") -Force

$EnvFile = Join-Path $InstallDir ".env"

if (!(Test-Path $EnvFile)) {
  Copy-Item (Join-Path $AppDir "scripts\windows\env\worker-cnd.env.example") $EnvFile
  Write-Warning "Arquivo .env criado em $EnvFile. Edite esse arquivo antes de iniciar o serviço."
}

Set-Location $AppDir

Write-Output "Instalando dependências..."
pnpm install

Write-Output "Gerando Prisma Client..."
pnpm --dir packages/database exec prisma generate

Write-Output "Buildando dependências e worker..."
pnpm --filter "@imovel-pratico/worker-cnd..." build

Write-Output "Instalando Chromium do Playwright..."
pnpm --filter "@imovel-pratico/worker-cnd" exec playwright install chromium

Set-Location $ServiceDir

Write-Output "Instalando serviço Windows..."
& $ServiceExe install

Write-Output ""
Write-Output "Instalação concluída."
Write-Output "Edite o arquivo:"
Write-Output $EnvFile
Write-Output ""
Write-Output "Depois inicie com:"
Write-Output "Start-Service ImovelPraticoWorkerCnd"
