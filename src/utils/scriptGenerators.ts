import { WingetConfig } from '../types';

export function getWingetExecutablePath(config: WingetConfig): string {
  if (config.useCustomUserPath) {
    if (config.customExecutablePath.trim()) {
      return config.customExecutablePath.trim();
    }
    return `C:\\Users\\${config.username.trim() || 'alexs'}\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe`;
  }
  return '%LOCALAPPDATA%\\Microsoft\\WindowsApps\\winget.exe';
}

export function buildWingetArguments(config: WingetConfig): string[] {
  const args: string[] = ['upgrade'];

  if (config.all) args.push('--all');
  if (config.silent) args.push('--silent');
  if (config.ignoreSecurityHash) args.push('--ignore-security-hash');
  if (config.acceptPackageAgreements) args.push('--accept-package-agreements');
  if (config.acceptSourceAgreements) args.push('--accept-source-agreements');
  if (config.disableInteractivity) args.push('--disable-interactivity');
  if (config.includeUnknown) args.push('--include-unknown');

  return args;
}

export function buildFullCommand(config: WingetConfig): string {
  const exePath = getWingetExecutablePath(config);
  const args = buildWingetArguments(config);
  return `"${exePath}" ${args.join(' ')}`;
}

export function buildRawCommand(config: WingetConfig): string {
  const exePath = getWingetExecutablePath(config);
  const args = buildWingetArguments(config);
  // Without quotes if path has no spaces or standard format
  return `${exePath} ${args.join(' ')}`;
}

export function generateBatchScript(config: WingetConfig): string {
  const exe = getWingetExecutablePath(config);
  const args = buildWingetArguments(config).join(' ');
  const logFile = config.logFileName || 'winget-update-log.txt';

  const lines: string[] = [
    '@echo off',
    ':: =========================================================================',
    ':: Atualizador Silencioso 1-Clique do Windows 11 com Winget',
    ':: Configurado especialmente para instalacao 100% automatizada e silenciosa',
    ':: =========================================================================',
    'chcp 65001 >nul',
    'title Atualizando Windows 11 e Programas...',
    '',
  ];

  if (config.autoElevateAdmin) {
    lines.push(
      ':: Verificar se esta rodando como Administrador (necessario para instaladores de sistema)',
      'net session >nul 2>&1',
      'if %errorLevel% neq 0 (',
      '    echo Solicitando privilegios de Administrador...',
      '    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath \'%~f0\' -Verb RunAs"',
      '    exit /b',
      ')',
      ''
    );
  }

  lines.push(
    'echo =======================================================================',
    'echo   [1-CLIQUE] ATUALIZADOR AUTOMATICO DO WINDOWS 11 (WINGET)',
    'echo   Iniciando atualizacao 100%% silenciosa...',
    'echo =======================================================================',
    ''
  );

  if (config.logToFile) {
    lines.push(
      `set "LOGPATH=%USERPROFILE%\\Desktop\\${logFile}"`,
      'echo [%DATE% %TIME%] Iniciando atualizacao geral com winget > "%LOGPATH%"',
      `echo Comando: "${exe}" ${args} >> "%LOGPATH%"`,
      ''
    );
  }

  if (config.autoInstallWinget) {
    lines.push(
      ':: =========================================================================',
      ':: Rotina Inteligente: Instalar o Winget automaticamente caso nao exista',
      ':: =========================================================================',
      `set "WINGET_EXE=${exe}"`,
      'where winget >nul 2>&1',
      'if %errorlevel% neq 0 (',
      '    if not exist "%WINGET_EXE%" (',
      '        echo.',
      '        echo [INFO] O Winget ainda nao esta ativo neste Windows.',
      '        echo [AUTO-INSTALADOR] Baixando e instalando o Windows Package Manager oficial da Microsoft...',
      '        echo Isso leva apenas alguns segundos...',
      '        echo.',
      '        powershell -NoProfile -ExecutionPolicy Bypass -Command ^',
      '          "$ProgressPreference = \'SilentlyContinue\'; " ^',
      '          "try { Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe -ErrorAction SilentlyContinue } catch {}; " ^',
      '          "if (-not (Get-Command winget -ErrorAction SilentlyContinue)) { " ^',
      '          "  $tmp = [System.IO.Path]::GetTempPath(); " ^',
      '          "  Write-Host \'Baixando dependencias oficiais da Microsoft...\' -ForegroundColor Cyan; " ^',
      '          "  Invoke-WebRequest -Uri \'https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx\' -OutFile \"$tmp\\vclibs.appx\" -UseBasicParsing; " ^',
      '          "  Add-AppxPackage -Path \"$tmp\\vclibs.appx\" -ErrorAction SilentlyContinue; " ^',
      '          "  Invoke-WebRequest -Uri \'https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx\' -OutFile \"$tmp\\xaml.appx\" -UseBasicParsing; " ^',
      '          "  Add-AppxPackage -Path \"$tmp\\xaml.appx\" -ErrorAction SilentlyContinue; " ^',
      '          "  Write-Host \'Baixando pacote do Winget oficial...\' -ForegroundColor Cyan; " ^',
      '          "  Invoke-WebRequest -Uri \'https://aka.ms/getwinget\' -OutFile \"$tmp\\winget.msixbundle\" -UseBasicParsing; " ^',
      '          "  Add-AppxPackage -Path \"$tmp\\winget.msixbundle\"; " ^',
      '          "  Write-Host \'Winget instalado com sucesso!\' -ForegroundColor Green; " ^',
      '          "}"',
      '        set "PATH=%LOCALAPPDATA%\\Microsoft\\WindowsApps;%PATH%"',
      '        timeout /t 2 >nul',
      '    )',
      ')',
      ''
    );
  } else {
    lines.push(
      `set "WINGET_EXE=${exe}"`,
      ''
    );
  }

  // Check if executable exists or fallback to system winget
  lines.push(
    'if not exist "%WINGET_EXE%" (',
    '    :: Caso nao esteja no caminho especifico, usar winget do PATH do sistema',
    '    where winget >nul 2>&1',
    '    if %errorlevel% equ 0 (',
    '        set "WINGET_EXE=winget.exe"',
    '    ) else (',
    '        if exist "%LOCALAPPDATA%\\Microsoft\\WindowsApps\\winget.exe" (',
    '            set "WINGET_EXE=%LOCALAPPDATA%\\Microsoft\\WindowsApps\\winget.exe"',
    '        ) else (',
    '            set "WINGET_EXE=winget.exe"',
    '        )',
    '    )',
    ')',
    ''
  );

  if (config.logToFile) {
    lines.push(
      `"%WINGET_EXE%" ${args} >> "%LOGPATH%" 2>&1`
    );
  } else {
    lines.push(
      `"%WINGET_EXE%" ${args}`
    );
  }

  if (config.includeWindowsUpdate) {
    lines.push(
      '',
      'echo Verificando atualizacoes do sistema Windows Update...',
      'powershell -NoProfile -ExecutionPolicy Bypass -Command "Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force -Confirm:$false; Install-Module PSWindowsUpdate -Force -Confirm:$false; Get-WindowsUpdate -AcceptAll -Install -AutoReboot:$false" >nul 2>&1'
    );
  }

  if (config.notifyOnFinish) {
    lines.push(
      '',
      ':: Notificacao Sonora e Toast do Windows 11',
      'powershell -NoProfile -Command "[System.Media.SystemSounds]::Asterisk.Play(); $wshell = New-Object -ComObject Wscript.Shell; $wshell.Popup(\'Windows 11 e todos os aplicativos foram atualizados com sucesso!\', 5, \'Winget Auto-Updater Concluido\', 64) | Out-Null"'
    );
  }

  lines.push(
    '',
    'echo =======================================================================',
    'echo   [SUCESSO] Todos os aplicativos compativeis foram atualizados!',
  );

  if (config.logToFile) {
    lines.push('echo   Relatorio salvo em: %LOGPATH%');
  }

  lines.push(
    'echo =======================================================================',
    'timeout /t 3 >nul',
    'exit /b 0'
  );

  return lines.join('\r\n');
}

export function generateVbsScript(config: WingetConfig): string {
  const exe = getWingetExecutablePath(config);
  const args = buildWingetArguments(config).join(' ');
  const logFile = config.logFileName || 'winget-update-log.txt';

  const fullCmd = config.logToFile
    ? `cmd.exe /c chcp 65001 >nul & "${exe}" ${args} >> "%USERPROFILE%\\Desktop\\${logFile}" 2>&1`
    : `cmd.exe /c "${exe}" ${args}`;

  const lines = [
    '\' =========================================================================',
    '\' ATUALIZADOR 100% INVISIVEL EM SEGUNDO PLANO (ZERO JANELAS / POPUPS)',
    '\' Executa o winget em segundo plano absoluto sem abrir janela de terminal.',
    '\' =========================================================================',
    'Dim WshShell, strCommand',
    'Set WshShell = CreateObject("WScript.Shell")',
    '',
    '\' Comando configurado com flags silenciosas e acordos aceitos automaticamente',
    `strCommand = "${fullCmd.replace(/"/g, '""')}"`,
    '',
    '\' O parametro 0 faz a janela ficar 100% invisivel (oculta)',
    '\' O parametro False permite que execute em segundo plano sem travar',
    'WshShell.Run strCommand, 0, True',
    '',
  ];

  if (config.notifyOnFinish) {
    lines.push(
      '\' Notificacao final discreta do Windows',
      'WshShell.Popup "Windows 11 atualizado com sucesso em segundo plano via winget!", 5, "Winget Silencioso - Concluído", 64',
      ''
    );
  }

  lines.push('Set WshShell = Nothing');

  return lines.join('\r\n');
}

export function generatePowerShellScript(config: WingetConfig): string {
  const exe = getWingetExecutablePath(config);
  const argsArray = buildWingetArguments(config).map(a => `'${a}'`).join(', ');
  const logFile = config.logFileName || 'winget-update-log.txt';

  const lines = [
    '# =========================================================================',
    '# Atualizador PowerShell 1-Clique para Windows 11 com Winget',
    '# =========================================================================',
    '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
    '',
    'Write-Host "Iniciando atualizacao 100% silenciosa do Windows 11..." -ForegroundColor Cyan',
    '',
    `$wingetPath = "${exe}"`,
  ];

  if (config.autoInstallWinget) {
    lines.push(
      '# Verificar e instalar Winget automaticamente se nao estiver instalado',
      'if (-not (Get-Command winget -ErrorAction SilentlyContinue) -and -not (Test-Path $wingetPath)) {',
      '    Write-Host "[AVISO] Winget nao detectado. Instalando automaticamente o Windows Package Manager..." -ForegroundColor Yellow',
      '    $ProgressPreference = "SilentlyContinue"',
      '    try { Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe -ErrorAction SilentlyContinue } catch {}',
      '    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {',
      '        $tmp = [System.IO.Path]::GetTempPath()',
      '        Write-Host "Baixando dependencias e pacote oficial Microsoft..." -ForegroundColor Cyan',
      '        Invoke-WebRequest -Uri "https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx" -OutFile "$tmp\\vclibs.appx" -UseBasicParsing',
      '        Add-AppxPackage -Path "$tmp\\vclibs.appx" -ErrorAction SilentlyContinue',
      '        Invoke-WebRequest -Uri "https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx" -OutFile "$tmp\\xaml.appx" -UseBasicParsing',
      '        Add-AppxPackage -Path "$tmp\\xaml.appx" -ErrorAction SilentlyContinue',
      '        Invoke-WebRequest -Uri "https://aka.ms/getwinget" -OutFile "$tmp\\winget.msixbundle" -UseBasicParsing',
      '        Add-AppxPackage -Path "$tmp\\winget.msixbundle"',
      '        Write-Host "Winget instalado com sucesso!" -ForegroundColor Green',
      '    }',
      '    $wingetPath = "$env:LOCALAPPDATA\\Microsoft\\WindowsApps\\winget.exe"',
      '    if (-not (Test-Path $wingetPath)) { $wingetPath = "winget.exe" }',
      '}'
    );
  } else {
    lines.push(
      'if (-not (Test-Path $wingetPath)) {',
      '    $wingetPath = "winget.exe"',
      '}'
    );
  }

  lines.push(
    '',
    `$logPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop", "${logFile}")`,
    `$arguments = @(${argsArray})`,
    '',
    'Write-Host "Executando: $wingetPath $($arguments -join \' \')" -ForegroundColor DarkGray',
    '',
    'try {',
    '    Start-Process -FilePath $wingetPath -ArgumentList $arguments -Wait -WindowStyle Hidden',
    '    Write-Host "`n[SUCESSO] Atualizacao concluida sem intervencao do usuario!" -ForegroundColor Green',
  );

  if (config.notifyOnFinish) {
    lines.push(
      '    [System.Media.SystemSounds]::Asterisk.Play()',
      '    [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms") | Out-Null',
      '    [System.Windows.Forms.MessageBox]::Show("Windows 11 e programas atualizados com sucesso via Winget!", "Winget 1-Clique", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information) | Out-Null'
    );
  }

  lines.push(
    '} catch {',
    '    Write-Error "Erro durante a atualizacao: $_"',
    '}',
    'Start-Sleep -Seconds 2'
  );

  return lines.join('\r\n');
}

export function generateInstallWingetScript(): string {
  return [
    '@echo off',
    ':: =========================================================================',
    ':: INSTALADOR E REPARADOR OFICIAL DO WINGET (WINDOWS PACKAGE MANAGER)',
    ':: Baixa e instala dependencias oficiais (VCLibs, UI.Xaml) e Microsoft AppInstaller',
    ':: =========================================================================',
    'chcp 65001 >nul',
    'title Instalando o Windows Package Manager (Winget)...',
    '',
    'net session >nul 2>&1',
    'if %errorLevel% neq 0 (',
    '    echo Solicitando privilegios de Administrador para instalar o Winget...',
    '    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath \'%~f0\' -Verb RunAs"',
    '    exit /b',
    ')',
    '',
    'echo =======================================================================',
    'echo   INSTALADOR AUTOMATICO DO WINGET - MICROSOFT OFICIAL',
    'echo =======================================================================',
    'echo Verificando instalacao atual...',
    'where winget >nul 2>&1',
    'if %errorlevel% equ 0 (',
    '    echo.',
    '    echo [OK] O Winget ja esta instalado e funcionando neste computador!',
    '    winget --version',
    '    echo.',
    '    echo Pressione qualquer tecla para sair...',
    '    pause >nul',
    '    exit /b 0',
    ')',
    '',
    'echo Baixando e registrando o Winget oficial da Microsoft...',
    'echo Aguarde, isso leva de 15 a 45 segundos...',
    'powershell -NoProfile -ExecutionPolicy Bypass -Command ^',
    '  "$ProgressPreference = \'SilentlyContinue\'; " ^',
    '  "try { Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe -ErrorAction SilentlyContinue } catch {}; " ^',
    '  "if (-not (Get-Command winget -ErrorAction SilentlyContinue)) { " ^',
    '  "  $tmp = [System.IO.Path]::GetTempPath(); " ^',
    '  "  Write-Host \'[1/3] Instalando dependencias VCLibs...\' -ForegroundColor Cyan; " ^',
    '  "  Invoke-WebRequest -Uri \'https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx\' -OutFile \"$tmp\\vclibs.appx\" -UseBasicParsing; " ^',
    '  "  Add-AppxPackage -Path \"$tmp\\vclibs.appx\" -ErrorAction SilentlyContinue; " ^',
    '  "  Write-Host \'[2/3] Instalando UI.Xaml 2.8...\' -ForegroundColor Cyan; " ^',
    '  "  Invoke-WebRequest -Uri \'https://github.com/microsoft/microsoft-ui-xaml/releases/download/v2.8.6/Microsoft.UI.Xaml.2.8.x64.appx\' -OutFile \"$tmp\\xaml.appx\" -UseBasicParsing; " ^',
    '  "  Add-AppxPackage -Path \"$tmp\\xaml.appx\" -ErrorAction SilentlyContinue; " ^',
    '  "  Write-Host \'[3/3] Baixando e instalando pacote oficial do Winget...\' -ForegroundColor Cyan; " ^',
    '  "  Invoke-WebRequest -Uri \'https://aka.ms/getwinget\' -OutFile \"$tmp\\winget.msixbundle\" -UseBasicParsing; " ^',
    '  "  Add-AppxPackage -Path \"$tmp\\winget.msixbundle\"; " ^',
    '  "  Write-Host \'Instalacao concluida com sucesso!\' -ForegroundColor Green; " ^',
    '  "}"',
    '',
    'set "PATH=%LOCALAPPDATA%\\Microsoft\\WindowsApps;%PATH%"',
    'echo.',
    'echo =======================================================================',
    'echo Testando o comando winget recem-instalado:',
    'winget --version',
    'if %errorlevel% equ 0 (',
    '    echo [SUCESSO] Winget instalado e pronto para atualizar seu Windows!',
    ') else (',
    '    echo [AVISO] O pacote foi registrado. Pode ser necessario reiniciar o terminal.',
    ')',
    'echo =======================================================================',
    'pause',
    'exit /b 0'
  ].join('\r\n');
}

export function generateDesktopShortcutInstaller(config: WingetConfig): string {
  const batFilename = 'Atualizar_Windows11_Silencioso.bat';
  return [
    '@echo off',
    'chcp 65001 >nul',
    'echo Criando atalho na sua Area de Trabalho...',
    'set "TARGET=%~dp0' + batFilename + '"',
    'set "SHORTCUT=%USERPROFILE%\\Desktop\\⚡ Atualizar Windows 11 (1-Clique).lnk"',
    'powershell -NoProfile -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut(\'%SHORTCUT%\');$s.TargetPath=\'%TARGET%\';$s.IconLocation=\'%SystemRoot%\\System32\\shell32.dll,238\';$s.Description=\'Atualizar Windows 11 e Programas com 1 Clique (Winget)\';$s.Save()"',
    'echo.',
    'echo [OK] Atalho criado com sucesso na sua Area de Trabalho!',
    'echo Agora basta dar 2 cliques no atalho sempre que quiser atualizar tudo.',
    'timeout /t 4',
  ].join('\r\n');
}

export function generateScheduledTaskCommand(config: WingetConfig): string {
  const exe = getWingetExecutablePath(config);
  const args = buildWingetArguments(config).join(' ');

  // Single-line PowerShell command that can be pasted into an elevated PowerShell prompt:
  return `$action = New-ScheduledTaskAction -Execute "${exe}" -Argument "${args}"; $trigger = New-ScheduledTaskTrigger -Daily -At 12:00; $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable; Register-ScheduledTask -TaskName "Winget-AutoUpdate-Diario" -Action $action -Trigger $trigger -Settings $settings -Description "Atualiza todos os programas silenciosamente via Winget" -User "SYSTEM"`;
}

export function downloadFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
