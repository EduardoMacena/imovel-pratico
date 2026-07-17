param(
  [string]$InstallDir = "C:\ProgramData\ImovelPratico\worker-cnd"
)

$ErrorActionPreference = "Stop"

$ServiceDir = Join-Path $InstallDir "service"
$ServiceExe = Join-Path $ServiceDir "ImovelPraticoWorkerCnd.exe"

if (Get-Service -Name "ImovelPraticoWorkerCnd" -ErrorAction SilentlyContinue) {
  Stop-Service ImovelPraticoWorkerCnd -ErrorAction SilentlyContinue
}

if (Test-Path $ServiceExe) {
  Set-Location $ServiceDir
  & $ServiceExe uninstall
}

Write-Output "Serviço ImovelPraticoWorkerCnd removido."
Write-Output "Os arquivos permanecem em: $InstallDir"
