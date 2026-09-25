import React from 'react';
import { Clock, Download, Trash2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { DecisionAnswer } from '../types/decision';

interface HistoryViewProps {
  history: DecisionAnswer[];
  onSelectHistoryItem: (item: DecisionAnswer) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  const handleExportMarkdown = () => {
    if (history.length === 0) return;
    const content = history.map(h => `## Question: ${h.question}
**Decision**: ${h.decision}
**Why**: ${h.reason}
**Sources Checked**: ${h.sourcesChecked.join(', ')}
**Timestamp**: ${h.generatedAt}
---
`).join('\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-memory-history-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
  };

  const handleExportJson = () => {
    if (history.length === 0) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-memory-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Decision Query History
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Audit log of architectural investigations conducted during this session.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Markdown</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="text-center py-16 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Clock className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No Query History Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ask questions on the "Ask WHY" page or test preset demo decisions to build your session memory trace.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectHistoryItem(item)}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 cursor-pointer transition flex items-start justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-400 font-mono">
                    Query #{history.length - idx}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(item.generatedAt).toLocaleTimeString()}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                    item.isInsufficientEvidence 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {item.isInsufficientEvidence ? 'Insufficient Evidence' : `Confidence: ${item.confidence}`}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                  {item.question}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.decision}
                </p>

                <div className="text-[11px] text-slate-500 font-mono pt-1">
                  Sources: {item.sourcesChecked.join(', ')}
                </div>
              </div>

              <div className="self-center p-2 rounded-lg bg-slate-800/60 text-slate-400 group-hover:text-white group-hover:bg-blue-600 transition">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
