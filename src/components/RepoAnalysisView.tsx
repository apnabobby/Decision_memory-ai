import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  FileCode2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Edit3, 
  ExternalLink, 
  RefreshCw, 
  Database,
  ArrowRight,
  FolderGit2,
  Cpu,
  Github,
  Save,
  Check,
  Zap,
  TrendingUp,
  Download,
  Search,
  Star,
  AlertCircle,
  HelpCircle,
  Eye,
  FileText
} from 'lucide-react';
import { GitHubRepo, ADRDocument, RepoAnalysisReport, GitHubUser } from '../types/decision';

interface RepoAnalysisViewProps {
  currentRepoName: string;
  onSelectRepo: (repoFullName: string) => void;
  currentUser: GitHubUser | null;
  onOpenConnectModal: () => void;
  onAskQuestion?: (question: string) => void;
}

export const RepoAnalysisView: React.FC<RepoAnalysisViewProps> = ({
  currentRepoName,
  onSelectRepo,
  currentUser,
  onOpenConnectModal,
  onAskQuestion,
}) => {
  const [repoList, setRepoList] = useState<GitHubRepo[]>([]);
  const [repoSearchInput, setRepoSearchInput] = useState('');
  const [repoData, setRepoData] = useState<{
    repository: any;
    commits: any[];
    pullRequests: any[];
    issues: any[];
    adrs: ADRDocument[];
    rateLimit?: { remaining: number; limit: number };
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<RepoAnalysisReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ADR Editor Modal / Drawer state
  const [isEditingAdr, setIsEditingAdr] = useState(false);
  const [adrForm, setAdrForm] = useState<Partial<ADRDocument>>({
    number: '015',
    title: '',
    status: 'Accepted',
    deciders: '',
    context: '',
    decision: '',
    consequences: '',
    alternativesConsidered: [],
    rejectedOptions: [],
  });
  const [altInput, setAltInput] = useState('');
  const [rejOptionInput, setRejOptionInput] = useState('');
  const [rejReasonInput, setRejReasonInput] = useState('');
  const [commitToGitHub, setCommitToGitHub] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [previewMarkdown, setPreviewMarkdown] = useState(false);

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'adrs' | 'analysis'>('overview');

  // Load available repositories
  useEffect(() => {
    fetch('/api/github/repos')
      .then(res => res.json())
      .then(data => {
        if (data.repos) setRepoList(data.repos);
      })
      .catch(() => {});
  }, [currentUser]);

  // Load current repository data
  const loadRepoData = (fullName: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    const token = localStorage.getItem('github_token') || undefined;

    fetch('/api/github/fetch-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoFullName: fullName, token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setRepoData(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Failed to load repository data');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentRepoName) {
      loadRepoData(currentRepoName);
      setAnalysisReport(null);
    }
  }, [currentRepoName]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoSearchInput.trim()) return;
    const cleanRepo = repoSearchInput.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '');
    onSelectRepo(cleanRepo);
    setRepoSearchInput('');
  };

  // Run Decision Memory Analysis
  const handleRunAnalysis = async () => {
    if (!repoData) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/github/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoFullName: currentRepoName,
          commits: repoData.commits,
          pullRequests: repoData.pullRequests,
          adrs: repoData.adrs,
        }),
      });

      const report = await res.json();
      setAnalysisReport(report);
      setActiveSubTab('analysis');
    } catch (err: any) {
      setErrorMessage(`Analysis error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Save ADR
  const handleSaveAdr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adrForm.title || !adrForm.decision) return;

    const token = localStorage.getItem('github_token') || undefined;

    try {
      const res = await fetch('/api/github/save-adr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoFullName: currentRepoName,
          adr: {
            ...adrForm,
            id: `ADR-${adrForm.number}`,
          },
          commitToGitHub,
          token,
        }),
      });

      const data = await res.json();
      setSaveSuccessMessage(data.message || 'ADR saved successfully!');
      setTimeout(() => setSaveSuccessMessage(null), 3500);
      setIsEditingAdr(false);
      loadRepoData(currentRepoName);
    } catch (err: any) {
      alert(`Failed to save ADR: ${err.message}`);
    }
  };

  const handleExportAdrFile = (adr: ADRDocument) => {
    const content = `# ${adr.id}: ${adr.title}

Date: ${adr.date}
Status: ${adr.status}
Deciders: ${adr.deciders}

## Context
${adr.context}

## Decision
${adr.decision}

## Consequences
${adr.consequences}

## Alternatives Considered
${adr.alternativesConsidered?.map(a => `- ${a}`).join('\n') || '- None documented'}

## Rejected Options
${adr.rejectedOptions?.map(r => `- **${r.option}**: ${r.reason}`).join('\n') || '- None documented'}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${adr.id.toLowerCase()}-${adr.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddAlternative = () => {
    if (!altInput.trim()) return;
    setAdrForm(prev => ({
      ...prev,
      alternativesConsidered: [...(prev.alternativesConsidered || []), altInput.trim()],
    }));
    setAltInput('');
  };

  const handleAddRejectedOption = () => {
    if (!rejOptionInput.trim()) return;
    setAdrForm(prev => ({
      ...prev,
      rejectedOptions: [
        ...(prev.rejectedOptions || []),
        { option: rejOptionInput.trim(), reason: rejReasonInput.trim() || 'No explicit reason given' },
      ],
    }));
    setRejOptionInput('');
    setRejReasonInput('');
  };

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto">
      {/* Top Bar: Direct Repo Search & Switcher */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Target Repository:</span>
                <select
                  value={currentRepoName}
                  onChange={(e) => onSelectRepo(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {repoList.map(r => (
                    <option key={r.id} value={r.full_name}>
                      {r.full_name} {r.name === 'core-api' ? '(Demo)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Inspect live commits, pull request discussions, issues, and Architecture Decision Records (ADRs).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                <img src={currentUser.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                <span className="text-xs text-slate-300 font-mono">@{currentUser.login}</span>
                <button
                  onClick={onOpenConnectModal}
                  className="text-xs text-blue-400 hover:underline ml-1"
                >
                  Switch
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenConnectModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Connect GitHub</span>
              </button>
            )}

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || isLoading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-semibold transition shadow-sm"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Cpu className="w-3.5 h-3.5" />
              )}
              <span>{isAnalyzing ? 'Analyzing...' : 'Run Decision Analysis'}</span>
            </button>
          </div>
        </div>

        {/* Enter Any Public or Private Repo */}
        <form onSubmit={handleSearchSubmit} className="pt-2 border-t border-slate-800 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={repoSearchInput}
              onChange={(e) => setRepoSearchInput(e.target.value)}
              placeholder="Or enter any GitHub repo (e.g. facebook/react, expressjs/express, owner/repo)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={!repoSearchInput.trim() || isLoading}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/40 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            Inspect Repo
          </button>
        </form>
      </div>

      {/* Repository Stats Strip */}
      {repoData && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Branch</span>
            <div className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-blue-400" />
              <span>{repoData.repository.branch || 'main'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Commits Parsed</span>
            <div className="text-xs font-mono font-semibold text-cyan-400 flex items-center gap-1">
              <GitCommit className="w-3 h-3" />
              <span>{repoData.commits?.length || 0}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">PRs Ingested</span>
            <div className="text-xs font-mono font-semibold text-violet-400 flex items-center gap-1">
              <GitPullRequest className="w-3 h-3" />
              <span>{repoData.pullRequests?.length || 0}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">ADRs Documented</span>
            <div className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
              <FileCode2 className="w-3 h-3" />
              <span>{repoData.adrs?.length || 0}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">GitHub API Quota</span>
            <div className="text-xs font-mono font-semibold text-slate-300">
              {repoData.rateLimit ? `${repoData.rateLimit.remaining} / ${repoData.rateLimit.limit}` : 'Available'}
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition relative ${
              activeSubTab === 'overview'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Repository Commits, PRs &amp; Issues
          </button>

          <button
            onClick={() => setActiveSubTab('adrs')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition relative flex items-center gap-1.5 ${
              activeSubTab === 'adrs'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Architecture Records (ADRs)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {repoData?.adrs?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('analysis')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition relative flex items-center gap-1.5 ${
              activeSubTab === 'analysis'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Decision Memory Analysis</span>
            {analysisReport && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                {analysisReport.documentationHealthScore}%
              </span>
            )}
          </button>
        </div>

        <button
          onClick={() => {
            setAdrForm({
              number: String((repoData?.adrs?.length || 0) + 1).padStart(3, '0'),
              title: '',
              status: 'Accepted',
              deciders: currentUser?.login || 'Engineering Team',
              context: '',
              decision: '',
              consequences: '',
              alternativesConsidered: [],
              rejectedOptions: [],
            });
            setIsEditingAdr(true);
          }}
          className="flex items-center gap-1 px-3 py-1 mb-2 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New ADR</span>
        </button>
      </div>

      {/* Sub-Tab 1: Overview (Commits, PRs, and Issues) */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Commits Stream */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Recent Git Commits</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {repoData?.commits?.length || 0}
              </span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {(repoData?.commits || []).map((c, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-semibold">{c.sha}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{c.date}</span>
                  </div>
                  <p className="text-slate-200 font-medium line-clamp-2">{c.message}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">by {c.author}</span>
                    {c.htmlUrl && (
                      <a
                        href={c.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-blue-400"
                        title="View Commit on GitHub"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pull Requests Stream */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Pull Requests</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {repoData?.pullRequests?.length || 0}
              </span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {(repoData?.pullRequests || []).map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-violet-400 font-semibold">PR #{p.number}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {p.state}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium line-clamp-2">{p.title}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">@{p.author} • {p.date}</span>
                    {p.htmlUrl && (
                      <a
                        href={p.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-blue-400"
                        title="View PR on GitHub"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues Stream */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Tickets &amp; Issues</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {repoData?.issues?.length || 0}
              </span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {(repoData?.issues || []).map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-400 font-semibold">Issue #{issue.number}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {issue.state}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium line-clamp-2">{issue.title}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">@{issue.author} • {issue.date}</span>
                    {issue.htmlUrl && (
                      <a
                        href={issue.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-blue-400"
                        title="View Issue on GitHub"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Architecture Decision Records (ADRs) */}
      {activeSubTab === 'adrs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(repoData?.adrs || []).map((adr) => (
              <div
                key={adr.id}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 space-y-3 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {adr.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {adr.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {adr.title}
                  </h4>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1.5 font-mono">
                    <div className="text-slate-300">
                      <strong className="text-blue-400">Decision: </strong>
                      {adr.decision}
                    </div>
                    {adr.consequences && (
                      <div className="text-slate-400 text-[11px]">
                        <strong className="text-slate-400">Consequences: </strong>
                        {adr.consequences}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-mono truncate max-w-[180px]">
                    By: {adr.deciders}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExportAdrFile(adr)}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                      title="Download Markdown File (.md)"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setAdrForm(adr);
                        setIsEditingAdr(true);
                      }}
                      className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(repoData?.adrs || []).length === 0 && (
            <div className="text-center py-12 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
              <FileCode2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-semibold">No ADRs Found in this Repository</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click "New ADR" above to document your first Architecture Decision Record in standard MADR format.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Decision Memory Analysis Report */}
      {activeSubTab === 'analysis' && (
        <div className="space-y-6">
          {analysisReport ? (
            <div className="space-y-6">
              {/* Health Score Overview Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                    Repository Decision Health Audit
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {analysisReport.repoName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Scanned {analysisReport.commitsAnalyzed} commits, {analysisReport.prsAnalyzed} PRs, and {analysisReport.adrsFound} ADRs.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center font-bold text-xl text-emerald-400 font-mono">
                    {analysisReport.documentationHealthScore}%
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      Documentation Clarity
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {analysisReport.documentationHealthScore > 80 ? 'Low Amnesia Risk' : 'High Knowledge Loss Risk'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Identified Decisions */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Identified Architectural Decisions ({analysisReport.keyDecisions.length})</span>
                </h4>

                <div className="space-y-3">
                  {analysisReport.keyDecisions.map((dec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">{dec.title}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {dec.source}
                        </span>
                      </div>
                      <p className="text-slate-300"><strong className="text-emerald-400">Decision: </strong>{dec.decision}</p>
                      <p className="text-slate-400 text-[11px]"><strong className="text-slate-400">Why: </strong>{dec.why}</p>

                      {onAskQuestion && (
                        <div className="pt-2 border-t border-slate-900 flex justify-end">
                          <button
                            onClick={() => onAskQuestion(`Why was ${dec.title} chosen in ${currentRepoName}?`)}
                            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Ask WHY about this decision</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Undocumented Changes / Amnesia Hazards */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Undocumented Architectural Shifts (Potential Knowledge Loss)</span>
                </h4>

                <div className="space-y-3">
                  {analysisReport.undocumentedChanges.map((u, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-slate-950 border border-amber-500/20 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {u.type}
                        </span>
                        <button
                          onClick={() => {
                            setAdrForm({
                              number: String((repoData?.adrs?.length || 0) + 1).padStart(3, '0'),
                              title: `Architecture: ${u.summary}`,
                              status: 'Proposed',
                              deciders: currentUser?.login || 'Engineering Team',
                              context: u.summary,
                              decision: 'Document reason for this change',
                              consequences: '',
                              alternativesConsidered: [],
                              rejectedOptions: [],
                            });
                            setIsEditingAdr(true);
                          }}
                          className="flex items-center gap-1 text-[10px] text-emerald-400 hover:underline"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Create ADR to document this</span>
                        </button>
                      </div>

                      <span className="font-semibold text-slate-200 block">{u.summary}</span>
                      <div className="text-blue-400 text-[11px] flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        <span>Suggested Action: {u.suggestedAction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-300">No Analysis Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Run Decision Analysis to scan recent commits, PRs, and ADRs for architectural trade-offs and knowledge documentation gaps.
              </p>
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                Run Analysis Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* ADR CREATE & EDIT MODAL */}
      {isEditingAdr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {adrForm.id ? `Edit ${adrForm.id}` : `Create New ADR-${adrForm.number}`}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMarkdown(!previewMarkdown)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{previewMarkdown ? 'Edit Mode' : 'Preview MD'}</span>
                </button>
                <button
                  onClick={() => setIsEditingAdr(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {previewMarkdown ? (
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {`# ADR-${adrForm.number}: ${adrForm.title || 'Untitled'}

Date: ${adrForm.date || new Date().toISOString().slice(0, 10)}
Status: ${adrForm.status}
Deciders: ${adrForm.deciders}

## Context
${adrForm.context || 'None provided'}

## Decision
${adrForm.decision || 'None provided'}

## Consequences
${adrForm.consequences || 'None provided'}

## Alternatives Considered
${adrForm.alternativesConsidered?.map(a => `- ${a}`).join('\n') || '- None documented'}

## Rejected Options
${adrForm.rejectedOptions?.map(r => `- **${r.option}**: ${r.reason}`).join('\n') || '- None documented'}
`}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveAdr} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase">ADR Number</label>
                    <input
                      type="text"
                      value={adrForm.number || ''}
                      onChange={(e) => setAdrForm(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase">Status</label>
                    <select
                      value={adrForm.status || 'Accepted'}
                      onChange={(e) => setAdrForm(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="Accepted">Accepted</option>
                      <option value="Proposed">Proposed</option>
                      <option value="Deprecated">Deprecated</option>
                      <option value="Superseded">Superseded</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Title</label>
                  <input
                    type="text"
                    value={adrForm.title || ''}
                    onChange={(e) => setAdrForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Distributed Cache Layer Evaluation (Redis vs Memcached)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Deciders / Authors</label>
                  <input
                    type="text"
                    value={adrForm.deciders || ''}
                    onChange={(e) => setAdrForm(prev => ({ ...prev, deciders: e.target.value }))}
                    placeholder="Elena Rostova, Marcus Chen"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Context &amp; Problem Statement</label>
                  <textarea
                    rows={2}
                    value={adrForm.context || ''}
                    onChange={(e) => setAdrForm(prev => ({ ...prev, context: e.target.value }))}
                    placeholder="Why did this decision need to be made? What performance or security pressures triggered it?"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Decision Made</label>
                  <textarea
                    rows={2}
                    value={adrForm.decision || ''}
                    onChange={(e) => setAdrForm(prev => ({ ...prev, decision: e.target.value }))}
                    placeholder="What was the selected technical choice?"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Consequences &amp; Rationale</label>
                  <textarea
                    rows={2}
                    value={adrForm.consequences || ''}
                    onChange={(e) => setAdrForm(prev => ({ ...prev, consequences: e.target.value }))}
                    placeholder="What positive and negative outcomes resulted?"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                {/* Commit to GitHub Checkbox */}
                {currentUser && (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="commitToGitHub"
                      checked={commitToGitHub}
                      onChange={(e) => setCommitToGitHub(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <label htmlFor="commitToGitHub" className="text-xs text-slate-300 cursor-pointer">
                      Commit file to GitHub repository under <code className="text-blue-400 font-mono">docs/adr/</code>
                    </label>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingAdr(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save ADR Record</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
