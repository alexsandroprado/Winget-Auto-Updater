import React, { useState } from 'react';
import { Clock, Calendar, Check, Copy, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { WingetConfig } from '../types';
import { generateScheduledTaskCommand } from '../utils/scriptGenerators';

interface TaskSchedulerGuideProps {
  config: WingetConfig;
}

export const TaskSchedulerGuide: React.FC<TaskSchedulerGuideProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const command = generateScheduledTaskCommand(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Como Deixar o Windows 11 Sempre Atualizado Automaticamente</span>
              <span className="text-[11px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                Zero Esforço
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure o Agendador de Tarefas do Windows 11 para rodar todo dia sem você precisar clicar
            </p>
          </div>
        </div>

        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-5">
          {/* Quick 1-Command Method */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Método Mais Rápido: 1 Comando no PowerShell (Como Administrador)</span>
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Comando PowerShell</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg font-mono text-[11px] text-amber-300/90 overflow-x-auto select-all leading-relaxed">
              {command}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Basta abrir o <strong>PowerShell como Administrador</strong> (clique com o botão direito no menu Iniciar do Windows 11 e escolha "Terminal (Administrador)"), colar e dar Enter. A tarefa será registrada imediatamente!
            </p>
          </div>

          {/* Visual Step by step */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                1
              </div>
              <div className="font-semibold text-slate-900 dark:text-white">Abrir Agendador</div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Pressione a tecla <kbd className="px-1 bg-slate-100 dark:bg-slate-800 rounded">Win</kbd>, digite <strong>Agendador de Tarefas</strong> e abra.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                2
              </div>
              <div className="font-semibold text-slate-900 dark:text-white">Criar Tarefa Básica</div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Clique em <em>Criar Tarefa Básica</em> no painel direito. Nomeie como <em>"Atualizar Windows 11 Winget"</em>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                3
              </div>
              <div className="font-semibold text-slate-900 dark:text-white">Vincular o Script</div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Em Ação, escolha <em>Iniciar um programa</em> e aponte para o seu <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Atualizar_Windows11_Silencioso.bat</code> ou <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">.vbs</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
