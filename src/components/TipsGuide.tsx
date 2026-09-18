import React, { useState } from 'react';
import { HelpCircle, BookmarkCheck, Pin, Terminal, Shield, Sparkles, FolderUp, ChevronDown, ChevronUp } from 'lucide-react';

export const TipsGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'commands' | 'startup' | 'faq'>('commands');

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>Guia Avançado & Dicas do Winget no Windows 11</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aprenda a travar versões de programas, iniciar com o Windows e diagnosticar
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('commands')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'commands'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Comandos Úteis
          </button>
          <button
            onClick={() => setActiveTab('startup')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'startup'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ao Ligar o PC (Startup)
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'faq'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Perguntas Frequentes
          </button>
        </div>
      </div>

      {/* Tab 1: Useful Winget Commands */}
      {activeTab === 'commands' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-rose-500" />
                <span>Travar um Aplicativo (Evitar que atualize)</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Se você precisa manter uma versão específica de um programa sem atualizá-lo:
            </p>
            <div className="p-2 bg-slate-900 text-emerald-400 rounded font-mono text-[11px] select-all">
              winget pin add --id Exemplo.NomeDoApp
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-500" />
                <span>Listar Apenas o que Precisa de Update</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Para ver na tela apenas a tabela de programas com novas versões:
            </p>
            <div className="p-2 bg-slate-900 text-cyan-400 rounded font-mono text-[11px] select-all">
              winget upgrade
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>Atualizar Catálogo e Repositórios</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Forçar sincronização de novidades da Microsoft Store e Winget:
            </p>
            <div className="p-2 bg-slate-900 text-purple-300 rounded font-mono text-[11px] select-all">
              winget source update
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instalar Novo Aplicativo Silenciosamente</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Instalação limpa de qualquer aplicativo sem perguntas de contratos:
            </p>
            <div className="p-2 bg-slate-900 text-yellow-300 rounded font-mono text-[11px] select-all">
              winget install --id NomeDoApp --silent --accept-package-agreements
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Startup Folder */}
      {activeTab === 'startup' && (
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <FolderUp className="w-4 h-4 text-blue-500" />
            <span>Como Rodar Sempre que Você Ligar o Windows 11</span>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Você pode fazer o arquivo <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">Atualizar_100_Invisivel.vbs</code> rodar automaticamente ao iniciar o Windows:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
            <li>
              Pressione <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">Win + R</kbd> no teclado.
            </li>
            <li>
              Digite <code className="bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-bold">shell:startup</code> e pressione Enter.
            </li>
            <li>
              Cole o arquivo <strong className="text-slate-900 dark:text-white">Atualizar_100_Invisivel.vbs</strong> dentro dessa pasta que abriu.
            </li>
            <li>
              <strong>Pronto!</strong> A partir de agora, toda vez que seu computador ligar, o Winget atualizará todos os programas 100% em silêncio sem incomodar você.
            </li>
          </ol>
        </div>
      )}

      {/* Tab 3: FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 space-y-1">
            <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <span>E se o meu computador não tiver o Winget instalado?</span>
              <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.2 rounded-full font-bold">Auto-Instala</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Não se preocupe! O script agora conta com uma <strong>rotina inteligente de auto-instalação</strong>. Se o executável <code className="bg-white/80 dark:bg-slate-800 px-1 rounded font-mono">winget</code> não estiver presente, o script baixa automaticamente as dependências oficiais da Microsoft (VCLibs e UI.Xaml 2.8), registra o pacote oficial do Windows Package Manager (AppInstaller) e continua para a atualização sem você precisar de nenhum trabalho manual.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white">
              O que acontece com programas que estão abertos (ex: Google Chrome)?
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              O instalador atualiza os arquivos em disco silenciosamente. Na próxima vez que você fechar e reabrir o Chrome ou reiniciar, ele já carregará a nova versão automaticamente.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white">
              Por que a flag --ignore-security-hash é recomendada pelo seu comando?
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Muitos desenvolvedores lançam correções rápidas (ex: Discord, Chrome, VS Code) usando a mesma URL antes do repositório da Microsoft atualizar o hash SHA256. Essa flag garante que a atualização continue sem travar com erro de hash divergente.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white">
              Onde fica gravado o relatório das atualizações feitas?
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Nosso script executável grava automaticamente um arquivo de log chamado <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">winget-update-log.txt</code> na sua Área de Trabalho com data, hora e a lista de tudo o que foi atualizado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
