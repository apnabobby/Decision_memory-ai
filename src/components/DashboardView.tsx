import React from 'react';
import { 
  GitCommit, 
  GitPullRequest, 
  AlertCircle, 
  FileCode2, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Share2, 
  Database,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { PRESET_QUESTIONS, DEMO_PROJECT_STATS } from '../data/sampleDataset';
import { PresetDemoQuestion } from '../types/decision';

interface DashboardViewProps {
  onSelectPreset: (preset: PresetDemoQuestion) => void;
  onNavigateToAsk: () => void;
  onNavigateToGraph: (decisionId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectPreset,
  onNavigateToAsk,
  onNavigateToGraph,
}) => {
  return (
    <div className="space-y-8 py-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Developer Knowledge &amp; Institutional Memory Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Decision Memory AI
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            “Understand not just what your code does — understand why it was built that way.”
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToAsk}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition"
            >
              <Search className="w-4 h-4" />
              <span>Ask WHY About a Decision</span>
            </button>
            <button
              onClick={() => onNavigateToGraph()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>Explore Decision Graph</span>
            </button>
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none hidden md:block"></div>
      </div>

      {/* Four Core Metric Cards (Section 9 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Decisions Discovered */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Decisions Discovered
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">5</span>
            <span className="text-xs text-slate-400">cataloged major decisions</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Verified across ADRs, PR reviews &amp; commits
          </p>
        </div>

        {/* Card 2: Evidence Sources */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Evidence Sources
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">15</span>
            <span className="text-xs text-slate-400">primary source items</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            4 ADRs, 4 PRs, 4 Commits, 3 Issue reports
          </p>
        </div>

        {/* Card 3: Open Questions */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Open Questions
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">0</span>
            <span className="text-xs text-emerald-400 font-medium">all rationale grounded</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            No contradictory decision records detected
          </p>
        </div>

        {/* Card 4: Project Sources */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Project Sources
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">4</span>
            <span className="text-xs text-slate-400">connected channels</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Git logs, Pull Requests, Issues, Architecture docs
          </p>
        </div>
      </div>

      {/* Preset Questions for Judges & Developers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Ready-to-Test Decisions</span>
              <span className="text-xs font-normal text-slate-400">(Click any card to inspect grounded evidence)</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">cloudscale-infra/core-api</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_QUESTIONS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="group p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-medium">
                    {preset.topic}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">
                    {preset.keyTech}
                  </span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-blue-300 transition text-sm">
                  {preset.question}
                </h3>
                <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                  {preset.previewSummary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-blue-400 font-medium">
                <span>View Decision &amp; Evidence</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Architectural Evolution Timeline */}
      <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Repository Decision Timeline</span>
          </h2>
          <span className="text-xs text-slate-400">Chronological Evolution</span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-slate-900"></div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-blue-400">October 2025</span>
              <span className="text-xs text-slate-500 font-mono">ADR-011</span>
            </div>
            <h4 className="text-sm font-medium text-slate-200 mt-1">
              Adopted GraphQL Federation Gateway for Web/Mobile Dashboards
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Consolidated 12 sequential REST roundtrips into 1 HTTP POST, reducing client payload by 68%.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-violet-500 ring-4 ring-slate-900"></div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-violet-400">September 2025</span>
              <span className="text-xs text-slate-500 font-mono">ADR-007</span>
            </div>
            <h4 className="text-sm font-medium text-slate-200 mt-1">
              Rejected Stateless JWT in Favor of Redis-Backed Opaque Session Tokens
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Enterprise security audit required instant token kill-switch upon password reset or logout.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-slate-900"></div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-amber-400">July 2025</span>
              <span className="text-xs text-slate-500 font-mono">ADR-009</span>
            </div>
            <h4 className="text-sm font-medium text-slate-200 mt-1">
              Selected RabbitMQ Over Apache Kafka for Asynchronous Tasks
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Required per-message acknowledgments and Dead-Letter Exchanges (DLX) for webhook retries.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-slate-900"></div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-emerald-400">June 2025</span>
              <span className="text-xs text-slate-500 font-mono">ADR-004</span>
            </div>
            <h4 className="text-sm font-medium text-slate-200 mt-1">
              Adopted Redis Cluster for Distributed Caching
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Achieved 1.8ms p99 latency under 25k req/sec; Memcached rejected due to lack of persistence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
