import React, { useState } from 'react';
import { X, ExternalLink, Calendar, User, Tag, ShieldCheck, Copy, Check, Download, FileText } from 'lucide-react';
import { EvidenceSource } from '../types/decision';

interface EvidenceModalProps {
  evidence: EvidenceSource | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ evidence, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!evidence) return null;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(evidence.fullContent || evidence.excerpt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportEvidence = (format: 'md' | 'txt' = 'md') => {
    const formattedContent = [
      `# Evidence: [${evidence.reference}] ${evidence.title}`,
      '',
      `- **Reference**: ${evidence.reference}`,
      `- **Source Type**: ${evidence.sourceType.replace(/_/g, ' ')}`,
      `- **Author**: ${evidence.author}${evidence.authorRole ? ` (${evidence.authorRole})` : ''}`,
      `- **Date**: ${evidence.date}`,
      `- **Tags**: ${evidence.tags.map(t => `#${t}`).join(', ')}`,
      evidence.url ? `- **URL/Link**: ${evidence.url}` : null,
      '',
      '---',
      '',
      '## Primary Cited Excerpt',
      '',
      `> ${evidence.excerpt}`,
      '',
      '---',
      '',
      '## Full Repository Content',
      '',
      evidence.fullContent || evidence.excerpt,
      '',
      '---',
      `*Exported from Decision Memory AI — LABLAB.AI × IBM BOB 2.0 HACKATHON 2026*`,
      `*Generated at: ${new Date().toISOString()}*`,
    ].filter(Boolean).join('\n');

    const mimeType = format === 'md' ? 'text/markdown;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const blob = new Blob([formattedContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const sanitizedRef = evidence.reference.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    a.href = url;
    a.download = `evidence-${sanitizedRef}-${evidence.date}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              {evidence.reference}
            </span>
            <span className="text-xs text-slate-400 capitalize">
              {evidence.sourceType.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportEvidence('md')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-500/30 text-xs font-semibold transition"
              title="Download formatted Markdown file"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Evidence (.md)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {evidence.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{evidence.author}</span>
                {evidence.authorRole && (
                  <span className="text-slate-500">({evidence.authorRole})</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{evidence.date}</span>
              </div>
            </div>
          </div>

          {/* Excerpt Highlight */}
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200 font-mono leading-relaxed">
            <span className="font-bold text-blue-400 block mb-1 uppercase tracking-wider text-[10px]">
              Primary Cited Excerpt:
            </span>
            {evidence.excerpt}
          </div>

          {/* Full Markdown Document Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full Repository Content
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportEvidence('txt')}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60 transition"
                  title="Download as plain text file"
                >
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>Text</span>
                </button>
                <button
                  onClick={handleCopyContent}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72">
              {evidence.fullContent || evidence.excerpt}
            </pre>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {evidence.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verifiable source record in repository history</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportEvidence('md')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Evidence (.md)</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
