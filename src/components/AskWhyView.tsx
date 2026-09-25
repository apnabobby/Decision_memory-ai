import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  GitFork, 
  GitCommit, 
  GitPullRequest, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  User, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { DecisionAnswer, EvidenceSource, PresetDemoQuestion } from '../types/decision';
import { PRESET_QUESTIONS } from '../data/sampleDataset';

interface AskWhyViewProps {
  onAsk: (question: string, presetKey?: string) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
  answer: DecisionAnswer | null;
  error: string | null;
  onNavigateToGraph: (decisionId?: string) => void;
  onInspectEvidence: (evidence: EvidenceSource) => void;
}

export const AskWhyView: React.FC<AskWhyViewProps> = ({
  onAsk,
  isLoading,
  loadingStep,
  answer,
  error,
  onNavigateToGraph,
  onInspectEvidence,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [expandedExcerptId, setExpandedExcerptId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    onAsk(inputQuery.trim());
  };

  const handleSelectPreset = (preset: PresetDemoQuestion) => {
    setInputQuery(preset.question);
    onAsk(preset.question, preset.id);
  };

  const handleCopySummary = () => {
    if (!answer) return;
    const text = `Decision: ${answer.decision}\n\nWhy: ${answer.reason}\n\nSources: ${answer.sourcesChecked.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getSourceIcon = (type: EvidenceSource['sourceType']) => {
    switch (type) {
      case 'architecture_doc': return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'pull_request': return <GitPullRequest className="w-4 h-4 text-violet-400" />;
      case 'git_commit': return <GitCommit className="w-4 h-4 text-cyan-400" />;
      case 'issue': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSourceBadgeColor = (type: EvidenceSource['sourceType']) => {
    switch (type) {
      case 'architecture_doc': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pull_request': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'git_commit': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'issue': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="space-y-3 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ask WHY About a Decision
        </h1>
        <p className="text-sm text-slate-400">
          Query git history, pull requests, issues, and architecture docs to retrieve verified technical rationale.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about your project's decisions… (e.g., Why was Redis chosen?)"
            disabled={isLoading}
            className="w-full pl-12 pr-32 py-4 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 text-sm sm:text-base transition outline-none shadow-lg shadow-black/20"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="absolute right-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-md"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>ASK WHY</span>
            )}
          </button>
        </div>

        {/* Demo Preset Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Demo Questions:</span>
          {PRESET_QUESTIONS.map((preset) => (
            <button
              type="button"
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 hover:text-blue-300 text-slate-300 border border-slate-700/60 transition"
            >
              {preset.question}
            </button>
          ))}
        </div>
      </form>

      {/* Live Loading Stepper */}
      {isLoading && (
        <div className="rounded-xl bg-slate-900/90 border border-blue-500/30 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold text-blue-400">
              {loadingStep || 'Searching project knowledge...'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {[
              'Searching project knowledge...',
              'Analyzing evidence...',
              'Connecting decisions...',
              'Preparing cited answer...',
            ].map((step, idx) => {
              const isCurrent = loadingStep === step;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg text-xs font-mono border transition ${
                    isCurrent
                      ? 'bg-blue-500/10 text-blue-300 border-blue-500/40 animate-pulse'
                      : 'bg-slate-800/40 text-slate-400 border-slate-800'
                  }`}
                >
                  <div className="text-[10px] text-slate-400">Step 0{idx + 1}</div>
                  <div className="truncate mt-0.5">{step.replace(/\.\.\./, '')}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">Unable to retrieve project evidence right now</p>
            <p className="mt-1 text-xs text-rose-300/80">{error}</p>
          </div>
        </div>
      )}

      {/* ANSWER PRESENTATION */}
      {answer && !isLoading && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Grounded Decision Record
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Confidence: {answer.confidence.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToGraph(answer.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 text-xs font-medium transition"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>View Decision Graph</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedLink ? 'Copied' : 'Copy Summary'}</span>
              </button>
            </div>
          </div>

          {/* Insufficient Evidence Warning (Section 12 Safety Guardrail) */}
          {answer.isInsufficientEvidence && (
            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <span>Citation Safety: Insufficient Evidence</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                “Insufficient evidence to determine the original reasoning.”
              </p>
              <p className="text-xs text-slate-400">
                Decision Memory AI refuses to hallucinate PR numbers, commit hashes, or decisions not explicitly documented in connected sources.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Sources Checked:
                </span>
                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                  {answer.sourcesChecked.map((src, idx) => (
                    <li key={idx}>{src}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!answer.isInsufficientEvidence && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Decision, Why, Alternatives, Rejected, Timeline */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. DECISION */}
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      1. Decision
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Primary Architectural Outcome
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {answer.decision}
                  </h2>
                </div>

                {/* 2. WHY */}
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      2. Why (Grounded Reasoning)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Evidence-Backed Rationale
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    {answer.reason}
                  </p>
                </div>

                {/* 3. ALTERNATIVES CONSIDERED & 4. REJECTED OPTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Alternatives */}
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-400 block">
                      3. Alternatives Considered
                    </span>
                    <div className="space-y-1.5">
                      {answer.alternatives.map((alt, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                          <span>{alt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rejected Options */}
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                      4. Rejected Options &amp; Why
                    </span>
                    <div className="space-y-3">
                      {answer.rejectedOptions.map((rej, idx) => (
                        <div key={idx} className="text-xs space-y-1 border-l-2 border-rose-500/40 pl-2.5">
                          <div className="font-semibold text-rose-300">{rej.option}</div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            {rej.reason}
                          </p>
                          {rej.evidenceRef && (
                            <span className="inline-block text-[10px] font-mono text-slate-500">
                              Ref: {rej.evidenceRef}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. CONTEXT */}
                {answer.context && (
                  <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                      5. Context &amp; Background
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {answer.context}
                    </p>
                  </div>
                )}

                {/* 6. TIMELINE */}
                {answer.timeline && answer.timeline.length > 0 && (
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                      6. Decision Evolution Timeline
                    </span>
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                      {answer.timeline.map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-slate-900"></div>
                          <div className="flex flex-wrap items-baseline justify-between gap-1">
                            <span className="text-xs font-semibold text-cyan-300">
                              {item.step}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {item.date} {item.actor ? `• ${item.actor}` : ''}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">
                            {item.description}
                          </p>
                          {item.sourceRef && (
                            <span className="inline-block mt-1 text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                              {item.sourceRef}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Col: 7. SUPPORTING EVIDENCE CARDS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      7. Supporting Evidence ({answer.evidence.length})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Primary Sources
                  </span>
                </div>

                <div className="space-y-3">
                  {answer.evidence.map((ev) => {
                    const isExpanded = expandedExcerptId === ev.id;
                    return (
                      <div
                        key={ev.id}
                        className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-2.5 hover:border-slate-700 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {getSourceIcon(ev.sourceType)}
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getSourceBadgeColor(ev.sourceType)}`}>
                              {ev.reference}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {ev.date}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-2">
                          {ev.title}
                        </h4>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{ev.author}</span>
                          {ev.authorRole && (
                            <span className="text-slate-400">• {ev.authorRole}</span>
                          )}
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed">
                          <p className={isExpanded ? '' : 'line-clamp-3'}>
                            {ev.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <button
                            type="button"
                            onClick={() => setExpandedExcerptId(isExpanded ? null : ev.id)}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium text-[11px]"
                          >
                            <span>{isExpanded ? 'Collapse' : 'Read Full Excerpt'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => onInspectEvidence(ev)}
                            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium text-[11px]"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Separation Notice (Section 2 & 12 requirement) */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-slate-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Citation Transparency Guarantee</span>
                  </div>
                  <p>
                    All references (PRs, commits, issues, ADRs) are validated against existing repository records. The engine is constitutionally barred from hallucinating non-existent PRs or tickets.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
