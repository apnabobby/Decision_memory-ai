import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  AlertCircle, 
  FileCode2, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  Code2,
  FolderGit2,
  Database
} from 'lucide-react';
import { DEMO_PROJECT_STATS, RAW_EVIDENCE_REPOSITORY } from '../data/sampleDataset';

export const ProjectSourcesView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('Synced with local knowledge base');
  const [showRawJson, setShowRawJson] = useState(false);

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setSyncStatus('Indexing repository commits & pull requests...');
    setTimeout(() => {
      setSyncStatus('Extracting Architecture Decision Records (ADRs)...');
      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatus('Knowledge graph synchronized successfully (1,420 commits, 388 PRs)');
      }, 600);
    }, 600);
  };

  const sourcesList = [
    {
      id: 'git',
      title: 'Git Commit History',
      description: 'Commit messages, author metadata, diff summaries, and architectural cherry-picks.',
      status: 'Demo Data',
      count: '1,420 commits',
      branch: 'main',
      icon: GitCommit,
      iconColor: 'text-cyan-400',
    },
    {
      id: 'pr',
      title: 'Pull Requests & Code Reviews',
      description: 'Discussion threads, design trade-off debates, alternatives considered, review approvals.',
      status: 'Demo Data',
      count: '388 merged PRs',
      branch: 'main',
      icon: GitPullRequest,
      iconColor: 'text-violet-400',
    },
    {
      id: 'issues',
      title: 'Issues & Incident Tickets',
      description: 'Incident retrospectives, customer requirement tickets, SOC2 compliance audits.',
      status: 'Demo Data',
      count: '512 closed issues',
      branch: 'all milestones',
      icon: AlertCircle,
      iconColor: 'text-amber-400',
    },
    {
      id: 'adr',
      title: 'Architecture Decision Records (ADRs)',
      description: 'Formal markdown decision records under /docs/adr/ following MADR format.',
      status: 'Demo Data',
      count: '24 ADR documents',
      branch: 'main',
      icon: FileCode2,
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Project Sources
            </h1>
            <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {DEMO_PROJECT_STATS.status}
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Connected repositories and ingestion channels supplying verifiable architectural evidence.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Code2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{showRawJson ? 'Hide Raw JSON' : 'View Knowledge JSON'}</span>
          </button>

          <button
            onClick={handleSimulateSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-medium transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Re-index Knowledge'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-white">Target Repository:</span>
          <span className="font-mono text-blue-400">cloudscale-infra/core-api</span>
          <span className="text-slate-500 font-mono">(branch: {DEMO_PROJECT_STATS.branch})</span>
        </div>
        <span className="text-slate-400 font-mono hidden sm:inline">{syncStatus}</span>
      </div>

      {/* 4 Connected Source Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sourcesList.map((src) => {
          const Icon = src.icon;
          return (
            <div
              key={src.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${src.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {src.title}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">
                      {src.count}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {src.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {src.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <div className="flex items-center gap-1">
                  <GitBranch className="w-3 h-3" />
                  <span>{src.branch}</span>
                </div>
                <span className="text-emerald-400 flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active &amp; Grounded</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Raw JSON Knowledge Viewer Modal/Accordion */}
      {showRawJson && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              data/knowledge_base.json
            </span>
            <span className="text-[11px] text-slate-500">
              Raw Structured Knowledge
            </span>
          </div>
          <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-80">
            {JSON.stringify({ repository: DEMO_PROJECT_STATS, sampleSources: RAW_EVIDENCE_REPOSITORY.slice(0, 3) }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
