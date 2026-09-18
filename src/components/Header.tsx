import React from 'react';
import { ShieldCheck, Sparkles, Terminal, Laptop, Github } from 'lucide-react';

interface HeaderProps {
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const scrollToGitHub = () => {
    const el = document.getElementById('github-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold">
            {/* Windows 11 4-square icon */}
            <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
              <div className="bg-white rounded-[1.5px]"></div>
              <div className="bg-white rounded-[1.5px]"></div>
              <div className="bg-white rounded-[1.5px]"></div>
              <div className="bg-white rounded-[1.5px]"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Winget Auto-Updater
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                  Windows 11
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              1-Clique • 100% Silencioso • Sem telas de contrato
            </p>
          </div>
        </div>

        {/* Status badges & GitHub Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={scrollToGitHub}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-xs transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Via GitHub</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 px-3 py-1.5 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Interrupções</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full">
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-mono text-[11px]">winget upgrade --all</span>
          </div>
        </div>
      </div>
    </header>
  );
};
