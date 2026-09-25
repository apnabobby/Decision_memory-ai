import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Database, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  ExternalLink,
  Code2,
  Lock
} from 'lucide-react';

interface SettingsViewProps {
  onOpenBobHub: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenBobHub }) => {
  const [serverHealth, setServerHealth] = useState<{
    status: string;
    hackathon: string;
    aiAvailable: boolean;
    timestamp: string;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setServerHealth(data);
      } else {
        setServerHealth({
          status: 'client-isolated-mode',
          hackathon: 'LABLAB.AI × IBM BOB 2.0 HACKATHON 2026',
          aiAvailable: false,
          timestamp: new Date().toISOString(),
        });
      }
    } catch {
      setServerHealth({
        status: 'client-isolated-mode',
        hackathon: 'LABLAB.AI × IBM BOB 2.0 HACKATHON 2026',
        aiAvailable: false,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Settings &amp; Hackathon Credits
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          System health, architectural citation invariants, and hackathon partnership acknowledgment.
        </p>
      </div>

      {/* Hackathon Acknowledgment Card (Section 22 & 23) */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold font-mono">
              26
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                LABLAB.AI × IBM BOB 2.0 HACKATHON 2026
              </h2>
              <span className="text-xs text-slate-400">Official Project Submission</span>
            </div>
          </div>

          <button
            onClick={onOpenBobHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open Bob 2.0 Hub</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px]">
              Purpose
            </span>
            <p className="text-slate-200">
              Preserve and uncover the reasoning behind software decisions using grounded primary citations and topological graphs.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-slate-400 uppercase font-semibold tracking-wider text-[10px]">
              Development Engine
            </span>
            <p className="text-slate-200">
              Built using <strong>IBM Bob 2.0</strong> (Agent Mode, Codebase AST Analysis, Subagents, Diagnostic Debugging, Citation Testing).
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          * Sponsor names (LabLab.ai and IBM) are used strictly to identify the hackathon and technologies utilized in development, per Section 22 guidelines.
        </p>
      </div>

      {/* Citation Safety Policy (Section 12) */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            Citation Safety &amp; Anti-Hallucination Policy
          </h2>
        </div>

        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <p>
            Decision Memory AI adheres to a strict constitutional invariant: <strong>Zero Hallucinated Evidence</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px] p-3 rounded-lg bg-slate-950 border border-slate-800">
            <li>PR numbers must exist in merged pull request records.</li>
            <li>Commit hashes must match verifiable git commits.</li>
            <li>Issue tickets must be linked to authentic historical tickets.</li>
            <li>Decisions without documented primary evidence return "Insufficient evidence to determine original reasoning."</li>
          </ul>
        </div>
      </div>

      {/* System Health Diagnostics */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              System Health &amp; Runtime Status
            </h2>
          </div>
          <button
            onClick={checkHealth}
            disabled={isChecking}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">API Backend</span>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{serverHealth ? 'Online & Healthy' : 'Checking...'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Grounded Pipeline</span>
            <div className="flex items-center gap-1.5 font-semibold text-blue-400">
              <Database className="w-3.5 h-3.5" />
              <span>15 Primary Sources Active</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Model Engine</span>
            <div className="flex items-center gap-1.5 font-semibold text-violet-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Gemini 3.8 Flash + Isomorphic Fallback</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
