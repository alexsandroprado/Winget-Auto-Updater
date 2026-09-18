import React from 'react';
import { Settings, User, Terminal, Shield, Bell, FileText, RefreshCw, CheckCircle2, RotateCcw } from 'lucide-react';
import { WingetConfig } from '../types';

interface ConfigurationPanelProps {
  config: WingetConfig;
  onChange: (newConfig: WingetConfig) => void;
  onReset: () => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  config,
  onChange,
  onReset,
}) => {
  const updateField = <K extends keyof WingetConfig>(field: K, value: WingetConfig[K]) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-500" />
            <span>Painel de Ajustes e Personalização</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure o caminho do executável e ative/desative chaves conforme sua preferência
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Padrão (Alexs)</span>
        </button>
      </div>

      {/* Path configuration */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-blue-500" />
          <span>Caminho do Executável do Winget</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateField('useCustomUserPath', true)}
            className={`p-3 rounded-xl border text-left text-xs transition-all ${
              config.useCustomUserPath
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="font-semibold flex items-center justify-between">
              <span>Caminho Específico do Usuário</span>
              {config.useCustomUserPath && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
            </div>
            <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              C:\Users\{config.username}\AppData\...\winget.exe
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateField('useCustomUserPath', false)}
            className={`p-3 rounded-xl border text-left text-xs transition-all ${
              !config.useCustomUserPath
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="font-semibold flex items-center justify-between">
              <span>Caminho Universal (%LOCALAPPDATA%)</span>
              {!config.useCustomUserPath && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
            </div>
            <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              Funciona em qualquer PC ou usuário do Windows
            </div>
          </button>
        </div>

        {config.useCustomUserPath && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Nome de Usuário no Windows:
            </span>
            <input
              type="text"
              value={config.username}
              onChange={(e) => updateField('username', e.target.value)}
              className="flex-1 max-w-xs px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              placeholder="ex: alexs"
            />
          </div>
        )}
      </div>

      {/* Main Flags Toggles */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-blue-500" />
          <span>Parâmetros e Opções do Winget</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* --all */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.all}
              onChange={(e) => updateField('all', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">--all</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Atualiza todos os aplicativos instalados encontrados
              </p>
            </div>
          </label>

          {/* --silent */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.silent}
              onChange={(e) => updateField('silent', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">--silent</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Modo silencioso (suprime wizards de instaladores)
              </p>
            </div>
          </label>

          {/* --ignore-security-hash */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.ignoreSecurityHash}
              onChange={(e) => updateField('ignoreSecurityHash', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">--ignore-security-hash</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Ignora divergências de hash de segurança de pacotes
              </p>
            </div>
          </label>

          {/* --accept-package-agreements */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.acceptPackageAgreements}
              onChange={(e) => updateField('acceptPackageAgreements', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">--accept-package-agreements</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Aceita automaticamente os contratos EULA dos pacotes
              </p>
            </div>
          </label>

          {/* --accept-source-agreements */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.acceptSourceAgreements}
              onChange={(e) => updateField('acceptSourceAgreements', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">--accept-source-agreements</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Aceita termos de fontes e catálogos (msstore, winget)
              </p>
            </div>
          </label>

          {/* --disable-interactivity */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.disableInteractivity}
              onChange={(e) => updateField('disableInteractivity', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">--disable-interactivity</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Desativa perguntas ou confirmações interativas
              </p>
            </div>
          </label>

          {/* --include-unknown */}
          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.includeUnknown}
              onChange={(e) => updateField('includeUnknown', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="font-mono text-xs font-bold text-yellow-600 dark:text-yellow-400">--include-unknown</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Tenta atualizar apps cuja versão atual é desconhecida
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Script & System Enhancements */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span>Comportamento do Script no Windows 11</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-start gap-3 p-3 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.autoInstallWinget}
              onChange={(e) => updateField('autoInstallWinget', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Auto-Instalar o Winget se Não Existir
                </span>
                <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.2 rounded-full font-bold">Novo</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Detecta automaticamente se o Winget está ausente, baixa e registra o Windows Package Manager oficial da Microsoft (AppInstaller) com dependências
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.autoElevateAdmin}
              onChange={(e) => updateField('autoElevateAdmin', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Auto-Elevação para Administrador
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Evita erros de "Acesso Negado" em programas que precisam de permissão do sistema
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.logToFile}
              onChange={(e) => updateField('logToFile', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Salvar Histórico na Área de Trabalho
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Cria o arquivo <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">winget-update-log.txt</code> com data e status
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.notifyOnFinish}
              onChange={(e) => updateField('notifyOnFinish', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Aviso Visual e Som ao Finalizar
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Emite sinal sonoro e notificação quando todas as atualizações terminarem
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.includeWindowsUpdate}
              onChange={(e) => updateField('includeWindowsUpdate', e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Incluir Windows Update do Sistema
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Atualiza os patches cumulativos do Windows além dos programas
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
