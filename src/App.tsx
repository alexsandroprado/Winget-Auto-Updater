/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { WingetConfig } from './types';
import { Header } from './components/Header';
import { CommandCard } from './components/CommandCard';
import { OneClickDownloads } from './components/OneClickDownloads';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { TerminalSimulator } from './components/TerminalSimulator';
import { TaskSchedulerGuide } from './components/TaskSchedulerGuide';
import { TipsGuide } from './components/TipsGuide';
import { Check, ShieldCheck, Zap, Laptop, ArrowDown, Sparkles } from 'lucide-react';

const DEFAULT_CONFIG: WingetConfig = {
  username: 'alexs',
  useCustomUserPath: true,
  customExecutablePath: 'C:\\Users\\alexs\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe',
  all: true,
  silent: true,
  ignoreSecurityHash: true,
  acceptPackageAgreements: true,
  acceptSourceAgreements: true,
  disableInteractivity: true,
  includeUnknown: false,
  autoElevateAdmin: true,
  autoInstallWinget: true,
  logToFile: true,
  logFileName: 'winget-update-log.txt',
  notifyOnFinish: true,
  includeWindowsUpdate: false,
};

export default function App() {
  const [config, setConfig] = useState<WingetConfig>(DEFAULT_CONFIG);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const simulatorRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const handleSimulateScroll = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Windows 11 Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Hero Introduction */}
        <section className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-current" />
            <span>Windows Package Manager (Winget) • Automação Completa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Atualize Todo o Windows 11 com{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Apenas 1 Clique
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Instalação 100% silenciosa em segundo plano sem qualquer caixa de diálogo de contratos (EULA) ou confirmações interativas. Mantenha seus navegadores, ferramentas e aplicativos sempre na última versão com segurança.
          </p>
        </section>

        {/* Master Command Card */}
        <section>
          <CommandCard
            config={config}
            onOpenCustomize={() => setShowConfigPanel(!showConfigPanel)}
            onSimulateRun={handleSimulateScroll}
          />
        </section>

        {/* Customization Panel (collapsible or always accessible) */}
        {showConfigPanel && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-300">
            <ConfigurationPanel
              config={config}
              onChange={setConfig}
              onReset={handleReset}
            />
          </section>
        )}

        {/* 1-Click Ready Download Section */}
        <section>
          <OneClickDownloads config={config} />
        </section>

        {/* Live Terminal Simulator */}
        <section ref={simulatorRef}>
          <TerminalSimulator config={config} />
        </section>

        {/* Task Scheduler Guide */}
        <section>
          <TaskSchedulerGuide config={config} />
        </section>

        {/* Tips & Advanced FAQ */}
        <section id="github-section">
          <TipsGuide config={config} />
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-12 border-t border-slate-200/80 dark:border-slate-800 text-center space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5 opacity-70">
              <div className="bg-slate-400 dark:bg-slate-500 rounded-[1px]"></div>
              <div className="bg-slate-400 dark:bg-slate-500 rounded-[1px]"></div>
              <div className="bg-slate-400 dark:bg-slate-500 rounded-[1px]"></div>
              <div className="bg-slate-400 dark:bg-slate-500 rounded-[1px]"></div>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Winget Win11 Auto-Updater
            </span>
            <span>•</span>
            <span>Configurado para o usuário <strong>{config.username}</strong></span>
          </div>
          <p>
            Utiliza o utilitário nativo e oficial da Microsoft (Windows Package Manager). Livre de bloatware e 100% seguro.
          </p>
        </footer>
      </main>
    </div>
  );
}
