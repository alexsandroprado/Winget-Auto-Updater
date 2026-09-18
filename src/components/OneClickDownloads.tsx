import React, { useState } from 'react';
import { Download, FileCode, Eye, Check, Sparkles, Terminal, Shield, Clock, ExternalLink } from 'lucide-react';
import { WingetConfig } from '../types';
import {
  generateBatchScript,
  generateVbsScript,
  generatePowerShellScript,
  generateDesktopShortcutInstaller,
  generateScheduledTaskCommand,
  generateInstallWingetScript,
  downloadFile,
} from '../utils/scriptGenerators';

interface OneClickDownloadsProps {
  config: WingetConfig;
}

export const OneClickDownloads: React.FC<OneClickDownloadsProps> = ({ config }) => {
  const [activePreview, setActivePreview] = useState<{
    title: string;
    filename: string;
    content: string;
  } | null>(null);

  const [copiedPreview, setCopiedPreview] = useState(false);
  const [downloadedBadge, setDownloadedBadge] = useState<string | null>(null);

  const triggerDownload = (filename: string, content: string, badgeKey: string) => {
    downloadFile(filename, content);
    setDownloadedBadge(badgeKey);
    setTimeout(() => setDownloadedBadge(null), 2500);
  };

  const handleCopyPreview = () => {
    if (activePreview) {
      navigator.clipboard.writeText(activePreview.content);
      setCopiedPreview(true);
      setTimeout(() => setCopiedPreview(false), 2000);
    }
  };

  const batContent = generateBatchScript(config);
  const vbsContent = generateVbsScript(config);
  const ps1Content = generatePowerShellScript(config);
  const shortcutInstallerContent = generateDesktopShortcutInstaller(config);
  const scheduledTaskCommand = generateScheduledTaskCommand(config);
  const installWingetContent = generateInstallWingetScript();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Soluções Prontas para 1-Clique</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-medium">
              Pronto para Baixar
            </span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Escolha o método preferido para manter o Windows 11 atualizado com apenas 1 clique
          </p>
        </div>
      </div>

      {/* Grid of 1-Click Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: Batch File (Recommended) */}
        <div className="rounded-2xl border-2 border-blue-500/40 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all relative flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <FileCode className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500 text-white px-2.5 py-1 rounded-full shadow-xs">
                Mais Recomendado
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Atualizador Silencioso (.bat)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Arquivo executável que pede elevação de Administrador automaticamente, instala o Winget caso esteja ausente, roda atualizações silenciosamente e salva relatório.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>Auto-instala o Winget oficial caso não esteja no Windows</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Auto-elevação para Administrador</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Gera log de atualizações na Área de Trabalho</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Notificação com som e toast ao finalizar</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => triggerDownload('Atualizar_Windows11_Silencioso.bat', batContent, 'bat')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all"
            >
              {downloadedBadge === 'bat' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Baixado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo .BAT</span>
                </>
              )}
            </button>
            <button
              onClick={() => setActivePreview({
                title: 'Script de Atualização Silenciosa (.bat)',
                filename: 'Atualizar_Windows11_Silencioso.bat',
                content: batContent,
              })}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Visualizar código do script"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: 100% Invisible Background Runner (.vbs) */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full border border-purple-200/60 dark:border-purple-800/60">
                100% Invisível
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Modo Segundo Plano Invisível (.vbs)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Não abre NENHUMA janela preta do CMD. Executa totalmente em segundo plano (Modo Fantasma), deixando você trabalhar sem interrupção nenhuma.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <span>Zero janelas pretas piscando na tela</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <span>Ideal para deixar na pasta Inicializar</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <span>Aviso discreto no final quando terminar</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => triggerDownload('Atualizar_100_Invisivel.vbs', vbsContent, 'vbs')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all"
            >
              {downloadedBadge === 'vbs' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Baixado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo .VBS</span>
                </>
              )}
            </button>
            <button
              onClick={() => setActivePreview({
                title: 'Executor Invisível em Segundo Plano (.vbs)',
                filename: 'Atualizar_100_Invisivel.vbs',
                content: vbsContent,
              })}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Visualizar código do script"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 3: Desktop Shortcut Creator */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Terminal className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                Atalho Área de Trabalho
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Criador de Atalho Desktop (.bat)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Gera um atalho oficial com ícone do Windows Update direto na sua Área de Trabalho chamado "⚡ Atualizar Windows 11 (1-Clique)".
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Cria ícone personalizado no Desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Pode ser fixado na Barra de Tarefas ou Iniciar</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => triggerDownload('Criar_Atalho_Desktop.bat', shortcutInstallerContent, 'shortcut')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all"
            >
              {downloadedBadge === 'shortcut' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Baixado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Baixar Criador de Atalho</span>
                </>
              )}
            </button>
            <button
              onClick={() => setActivePreview({
                title: 'Criador de Atalho na Área de Trabalho',
                filename: 'Criar_Atalho_Desktop.bat',
                content: shortcutInstallerContent,
              })}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Visualizar código do script"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 4: Scheduled Task / Total Automation */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/60">
                Automação Total
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Agendador Automático do Windows
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Configura o Windows 11 para rodar o winget upgrade silencioso todo dia às 12:00 automaticamente pelo Agendador de Tarefas, sem você precisar clicar.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Atualização diária programada</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Zero cliques no dia a dia</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(scheduledTaskCommand);
                setDownloadedBadge('task');
                setTimeout(() => setDownloadedBadge(null), 2500);
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-500/20 transition-all"
            >
              {downloadedBadge === 'task' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Comando PowerShell Copiado!</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Copiar Comando de Agendamento</span>
                </>
              )}
            </button>
            <button
              onClick={() => setActivePreview({
                title: 'Comando do Agendador de Tarefas (PowerShell)',
                filename: 'Agendar_Tarefa_Diaria.ps1',
                content: scheduledTaskCommand,
              })}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Visualizar código do script"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Winget Installer / Repair Card */}
      <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
              Instalador Oficial
            </span>
            <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
              Windows Package Manager (Winget)
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Não tem o Winget no seu Windows? Baixe o Instalador Oficial em 1-Clique
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Se o seu computador (ou de algum cliente/amigo) ainda não tiver o comando <code className="bg-white/80 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-700 dark:text-indigo-300 font-mono">winget</code> instalado, este arquivo baixa as dependências oficiais da Microsoft (VCLibs e UI.Xaml 2.8) e registra o pacote oficial do Winget automaticamente.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => triggerDownload('Instalar_Winget_Oficial.bat', installWingetContent, 'winget-installer')}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all whitespace-nowrap"
          >
            {downloadedBadge === 'winget-installer' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Instalador Baixado!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Baixar Instalador do Winget (.bat)</span>
              </>
            )}
          </button>
          <button
            onClick={() => setActivePreview({
              title: 'Instalador e Reparador Oficial do Winget (.bat)',
              filename: 'Instalar_Winget_Oficial.bat',
              content: installWingetContent,
            })}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            title="Visualizar código do instalador"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">
                  {activePreview.title}
                </span>
                <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                  {activePreview.filename}
                </span>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-slate-800"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/80 leading-relaxed whitespace-pre-wrap selection:bg-blue-600">
              {activePreview.content}
            </div>

            <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950">
              <span className="text-xs text-slate-500">
                Codificado para Windows (CRLF / UTF-8)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPreview}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{copiedPreview ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
                <button
                  onClick={() => triggerDownload(activePreview.filename, activePreview.content, 'modal')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Arquivo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
