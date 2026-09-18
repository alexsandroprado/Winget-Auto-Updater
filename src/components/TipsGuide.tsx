import React, { useState } from 'react';
import {
  HelpCircle,
  BookmarkCheck,
  Pin,
  Terminal,
  Shield,
  Sparkles,
  FolderUp,
  ChevronDown,
  ChevronUp,
  Github,
  Copy,
  Check,
  Globe,
  AlertTriangle,
  ExternalLink,
  PlusCircle,
  FileCode2,
  RefreshCw,
} from 'lucide-react';
import { WingetConfig } from '../types';
import { generatePowerShellScript, generateBatchScript } from '../utils/scriptGenerators';

interface TipsGuideProps {
  config?: WingetConfig;
}

export const TipsGuide: React.FC<TipsGuideProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'commands' | 'startup' | 'github' | 'faq'>('github');
  const [githubUser, setGithubUser] = useState('alexsandroprado');
  const [githubRepo, setGithubRepo] = useState('Winget-Auto-Updater');
  const [branch, setBranch] = useState<'main' | 'master'>('main');
  const [scriptFilename, setScriptFilename] = useState<string>('update.ps1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const effectiveConfig: WingetConfig = config || {
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

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const cleanUser = githubUser.trim() || 'alexsandroprado';
  const cleanRepo = githubRepo.trim() || 'Winget-Auto-Updater';

  // Computed raw URL based on selected branch and filename
  const rawUrl = `https://raw.githubusercontent.com/${cleanUser}/${cleanRepo}/${branch}/${scriptFilename}`;

  // Direct 1-liner commands
  const oneLinerPowerShell = `irm ${rawUrl} | iex`;
  const oneLinerWinR = `powershell -ExecutionPolicy Bypass -Command "irm ${rawUrl} | iex"`;
  const oneLinerCmd = `curl -sL "${rawUrl}" -o "%TEMP%\\${scriptFilename}" && "%TEMP%\\${scriptFilename}"`;

  // The actual script content to paste into GitHub
  const isPs1 = scriptFilename.endsWith('.ps1');
  const fileContentToPaste = isPs1
    ? generatePowerShellScript(effectiveConfig)
    : generateBatchScript(effectiveConfig);

  // Direct link to create this file on GitHub web editor
  const createOnGitHubUrl = `https://github.com/${cleanUser}/${cleanRepo}/new/${branch}?filename=${encodeURIComponent(scriptFilename)}`;

  // Live GitHub verification state
  const [isCheckingRepo, setIsCheckingRepo] = useState(false);
  const [repoFound, setRepoFound] = useState<boolean | null>(null);
  const [repoFiles, setRepoFiles] = useState<string[]>([]);
  const [checkError, setCheckError] = useState<string | null>(null);

  const checkGitHubFiles = async () => {
    setIsCheckingRepo(true);
    setCheckError(null);
    try {
      const res = await fetch(`https://api.github.com/repos/${cleanUser}/${cleanRepo}/contents`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const names = data.map((item: { name: string }) => item.name);
          setRepoFiles(names);
          setRepoFound(true);
        } else {
          setRepoFound(true);
          setRepoFiles([]);
        }
      } else if (res.status === 404) {
        setRepoFound(false);
        setRepoFiles([]);
        setCheckError('Repositório não encontrado (ou está configurado como Privado).');
      } else {
        setCheckError(`Resposta do GitHub: status ${res.status}`);
      }
    } catch {
      setCheckError('Não foi possível conectar à API do GitHub.');
    } finally {
      setIsCheckingRepo(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'github') {
      checkGitHubFiles();
    }
  }, [cleanUser, cleanRepo, activeTab]);

  const targetFileExists = repoFiles.includes(scriptFilename);

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>Guia Avançado & Dicas do Winget no Windows 11</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aprenda a executar direto do GitHub pela nuvem, travar versões e iniciar com o Windows
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'github'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Usar via GitHub</span>
            <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded-full font-bold">Nuvem</span>
          </button>
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

      {/* Tab: GitHub Cloud Execution */}
      {activeTab === 'github' && (
        <div className="space-y-4 text-xs">
          {/* GitHub configuration box */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                  Configuração do Repositório GitHub
                </span>
              </div>
              <a
                href={`https://github.com/${cleanUser}/${cleanRepo}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                <span>github.com/{cleanUser}/{cleanRepo}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Usuário GitHub:
                </label>
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  placeholder="alexsandroprado"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Repositório:
                </label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white focus:outline-hidden"
                  placeholder="Winget-Auto-Updater"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Branch:
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as 'main' | 'master')}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="main">main (padrão atual)</option>
                  <option value="master">master</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Arquivo:
                </label>
                <select
                  value={scriptFilename}
                  onChange={(e) => setScriptFilename(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="update.ps1">update.ps1 (Recomendado - Curto)</option>
                  <option value="Atualizar_Windows11_Silencioso.ps1">Atualizar_Windows11_Silencioso.ps1</option>
                  <option value="update.bat">update.bat</option>
                  <option value="Atualizar_Windows11_Silencioso.bat">Atualizar_Windows11_Silencioso.bat</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-time GitHub Repository & File Diagnostic Banner */}
          <div className={`p-4 rounded-xl border transition-all space-y-3 ${
            targetFileExists
              ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200'
              : repoFound
              ? 'border-amber-300 dark:border-amber-900/70 bg-amber-50/70 dark:bg-amber-950/25 text-amber-900 dark:text-amber-200'
              : 'border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isCheckingRepo ? (
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                ) : targetFileExists ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <h4 className="font-bold text-xs">
                  Diagnóstico em Tempo Real do seu Repositório GitHub
                </h4>
              </div>

              <button
                onClick={checkGitHubFiles}
                disabled={isCheckingRepo}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingRepo ? 'animate-spin' : ''}`} />
                <span>{isCheckingRepo ? 'Verificando...' : 'Re-verificar Agora'}</span>
              </button>
            </div>

            {/* Diagnostic results breakdown */}
            {isCheckingRepo ? (
              <p className="text-[11px] text-slate-500">
                Conectando à API do GitHub e inspecionando arquivos em <code className="font-mono">{cleanUser}/{cleanRepo}</code>...
              </p>
            ) : targetFileExists ? (
              <div className="space-y-1">
                <p className="text-[11px] leading-relaxed font-medium text-emerald-800 dark:text-emerald-300">
                  🎉 <strong>Tudo Certo!</strong> O arquivo <code className="bg-emerald-200/60 dark:bg-emerald-900/60 px-1 py-0.5 rounded font-mono font-bold">{scriptFilename}</code> existe no seu repositório GitHub e o link raw está <strong>100% ativo</strong>.
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Você já pode copiar o comando abaixo e rodar no PowerShell de qualquer Windows 11!
                </p>
              </div>
            ) : repoFound ? (
              <div className="space-y-2">
                <p className="text-[11px] leading-relaxed">
                  🔍 Seu repositório <a href={`https://github.com/${cleanUser}/${cleanRepo}`} target="_blank" rel="noreferrer" className="font-bold underline text-blue-600 dark:text-blue-400">{cleanUser}/{cleanRepo}</a> <strong>existe e é público</strong>, mas o arquivo <code className="bg-amber-200/60 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono font-bold">{scriptFilename}</code> <strong>ainda NÃO foi criado dentro dele</strong>.
                </p>

                {/* Show actual files found */}
                {repoFiles.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 text-[11px] space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Arquivos encontrados atualmente na raiz do seu repositório:
                    </span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {repoFiles.map((name) => (
                        <span
                          key={name}
                          className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px]"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  👉 Para corrigir o erro 404 e ativar o link raw, basta salvar o arquivo <code className="font-mono font-bold">{scriptFilename}</code> no seu GitHub usando os botões abaixo:
                </p>
              </div>
            ) : (
              <div className="space-y-1 text-[11px]">
                <p className="text-rose-600 dark:text-rose-400 font-medium">
                  {checkError || `O repositório ${cleanUser}/${cleanRepo} não foi encontrado no GitHub.`}
                </p>
                <p className="text-slate-500">
                  Verifique se o nome de usuário ou repositório possui letras maiúsculas/minúsculas diferentes ou se o repositório está como <strong>Private</strong>.
                </p>
              </div>
            )}

            {/* Action buttons to fix */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopy(fileContentToPaste, 'codeToPaste')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] shadow-xs transition-colors"
              >
                {copiedKey === 'codeToPaste' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'codeToPaste' ? 'Código Copiado!' : '1. Copiar Código do Script'}</span>
              </button>

              <a
                href={createOnGitHubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Criar {scriptFilename} no GitHub com 1 Clique</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={rawUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-[11px] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>3. Abrir Link Raw</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 1-Line Commands */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Comandos Prontos de 1-Linha (Atualizados para o seu repositório)</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                Arquivo: <strong className="font-mono text-blue-600 dark:text-blue-400">{scriptFilename}</strong> (branch <strong className="font-mono">{branch}</strong>)
              </span>
            </div>

            {/* Command 1: PowerShell irm | iex */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded">
                    PowerShell (Recomendado)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Abra o PowerShell e cole:
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(oneLinerPowerShell, 'ps1')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-colors"
                >
                  {copiedKey === 'ps1' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'ps1' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-emerald-400 overflow-x-auto select-all break-all">
                {oneLinerPowerShell}
              </div>
            </div>

            {/* Command 2: Win + R */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white px-2 py-0.5 rounded">
                    Win + R (Caixa Executar)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Aperte Win+R, cole e tecle Enter:
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(oneLinerWinR, 'winr')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-medium transition-colors"
                >
                  {copiedKey === 'winr' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'winr' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-cyan-300 overflow-x-auto select-all break-all">
                {oneLinerWinR}
              </div>
            </div>

            {/* Command 3: CMD / curl */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded">
                    CMD / Prompt com curl
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Baixa e roda no Prompt de Comando:
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(oneLinerCmd, 'cmd')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-medium transition-colors"
                >
                  {copiedKey === 'cmd' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'cmd' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="font-mono text-xs text-amber-300 overflow-x-auto select-all break-all">
                {oneLinerCmd}
              </div>
            </div>
          </div>

          {/* Quick 3-Step Setup Instructions */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Como resolver o erro 404 no GitHub em menos de 1 minuto:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              <li>
                <strong>Verifique a Visibilidade do Repositório:</strong> Acesse <a href={`https://github.com/${cleanUser}/${cleanRepo}/settings`} target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">Configurações do Repositório</a> e confirme se ele está como <strong>Public (Público)</strong>. Se estiver Privado, o GitHub não permite download anônimo pelo PowerShell.
              </li>
              <li>
                <strong>Crie o arquivo dentro dele:</strong> Clique no botão <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded font-mono text-[10px]">2. Criar {scriptFilename} no GitHub Agora</span> acima. Ele já abrirá o GitHub no navegador pronto para salvar.
              </li>
              <li>
                <strong>Cole e Salve:</strong> Cole o código (clicando no botão 1 acima para copiar) e clique em <strong className="text-slate-900 dark:text-white">Commit changes</strong>. Assim que salvar, o link raw funcionará instantaneamente em qualquer computador!
              </li>
            </ol>
          </div>
        </div>
      )}

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
