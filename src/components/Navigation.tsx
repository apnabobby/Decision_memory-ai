import React from 'react';
import { 
  LayoutDashboard, 
  HelpCircle, 
  GitFork, 
  FileText, 
  Layers, 
  Clock, 
  Settings as SettingsIcon,
  Cpu
} from 'lucide-react';

export type TabType = 'dashboard' | 'ask' | 'graph' | 'evidence' | 'sources' | 'analysis' | 'history' | 'settings';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ask' as TabType, label: 'Ask WHY', icon: HelpCircle, highlight: true },
    { id: 'graph' as TabType, label: 'Decision Graph', icon: GitFork },
    { id: 'evidence' as TabType, label: 'Evidence', icon: FileText },
    { id: 'analysis' as TabType, label: 'Repo Analysis & ADRs', icon: Cpu },
    { id: 'sources' as TabType, label: 'Project Sources', icon: Layers },
    { id: 'history' as TabType, label: 'History', icon: Clock },
    { id: 'settings' as TabType, label: 'Settings & About', icon: SettingsIcon },
  ];


  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
