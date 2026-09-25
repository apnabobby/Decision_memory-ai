import React from 'react';
import { Sparkles, Terminal, ShieldCheck, Database, Cpu } from 'lucide-react';

interface HeaderProps {
  onOpenBobHub: () => void;
  onOpenDemoGuide: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBobHub,
  onOpenDemoGuide,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Decision Memory AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  DEMO MODE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                “Ask WHY. Get the Decision. See the Evidence.”
              </p>
            </div>
          </div>

          {/* Hackathon Badge & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hackathon Sponsor Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">LABLAB.AI × IBM BOB 2.0</span>
              <span className="text-slate-500">2026</span>
            </div>

            {/* IBM Bob Hub Button */}
            <button
              onClick={onOpenBobHub}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-indigo-200 border border-indigo-700/50 text-xs font-semibold transition shadow-sm"
              title="View IBM Bob 2.0 Development Sessions and Workflow Artifacts"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">IBM Bob 2.0 Hub</span>
            </button>

            {/* Demo Guide Button */}
            <button
              onClick={onOpenDemoGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Demo Script</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


