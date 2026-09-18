import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Check, Sparkles, Terminal, ShieldAlert, Cpu } from 'lucide-react';
import { WingetConfig } from '../types';
import { buildFullCommand } from '../utils/scriptGenerators';

interface TerminalSimulatorProps {
  config: WingetConfig;
}

interface SimulatedStep {
  text: string;
  type: 'cmd' | 'info' | 'header' | 'app' | 'download' | 'success' | 'warning';
  delay: number; // ms to wait before showing
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({ config }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulateMissingWinget, setSimulateMissingWinget] = useState(false);
  const [lines, setLines] = useState<Array<{ text: string; type: SimulatedStep['type'] }>>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const command = buildFullCommand(config);

  const startSimulation = () => {
    setIsRunning(true);
    setLines([
      { text: `PS C:\\Users\\${config.username}> .\\Atualizar_Windows11_Silencioso.bat`, type: 'cmd' },
    ]);

    const stepsWithMissingWinget: SimulatedStep[] = [
      { text: '=======================================================================', type: 'info', delay: 300 },
      { text: '  [1-CLIQUE] ATUALIZADOR AUTOMATICO DO WINDOWS 11 (WINGET)', type: 'info', delay: 500 },
      { text: '=======================================================================', type: 'info', delay: 700 },
      { text: '[INFO] O Winget ainda nao esta ativo neste Windows.', type: 'warning', delay: 1000 },
      { text: '[AUTO-INSTALADOR] Baixando e instalando o Windows Package Manager oficial da Microsoft...', type: 'warning', delay: 1300 },
      { text: 'Baixando dependencias oficiais da Microsoft (VCLibs x64)...', type: 'download', delay: 1700 },
      { text: '   [████████████████████████████████] 100% - Microsoft.VCLibs instalado!', type: 'success', delay: 2300 },
      { text: 'Baixando biblioteca de interface Microsoft.UI.Xaml 2.8...', type: 'download', delay: 2700 },
      { text: '   [████████████████████████████████] 100% - Microsoft.UI.Xaml registrado!', type: 'success', delay: 3200 },
      { text: 'Baixando pacote do Winget oficial (aka.ms/getwinget)...', type: 'download', delay: 3600 },
      { text: '   [████████████████████████████████] 100% - Microsoft.DesktopAppInstaller registrado com sucesso!', type: 'success', delay: 4200 },
      { text: '✔ Winget instalado com sucesso no sistema! Versao v1.9.25200', type: 'success', delay: 4600 },
      { text: 'Continuando automaticamente para a atualizacao dos aplicativos...', type: 'info', delay: 5000 },
      { text: 'Localizando programas com atualizacoes pendentes...', type: 'header', delay: 5400 },
      { text: '--------------------------------------------------------------------------------------', type: 'info', delay: 5700 },
      { text: 'Google Chrome                 Google.Chrome          128.0.6613    130.0.6723   winget', type: 'app', delay: 6100 },
      { text: 'Microsoft Visual Studio Code  Microsoft.VSCode       1.93.0        1.94.2       winget', type: 'app', delay: 6400 },
      { text: '7-Zip (x64)                   7zip.7zip              24.06         24.08        winget', type: 'app', delay: 6700 },
      { text: '>> Atualizando aplicativos em segundo plano sem perguntas...', type: 'download', delay: 7100 },
      { text: '   [████████████████████████████████] 100% - Todos os programas atualizados!', type: 'success', delay: 7800 },
      { text: '✔ SUCESSO COMPLETO: Winget instalado e programas 100% atualizados!', type: 'success', delay: 8400 },
    ];

    const standardSteps: SimulatedStep[] = [
      { text: 'Verificando fontes configuradas do Windows Package Manager...', type: 'info', delay: 400 },
      { text: 'Conectado a: winget (https://cdn.winget.microsoft.com/cache)', type: 'info', delay: 700 },
      { text: 'Conectado a: msstore (Microsoft Store Service)', type: 'info', delay: 900 },
      { text: 'Localizando aplicativos com atualizações disponíveis...', type: 'header', delay: 1300 },
      { text: 'Nome                          Id                     Versão Atual  Disponível   Origem', type: 'info', delay: 1700 },
      { text: '--------------------------------------------------------------------------------------', type: 'info', delay: 1800 },
      { text: 'Google Chrome                 Google.Chrome          128.0.6613    130.0.6723   winget', type: 'app', delay: 2000 },
      { text: 'Microsoft Visual Studio Code  Microsoft.VSCode       1.93.0        1.94.2       winget', type: 'app', delay: 2200 },
      { text: 'Git for Windows               Git.Git                2.46.0        2.47.0       winget', type: 'app', delay: 2400 },
      { text: '7-Zip (x64)                   7zip.7zip              24.06         24.08        winget', type: 'app', delay: 2600 },
      { text: 'Microsoft PowerToys           Microsoft.PowerToys    0.84.0        0.85.1       winget', type: 'app', delay: 2800 },
      { text: 'Discord                       Discord.Discord        1.0.9150      1.0.9160     winget', type: 'app', delay: 3000 },
      { text: '--------------------------------------------------------------------------------------', type: 'info', delay: 3200 },
      { text: 'Encontradas 6 atualizações de pacotes.', type: 'info', delay: 3400 },
      { text: 'Contratos de licença: Aceitos automaticamente (--accept-package-agreements)', type: 'info', delay: 3600 },
      { text: 'Contratos das fontes: Aceitos automaticamente (--accept-source-agreements)', type: 'info', delay: 3800 },
      { text: 'Interatividade desativada: Nenhuma tela de confirmação será exibida (--disable-interactivity)', type: 'info', delay: 4000 },
      { text: 'Modo silencioso ativo: Executando instaladores em segundo plano (--silent)', type: 'info', delay: 4200 },
      { text: '>> Baixando e instalando Google Chrome silenciosamente...', type: 'download', delay: 4600 },
      { text: '   [████████████████████████████████] 100% - Google.Chrome instalado com sucesso!', type: 'success', delay: 5200 },
      { text: '>> Baixando e instalando Microsoft.VSCode silenciosamente...', type: 'download', delay: 5600 },
      { text: '   [████████████████████████████████] 100% - Microsoft.VSCode instalado com sucesso!', type: 'success', delay: 6200 },
      { text: '>> Baixando e instalando Git.Git silenciosamente...', type: 'download', delay: 6600 },
      { text: '   [████████████████████████████████] 100% - Git.Git instalado com sucesso!', type: 'success', delay: 7100 },
      { text: '>> Atualizando 7zip, PowerToys e Discord...', type: 'download', delay: 7500 },
      { text: '   [████████████████████████████████] 100% - Todos os 6 pacotes atualizados com sucesso!', type: 'success', delay: 8200 },
      { text: '======================================================================================', type: 'info', delay: 8500 },
      { text: '✔ SUCESSO COMPLETO: Seu Windows 11 e todos os aplicativos estão 100% atualizados!', type: 'success', delay: 8800 },
    ];

    const steps = simulateMissingWinget ? stepsWithMissingWinget : standardSteps;
    const maxDuration = simulateMissingWinget ? 8700 : 9000;

    steps.forEach((step) => {
      setTimeout(() => {
        setLines((prev) => [...prev, { text: step.text, type: step.type }]);
      }, step.delay);
    });

    setTimeout(() => {
      setIsRunning(false);
    }, maxDuration);
  };

  const clearSimulation = () => {
    setLines([]);
    setIsRunning(false);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-500" />
            <span>Simulador Interativo do Terminal Windows 11</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Veja em tempo real exatamente como o winget executa silenciosamente sem intervenção
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Scenario toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => { setSimulateMissingWinget(false); clearSimulation(); }}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                !simulateMissingWinget
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Com Winget
            </button>
            <button
              onClick={() => { setSimulateMissingWinget(true); clearSimulation(); }}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                simulateMissingWinget
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>Sem Winget (Auto-Instala)</span>
              <span className="text-[9px] bg-blue-400/30 text-blue-100 px-1 rounded-full">Novo</span>
            </button>
          </div>

          <button
            onClick={startSimulation}
            disabled={isRunning}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
              isRunning
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Executando...' : 'Iniciar Simulação'}</span>
          </button>

          {lines.length > 0 && !isRunning && (
            <button
              onClick={clearSimulation}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulated Windows Terminal Box */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1017] text-slate-200 font-mono text-xs overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-[#161b22] px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-slate-400 select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-300">
              <span className="text-blue-400">Windows PowerShell</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Winget 1-Clique</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Host: Windows 11 Pro</span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-5 min-h-[220px] max-h-[380px] overflow-y-auto space-y-1 leading-relaxed">
          {lines.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <Terminal className="w-8 h-8 mx-auto text-slate-600" />
              <div className="text-slate-400 text-xs">
                Clique no botão <span className="text-emerald-400 font-semibold">"Iniciar Simulação"</span> acima para assistir a execução passo a passo do comando winget.
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {command}
              </div>
            </div>
          ) : (
            lines.map((line, idx) => {
              let colorClass = 'text-slate-300';
              if (line.type === 'cmd') colorClass = 'text-white font-bold pb-1';
              else if (line.type === 'header') colorClass = 'text-cyan-400 font-semibold pt-1';
              else if (line.type === 'app') colorClass = 'text-sky-300';
              else if (line.type === 'download') colorClass = 'text-purple-300';
              else if (line.type === 'success') colorClass = 'text-emerald-400 font-semibold';
              else if (line.type === 'warning') colorClass = 'text-amber-400';
              else if (line.type === 'info') colorClass = 'text-slate-400';

              return (
                <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
                  {line.text}
                </div>
              );
            })
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
