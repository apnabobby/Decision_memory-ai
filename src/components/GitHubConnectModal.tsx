import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Github, 
  Key, 
  FolderGit2, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  ArrowRight,
  Search,
  Star,
  GitBranch,
  Lock,
  Globe,
  RefreshCw,
  Cpu,
  Check,
  Layers
} from 'lucide-react';
import { GitHubUser, GitHubRepo } from '../types/decision';

interface GitHubConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: GitHubUser | null;
  currentRepoName: string;
  onUserChange: (user: GitHubUser | null) => void;
  onSelectRepo: (repoFullName: string) => void;
  onNavigateToAnalysis?: (repoFullName: string) => void;
}

export const GitHubConnectModal: React.FC<GitHubConnectModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentRepoName,
  onUserChange,
  onSelectRepo,
  onNavigateToAnalysis,
}) => {
  const [activeMode, setActiveMode] = useState<'repos' | 'oauth' | 'pat' | 'public'>('repos');
  const [patToken, setPatToken] = useState('');
  const [publicRepoInput, setPublicRepoInput] = useState('');
  const [repoSearchQuery, setRepoSearchQuery] = useState('');
  const [repoFilterTab, setRepoFilterTab] = useState<'all' | 'user' | 'public'>('all');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [userRepos, setUserRepos] = useState<(GitHubRepo & { isUserRepo?: boolean })[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [oauthConfigInfo, setOauthConfigInfo] = useState<{ hasConfig: boolean; callbackUrl: string } | null>(null);
  const [selectedRepoFeedback, setSelectedRepoFeedback] = useState<string | null>(null);

  // Set default active tab based on authentication
  useEffect(() => {
    if (currentUser) {
      setActiveMode('repos');
    } else {
      setActiveMode('oauth');
    }
  }, [currentUser, isOpen]);

  // Check OAuth config on mount
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/auth/github/url')
      .then(res => res.json())
      .then(data => {
        setOauthConfigInfo({
          hasConfig: data.hasConfig,
          callbackUrl: data.callbackUrl || `${window.location.origin}/auth/github/callback`,
        });
      })
      .catch(() => {});
  }, [isOpen]);

  // Fetch repositories function
  const fetchRepositories = async () => {
    setIsFetchingRepos(true);
    setErrorMessage(null);
    const token = localStorage.getItem('github_token') || '';

    try {
      const url = token ? `/api/github/repos?token=${encodeURIComponent(token)}` : '/api/github/repos';
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.repos) {
        setUserRepos(data.repos);
      }
    } catch (err: any) {
      console.warn('Failed to fetch repositories:', err);
    } finally {
      setIsFetchingRepos(false);
    }
  };

  // Fetch repositories whenever modal opens or user logs in
  useEffect(() => {
    if (isOpen) {
      fetchRepositories();
    }
  }, [isOpen, currentUser]);

  // Listen for OAuth postMessage from popup (per oauth-integration skill)
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'github') {
        setIsLoading(false);
        setStatusMessage('GitHub account connected successfully!');
        if (event.data.token) {
          localStorage.setItem('github_token', event.data.token);
        }
        if (event.data.user) {
          localStorage.setItem('github_user', JSON.stringify(event.data.user));
          onUserChange(event.data.user);
        } else {
          fetch('/api/github/user')
            .then(r => r.json())
            .then(data => {
              if (data.user) {
                localStorage.setItem('github_user', JSON.stringify(data.user));
                onUserChange(data.user);
              }
            });
        }
        setActiveMode('repos');
        fetchRepositories();
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onUserChange]);

  if (!isOpen) return null;

  // 1. Popup-based OAuth Flow
  const handleOAuthConnect = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('Fetching OAuth authorization URL...');

    try {
      const res = await fetch('/api/auth/github/url');
      const data = await res.json();

      if (!data.hasConfig || !data.url) {
        setErrorMessage(
          'GitHub OAuth App not yet configured with client credentials. You can also connect instantly via Personal Access Token (PAT) or inspect any Public Repo below!'
        );
        setIsLoading(false);
        return;
      }

      setStatusMessage('Opening GitHub authorization popup...');
      const authWindow = window.open(
        data.url,
        'github_oauth_popup',
        'width=650,height=750,menubar=no,toolbar=no'
      );

      if (!authWindow) {
        setErrorMessage('Popup was blocked by your browser. Please allow popups for this site.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(`Failed to initiate OAuth: ${err.message}`);
      setIsLoading(false);
    }
  };

  // 2. Token-based Login
  const handlePatLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patToken.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage('Verifying token with GitHub API...');

    try {
      const res = await fetch('/api/auth/github/token-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: patToken.trim() }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Token verification failed');
      }

      localStorage.setItem('github_token', patToken.trim());
      localStorage.setItem('github_user', JSON.stringify(data.user));
      onUserChange(data.user);
      setStatusMessage(`Connected as @${data.user.login}!`);
      setPatToken('');
      setActiveMode('repos');
      fetchRepositories();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
    await fetch('/api/auth/logout', { method: 'POST' });
    onUserChange(null);
    setStatusMessage('Disconnected from GitHub.');
    setActiveMode('oauth');
  };

  // 3. Selection & Analysis Logic
  const handleSelectRepository = (repoFullName: string, andAnalyze: boolean = false) => {
    onSelectRepo(repoFullName);
    setSelectedRepoFeedback(`Target repository updated to "${repoFullName}"`);

    if (andAnalyze) {
      if (onNavigateToAnalysis) {
        onNavigateToAnalysis(repoFullName);
      }
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setTimeout(() => {
        setSelectedRepoFeedback(null);
      }, 2500);
    }
  };

  // Filtered repositories
  const filteredRepos = useMemo(() => {
    return userRepos.filter(repo => {
      const matchesQuery = 
        repo.full_name.toLowerCase().includes(repoSearchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(repoSearchQuery.toLowerCase()));

      if (!matchesQuery) return false;

      if (repoFilterTab === 'user') {
        return repo.isUserRepo === true;
      }
      if (repoFilterTab === 'public') {
        return !repo.private;
      }
      return true;
    });
  }, [userRepos, repoSearchQuery, repoFilterTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-md">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  GitHub Repositories &amp; Analysis
                </h2>
                {currentUser && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Select and target repositories for real-time architectural decision &amp; evidence analysis
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

        {/* User Account Strip if logged in */}
        {currentUser && (
          <div className="px-5 py-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.login}
                className="w-7 h-7 rounded-full border border-slate-700"
              />
              <div>
                <span className="font-semibold text-white">
                  {currentUser.name || currentUser.login}
                </span>
                <span className="text-slate-400 font-mono ml-1.5">
                  (@{currentUser.login})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono hidden sm:inline">
                {currentUser.public_repos} repos
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition"
                title="Disconnect Account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveMode('repos')}
              className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 flex items-center gap-1.5 ${
                activeMode === 'repos'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Repository Selector ({userRepos.length})</span>
            </button>

            {!currentUser && (
              <>
                <button
                  onClick={() => setActiveMode('oauth')}
                  className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 flex items-center gap-1.5 ${
                    activeMode === 'oauth'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>OAuth Popup</span>
                </button>

                <button
                  onClick={() => setActiveMode('pat')}
                  className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 flex items-center gap-1.5 ${
                    activeMode === 'pat'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Personal Token</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveMode('public')}
              className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 flex items-center gap-1.5 ${
                activeMode === 'public'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Custom Public Repo</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {selectedRepoFeedback && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{selectedRepoFeedback}</span>
            </div>
          )}

          {/* TAB 1: REPOSITORY SELECTION & ANALYSIS (MAIN VIEW) */}
          {activeMode === 'repos' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={repoSearchQuery}
                    onChange={(e) => setRepoSearchQuery(e.target.value)}
                    placeholder="Search your repositories by name or topic..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setRepoFilterTab('all')}
                    className={`px-2.5 py-1 rounded-md transition font-medium ${
                      repoFilterTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({userRepos.length})
                  </button>
                  {currentUser && (
                    <button
                      onClick={() => setRepoFilterTab('user')}
                      className={`px-2.5 py-1 rounded-md transition font-medium ${
                        repoFilterTab === 'user' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      My Repos
                    </button>
                  )}
                  <button
                    onClick={fetchRepositories}
                    disabled={isFetchingRepos}
                    className="p-1 text-slate-400 hover:text-white rounded"
                    title="Refresh Repositories"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRepos ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Repositories List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {isFetchingRepos && userRepos.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
                    <p className="text-xs text-slate-400">Fetching repositories via GitHub API...</p>
                  </div>
                ) : filteredRepos.length > 0 ? (
                  filteredRepos.map((repo) => {
                    const isSelected = currentRepoName === repo.full_name;
                    return (
                      <div
                        key={repo.id}
                        className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-950/25 border-blue-500/60 shadow-md ring-1 ring-blue-500/20'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs sm:text-sm text-white truncate">
                              {repo.full_name}
                            </span>

                            {repo.private ? (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1 font-mono">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Private</span>
                              </span>
                            ) : (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1 font-mono">
                                <Globe className="w-2.5 h-2.5" />
                                <span>Public</span>
                              </span>
                            )}

                            {isSelected && (
                              <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                                <Check className="w-2.5 h-2.5" />
                                <span>Active Target</span>
                              </span>
                            )}
                          </div>

                          {repo.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {repo.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-0.5">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-400" />
                              <span>{repo.stargazers_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />
                              <span>{repo.default_branch || 'main'}</span>
                            </div>
                            <span>Updated {repo.updated_at?.slice(0, 10)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleSelectRepository(repo.full_name, false)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isSelected
                                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSelectRepository(repo.full_name, true)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-sm"
                            title="Target this repository and open Decision Memory Analysis"
                          >
                            <Cpu className="w-3 h-3" />
                            <span>Analyze</span>
                          </button>

                          {repo.html_url && (
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-500 hover:text-slate-300"
                              title="Open on GitHub"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <FolderGit2 className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-300 font-semibold">No repositories found</p>
                    <p className="text-[11px] text-slate-500">
                      {currentUser
                        ? 'Try clearing the search query or use the Custom Public Repo tab.'
                        : 'Connect your GitHub account or choose from curated public projects.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: OAUTH POPUP */}
          {activeMode === 'oauth' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authenticate with GitHub via secure OAuth popup to automatically list your repositories, analyze architecture commits, and save ADR documents.
                </p>

                <button
                  onClick={handleOAuthConnect}
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-600 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>{isLoading ? 'Connecting...' : 'Sign in with GitHub'}</span>
                </button>
              </div>

              {/* OAuth App Setup Information Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center gap-1 text-slate-300 font-semibold">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>GitHub OAuth App Configuration Info</span>
                </div>
                <p>
                  If you maintain your own GitHub OAuth App at <code>github.com/settings/developers</code>, use this exact callback URL:
                </p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-blue-400 text-[10px] break-all select-all">
                  {oauthConfigInfo?.callbackUrl || 'https://.../auth/github/callback'}
                </div>
                <p className="text-slate-400">
                  Or use the <strong>Personal Token</strong> tab for immediate zero-config connection!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PERSONAL ACCESS TOKEN */}
          {activeMode === 'pat' && (
            <form onSubmit={handlePatLogin} className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect instantly with a GitHub Personal Access Token (classic or fine-grained).
                  Requires <code>repo</code> and <code>read:user</code> scopes to inspect commits and write ADRs.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    GitHub Token (ghp_... or github_pat_...)
                  </label>
                  <input
                    type="password"
                    value={patToken}
                    onChange={(e) => setPatToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !patToken.trim()}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>{isLoading ? 'Verifying...' : 'Connect With Token'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: CUSTOM PUBLIC REPO INPUT */}
          {activeMode === 'public' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Analyze any public GitHub repository directly. Decision Memory AI will ingest the commit history, PRs, and docs via GitHub's public API.
                </p>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Quick Sample Repositories
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { name: 'cloudscale-infra/core-api', desc: 'CloudScale Core Microservices (Hackathon Demo)' },
                      { name: 'expressjs/express', desc: 'Fast Node.js web framework' },
                      { name: 'facebook/react', desc: 'The library for web and native user interfaces' },
                      { name: 'tailwindlabs/tailwindcss', desc: 'A utility-first CSS framework' },
                    ].map((r) => (
                      <button
                        key={r.name}
                        onClick={() => handleSelectRepository(r.name, true)}
                        className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 text-left transition flex items-center justify-between text-xs group"
                      >
                        <div>
                          <span className="font-mono font-semibold text-blue-400 group-hover:text-blue-300">
                            {r.name}
                          </span>
                          <p className="text-slate-400 text-[11px]">{r.desc}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Enter Any Public Repository
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={publicRepoInput}
                      onChange={(e) => setPublicRepoInput(e.target.value)}
                      placeholder="e.g. owner/repository or https://github.com/owner/repository"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (publicRepoInput.trim()) {
                          const clean = publicRepoInput.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/+$/, '');
                          handleSelectRepository(clean, true);
                        }
                      }}
                      disabled={!publicRepoInput.trim()}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-medium text-xs transition"
                    >
                      Target &amp; Analyze
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status & Error Messages */}
          {statusMessage && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-500">Active Target:</span>
            <span className="text-blue-400 font-semibold">{currentRepoName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectRepository(currentRepoName, true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Open Analysis View</span>
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
