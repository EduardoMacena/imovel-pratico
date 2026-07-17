param(
  [string]$InstallDir = "C:\ProgramData\ImovelPratico\worker-registro"
)

$ErrorActionPreference = "Stop"

$ServiceDir = Join-Path $InstallDir "service"
$ServiceExe = Join-Path $ServiceDir "ImovelPraticoWorkerRegistro.exe"

if (Get-Service -Name "ImovelPraticoWorkerRegistro" -ErrorAction SilentlyContinue) {
  Stop-Service ImovelPraticoWorkerRegistro -ErrorAction SilentlyContinue
}

if (Test-Path $ServiceExe) {
  Set-Location $ServiceDir
  & $ServiceExe uninstall
}

Write-Output "Serviço ImovelPraticoWorkerRegistro removido."
Write-Output "Os arquivos permanecem em: $InstallDir"
