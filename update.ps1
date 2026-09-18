# =========================================================================
# Atualizador PowerShell 1-Clique para Windows 11 com Winget
# =========================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Iniciando atualizacao 100% silenciosa do Windows 11..." -ForegroundColor Cyan

$wingetPath = "C:\Users\alexs\AppData\Local\Microsoft\WindowsApps\winget.exe"
# Verificar e instalar Winget automaticamente se nao estiver instalado
if (-not (Get-Command winget -ErrorAction SilentlyContinue) -and -not (Test-Path $wingetPath)) {
    Write-Host "[AVISO] Winget nao detectado. Instalando automaticamente o Windows Package Manager..." -ForegroundColor Yellow
    $ProgressPreference = "SilentlyContinue"
    try { Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe -ErrorAction SilentlyContinue } catch {}
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        $tmp = [System.IO.Path]::GetTempPath()
        Write-Host "Baixando dependencias e pacote oficial Microsoft..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri "https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx" -OutFile "$tmp\vclibs.appx" -UseBasicParsing
        Add-AppxPackage -Path "$tmp\vclibs.appx" -ErrorAction SilentlyContinue
        Invoke-WebRequest -Uri "https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx" -OutFile "$tmp\xaml.appx" -UseBasicParsing
        Add-AppxPackage -Path "$tmp\xaml.appx" -ErrorAction SilentlyContinue
        Invoke-WebRequest -Uri "https://aka.ms/getwinget" -OutFile "$tmp\winget.msixbundle" -UseBasicParsing
        Add-AppxPackage -Path "$tmp\winget.msixbundle"
        Write-Host "Winget instalado com sucesso!" -ForegroundColor Green
    }
    $wingetPath = "$env:LOCALAPPDATA\Microsoft\WindowsApps\winget.exe"
    if (-not (Test-Path $wingetPath)) { $wingetPath = "winget.exe" }
}

$logPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop", "winget-update-log.txt")
$arguments = @('upgrade', '--all', '--silent', '--ignore-security-hash', '--accept-package-agreements', '--accept-source-agreements', '--disable-interactivity')

Write-Host "Executando: $wingetPath $($arguments -join ' ')" -ForegroundColor DarkGray

try {
    Start-Process -FilePath $wingetPath -ArgumentList $arguments -Wait -WindowStyle Hidden
    Write-Host "`n[SUCESSO] Atualizacao concluida sem intervencao do usuario!" -ForegroundColor Green
    [System.Media.SystemSounds]::Asterisk.Play()
    [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms") | Out-Null
    [System.Windows.Forms.MessageBox]::Show("Windows 11 e programas atualizados com sucesso via Winget!", "Winget 1-Clique", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information) | Out-Null
} catch {
    Write-Error "Erro durante a atualizacao: $_"
}
Start-Sleep -Seconds 2
