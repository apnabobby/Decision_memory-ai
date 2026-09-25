import React from 'react';
import { X, PlayCircle, CheckCircle2, Terminal, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface DemoScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunDemoStep: (stepNumber: number) => void;
}

export const DemoScriptModal: React.FC<DemoScriptModalProps> = ({
  isOpen,
  onClose,
  onRunDemoStep,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      speaker: 'Presenter',
      text: '“Developers can easily understand WHAT existing code does, but the reasoning behind WHY a technical decision was made is scattered across Git history, PR discussions, tickets, and docs.”',
      action: 'Show Dashboard metrics and problem statement.',
    },
    {
      num: 2,
      speaker: 'Presenter',
      text: '“Let’s ask Decision Memory AI: ‘Why was Redis chosen?’”',
      action: 'Click "Ask Redis" demo preset.',
      executableStep: 2,
    },
    {
      num: 3,
      speaker: 'Presenter',
      text: '“Notice the separation: Here is the Decision, the grounded Why, alternatives evaluated (Memcached), and specifically why Memcached was rejected (lack of persistence and pub/sub cache invalidation).”',
      action: 'Point to Grounded Answer cards.',
    },
    {
      num: 4,
      speaker: 'Presenter',
      text: '“Every fact is cited with exact primary sources: ADR-004, PR #217, Commit c7b8a1f, and Issue #142. Zero hallucinations.”',
      action: 'Inspect Supporting Evidence cards.',
    },
    {
      num: 5,
      speaker: 'Presenter',
      text: '“Now let’s open the Decision Graph. It visually links the decision, reasons, rejected options, and underlying commits and authors in one topological view.”',
      action: 'Switch to Decision Graph view.',
      executableStep: 5,
    },
    {
      num: 6,
      speaker: 'Presenter',
      text: '“We built Decision Memory AI using IBM Bob 2.0 as our core development workflow: repository analysis, architectural planning, parallel feature implementation, debugging, testing, and documentation.”',
      action: 'Open IBM Bob 2.0 Hub.',
      executableStep: 6,
    },
    {
      num: 7,
      speaker: 'Presenter',
      text: '“Decision Memory AI turns scattered engineering history into searchable, evidence-backed institutional memory.”',
      action: 'Conclude presentation.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Hackathon Judge Demo Script
              </h2>
              <p className="text-xs text-slate-400">
                LABLAB.AI × IBM BOB 2.0 HACKATHON 2026 (2-Minute Demo)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-mono text-xs flex items-center justify-center font-bold">
                    {step.num}
                  </span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {step.speaker}
                  </span>
                </div>

                {step.executableStep && (
                  <button
                    onClick={() => {
                      onRunDemoStep(step.executableStep!);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition font-medium"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Run Step</span>
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                {step.text}
              </p>

              <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono pt-1 border-t border-slate-900">
                <ArrowRight className="w-3 h-3 text-blue-400" />
                <span>Action: {step.action}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Structured for optimal hackathon score &amp; live demo clarity</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
