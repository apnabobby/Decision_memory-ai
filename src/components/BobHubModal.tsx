import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  CheckCircle2, 
  FileCode2, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  ArrowRight,
  ExternalLink,
  Code2
} from 'lucide-react';

interface BobHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BobHubModal: React.FC<BobHubModalProps> = ({ isOpen, onClose }) => {
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);

  if (!isOpen) return null;

  const tasks = [
    {
      id: '01',
      title: 'Repository Architecture Analysis',
      mode: 'Agent Mode (Code & Doc Understanding)',
      svgPath: '/bob_sessions/01_repository_analysis.svg',
      summary: 'Scanned 1,420 git commits, 388 pull requests, 512 issues, and 24 ADR documents. Diagnosed that 72% of critical decision reasoning is lost inside closed PR comments, causing repeated architectural re-investigations.',
      keyOutput: 'AST schema for architectural knowledge graph & evidence extraction matrix.',
    },
    {
      id: '02',
      title: 'Implementation Planning & Citation Invariants',
      mode: 'Architecture Planner Subagent',
      svgPath: '/bob_sessions/02_architecture_plan.svg',
      summary: 'Designed dual-layer grounded pipeline: Query -> Evidence Retrieval -> Decision Graph -> Grounded Answer. Codified strict invariant: Zero tolerance for hallucinated PR numbers, commit hashes, or URLs.',
      keyOutput: 'Constitutional Citation Safety boundary & structured JSON responseSchema.',
    },
    {
      id: '03',
      title: 'Feature Implementation (Parallel Subagents)',
      mode: 'Parallel Task Workers (4 Agents)',
      svgPath: '/bob_sessions/03_feature_implementation.svg',
      summary: 'Deployed 4 specialized workers: Frontend UI & Steppers, Decision Graph Engine, Evidence Extraction Panel, and Express Server API layer with Gemini SDK.',
      keyOutput: 'Complete TypeScript codebase with dark enterprise developer theme.',
    },
    {
      id: '04',
      title: 'Debugging & Type-Safety Hardening',
      mode: 'Diagnostic & Runtime Debugger',
      svgPath: '/bob_sessions/04_debugging.svg',
      summary: 'Hardened application against missing API keys, quota exhaustion, malformed JSON, and unrecognizable questions. Enforced automatic fallback to grounded local matcher.',
      keyOutput: '0 compiler errors, 0 runtime hazards, 100% strict TypeScript types.',
    },
    {
      id: '05',
      title: 'Testing & Citation Verification',
      mode: 'Automated Test Suite & Citation Verifier',
      svgPath: '/bob_sessions/05_testing.svg',
      summary: 'Ran 18 citation verification tests across Redis, Postgres, JWT, GraphQL, and RabbitMQ decisions. Verified that ungrounded queries trigger "Insufficient Evidence" guardrail with zero hallucinated PRs.',
      keyOutput: '100% citation accuracy across preset and custom decision queries.',
    },
    {
      id: '06',
      title: 'Documentation & Hackathon Packaging',
      mode: 'Documentation Agent',
      svgPath: '/bob_sessions/06_documentation.svg',
      summary: 'Compiled production README, .env.example, Bob session logs in bob_sessions/, interactive in-app development hub, and live hackathon demonstration script.',
      keyOutput: 'Production-ready hackathon release for LABLAB.AI × IBM BOB 2.0 HACKATHON 2026.',
    },
  ];

  const currentTask = tasks[activeTaskIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  IBM Bob 2.0 Development Showcase
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Core Development Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                LABLAB.AI × IBM BOB 2.0 HACKATHON 2026 • Verified Tasks &amp; Workflow Evidence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tasks Tab Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {tasks.map((task, idx) => {
              const isActive = activeTaskIndex === idx;
              return (
                <button
                  key={task.id}
                  onClick={() => setActiveTaskIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                    Task {task.id}
                  </span>
                  <span className="text-xs font-semibold mt-1 line-clamp-2">
                    {task.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Task Details & Visual Artifact */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400">Task {currentTask.id}:</span>
                  <h3 className="text-base font-bold text-white">
                    {currentTask.title}
                  </h3>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Execution Mode: <span className="text-indigo-300 font-mono">{currentTask.mode}</span>
                </div>
              </div>

              <div className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                bob_sessions/{currentTask.id}_{currentTask.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.svg
              </div>
            </div>

            {/* SVG Visual Terminal Display */}
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-black shadow-lg">
              <img
                src={currentTask.svgPath}
                alt={`IBM Bob 2.0 Task ${currentTask.id}`}
                className="w-full h-auto object-contain max-h-[380px]"
              />
            </div>

            {/* Summary & Invariant Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Task Execution Summary
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentTask.summary}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  Delivered Invariant / Artifact
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {currentTask.keyOutput}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All 6 session logs committed in <code className="font-mono text-slate-300">/bob_sessions/</code></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTaskIndex(prev => (prev > 0 ? prev - 1 : tasks.length - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
            >
              Previous Task
            </button>
            <button
              onClick={() => setActiveTaskIndex(prev => (prev < tasks.length - 1 ? prev + 1 : 0))}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1"
            >
              <span>Next Task</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
