import React, { useState } from 'react';
import { Copy, Check, Terminal, Play, ShieldAlert, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { WingetConfig } from '../types';
import { buildFullCommand, buildRawCommand } from '../utils/scriptGenerators';

interface CommandCardProps {
  config: WingetConfig;
  onOpenCustomize: () => void;
  onSimulateRun: () => void;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  config,
  onOpenCustomize,
  onSimulateRun,
}) => {
  const [copied, setCopied] = useState(false);
  const command = buildFullCommand(config);
  const rawCommand = buildRawCommand(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8 transition-all">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top bar info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Comando Mestre Oficial do Winget
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pronto para executar no Windows 11 com todos os contratos pré-aceitos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCustomize}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Personalizar Parâmetros</span>
            </button>
            <button
              onClick={onSimulateRun}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200/60 dark:border-blue-800/60 rounded-lg transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Testar Simulação</span>
            </button>
          </div>
        </div>

        {/* Command terminal box */}
        <div className="relative group rounded-xl border border-slate-800/80 bg-slate-950 text-slate-100 shadow-inner overflow-hidden">
          {/* Header simulated dots */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-[11px] text-slate-400">PowerShell / Prompt de Comando (Windows 11)</span>
            </div>
            <span className="text-[10px] text-slate-500">UTF-8 • Executável Winget</span>
          </div>

          <div className="p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed select-all">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold select-none">&gt;</span>
              <div className="space-x-1.5 break-all">
                <span className="text-emerald-400 font-semibold">{`"${config.useCustomUserPath ? (config.customExecutablePath || `C:\\Users\\${config.username}\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe`) : '%LOCALAPPDATA%\\Microsoft\\WindowsApps\\winget.exe'}"`}</span>
                <span className="text-amber-300 font-bold">upgrade</span>
                {config.all && <span className="text-cyan-300">--all</span>}
                {config.silent && <span className="text-purple-300">--silent</span>}
                {config.ignoreSecurityHash && <span className="text-rose-300">--ignore-security-hash</span>}
                {config.acceptPackageAgreements && <span className="text-sky-300">--accept-package-agreements</span>}
                {config.acceptSourceAgreements && <span className="text-indigo-300">--accept-source-agreements</span>}
                {config.disableInteractivity && <span className="text-emerald-300">--disable-interactivity</span>}
                {config.includeUnknown && <span className="text-yellow-300">--include-unknown</span>}
              </div>
            </div>
          </div>

          {/* Copy Floating Button */}
          <div className="absolute top-10 right-3 flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
              title="Copiar comando completo para a área de transferência"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Comando</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature badges explaining the flags */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">--all</div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5">Todos os Apps</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Atualiza tudo</div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40 text-center">
            <div className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">--silent</div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5">100% Silencioso</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Sem janelas extras</div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 text-center">
            <div className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">--ignore-hash</div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5">Sem Travar</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Ignora falhas hash</div>
          </div>

          <div className="p-2.5 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 text-center">
            <div className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400">--package-agreements</div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5">Sem Contratos</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Aceita termos auto</div>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-center">
            <div className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">--source-agreements</div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5">Repositório</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Aceita fontes</div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">--disable-interactivity</div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-0.5">Zero Perguntas</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Sem confirmações</div>
          </div>
        </div>

        {/* Pro Tip note */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/50 text-xs text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-blue-700 dark:text-blue-300">Dica Expressa do Windows:</strong> Você pode pressionar <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-mono shadow-xs">Win + R</kbd>, colar o comando acima e dar <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[11px] font-mono shadow-xs">Enter</kbd> para rodar instantaneamente agora! Ou baixe os executáveis 1-clique abaixo.
          </p>
        </div>
      </div>
    </div>
  );
};
