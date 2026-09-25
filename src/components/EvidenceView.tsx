import React, { useState } from 'react';
import { 
  FileText, 
  GitPullRequest, 
  GitCommit, 
  AlertCircle, 
  Search, 
  Filter, 
  User, 
  Calendar, 
  ExternalLink,
  Copy,
  Check,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { EvidenceSource, SourceType } from '../types/decision';
import { RAW_EVIDENCE_REPOSITORY } from '../data/sampleDataset';

interface EvidenceViewProps {
  onInspectEvidence: (evidence: EvidenceSource) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({ onInspectEvidence }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const filteredEvidence = RAW_EVIDENCE_REPOSITORY.filter((item) => {
    const matchesType = selectedType === 'all' || item.sourceType === selectedType;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query) ||
      item.reference.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.tags.some(t => t.toLowerCase().includes(query));
    return matchesType && matchesSearch;
  });

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'architecture_doc': return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'pull_request': return <GitPullRequest className="w-4 h-4 text-violet-400" />;
      case 'git_commit': return <GitCommit className="w-4 h-4 text-cyan-400" />;
      case 'issue': return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getSourceBadge = (type: SourceType) => {
    switch (type) {
      case 'architecture_doc': return { label: 'Architecture Doc', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'pull_request': return { label: 'Pull Request', bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20' };
      case 'git_commit': return { label: 'Git Commit', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'issue': return { label: 'Issue Ticket', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    }
  };

  const handleCopy = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Evidence Explorer
          </h1>
          <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {RAW_EVIDENCE_REPOSITORY.length} Primary Sources
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Inspect immutable primary evidence extracted from repository commits, merged pull requests, closed tickets, and architectural decision records.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter evidence by keyword, topic, author, or reference (e.g. Redis, ADR-004, Marcus)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Source Type Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Sources' },
            { id: 'architecture_doc', label: 'ADRs' },
            { id: 'pull_request', label: 'Pull Requests' },
            { id: 'git_commit', label: 'Commits' },
            { id: 'issue', label: 'Issues' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                selectedType === tab.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvidence.map((item) => {
          const badge = getSourceBadge(item.sourceType);
          return (
            <div
              key={item.id}
              className="rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between space-y-4 transition group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(item.sourceType)}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badge.bg}`}>
                      {item.reference}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {badge.label}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(item.reference)}
                    className="text-slate-500 hover:text-slate-300 p-1 rounded"
                    title="Copy Citation Reference"
                  >
                    {copiedRef === item.reference ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed line-clamp-3">
                  {item.excerpt}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onInspectEvidence(item)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                >
                  <span>Inspect Document</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvidence.length === 0 && (
        <div className="text-center py-12 rounded-xl bg-slate-900/40 border border-slate-800">
          <p className="text-sm text-slate-400">No primary evidence matches your current filter criteria.</p>
        </div>
      )}
    </div>
  );
};
