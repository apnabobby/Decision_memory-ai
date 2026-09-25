/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { AskWhyView } from './components/AskWhyView';
import { DecisionGraphView } from './components/DecisionGraphView';
import { EvidenceView } from './components/EvidenceView';
import { ProjectSourcesView } from './components/ProjectSourcesView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { BobHubModal } from './components/BobHubModal';
import { EvidenceModal } from './components/EvidenceModal';
import { DemoScriptModal } from './components/DemoScriptModal';
import { GitHubConnectModal } from './components/GitHubConnectModal';
import { RepoAnalysisView } from './components/RepoAnalysisView';
import { DecisionAnswer, EvidenceSource, PresetDemoQuestion, GitHubUser } from './types/decision';
import { PRESET_DECISION_ANSWERS, RAW_EVIDENCE_REPOSITORY } from './data/sampleDataset';
import { askDecisionMemory } from './services/queryEngine';
import { Terminal, ShieldCheck, Heart, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentAnswer, setCurrentAnswer] = useState<DecisionAnswer | null>(PRESET_DECISION_ANSWERS.redis);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [queryError, setQueryError] = useState<string | null>(null);
  const [history, setHistory] = useState<DecisionAnswer[]>([PRESET_DECISION_ANSWERS.redis]);
  
  // GitHub & Repository Context
  const [currentUser, setCurrentUser] = useState<GitHubUser | null>(null);
  const [currentRepoName, setCurrentRepoName] = useState<string>('cloudscale-infra/core-api');
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  // Modals
  const [isBobHubOpen, setIsBobHubOpen] = useState<boolean>(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [inspectedEvidence, setInspectedEvidence] = useState<EvidenceSource | null>(null);
  const [graphDecisionKey, setGraphDecisionKey] = useState<string>('redis');

  // Check existing GitHub user session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    const savedUser = localStorage.getItem('github_user');

    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {}
    }

    if (savedToken) {
      fetch('/api/auth/github/token-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: savedToken }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {});
    } else {
      fetch('/api/github/user')
        .then(res => res.json())
        .then(data => {
          if (data.connected && data.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleAsk = async (question: string, presetKey?: string) => {
    setIsLoading(true);
    setQueryError(null);
    setLoadingStep('Searching project knowledge...');

    try {
      const answer = await askDecisionMemory(question, {
        presetKey,
        onProgress: (step) => setLoadingStep(step),
      });

      setCurrentAnswer(answer);
      setHistory(prev => [answer, ...prev.filter(h => h.id !== answer.id)]);
      
      // Update graph key if matched
      if (presetKey) {
        setGraphDecisionKey(presetKey);
      } else {
        const lower = question.toLowerCase();
        if (lower.includes('redis')) setGraphDecisionKey('redis');
        else if (lower.includes('postgres')) setGraphDecisionKey('postgres');
        else if (lower.includes('jwt')) setGraphDecisionKey('jwt');
        else if (lower.includes('graphql')) setGraphDecisionKey('graphql');
        else if (lower.includes('rabbitmq')) setGraphDecisionKey('rabbitmq');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown query failure';
      setQueryError(msg);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleSelectPreset = (preset: PresetDemoQuestion) => {
    setActiveTab('ask');
    handleAsk(preset.question, preset.id);
  };

  const handleNavigateToGraph = (decisionId?: string) => {
    if (decisionId) {
      if (decisionId.includes('redis')) setGraphDecisionKey('redis');
      else if (decisionId.includes('postgres')) setGraphDecisionKey('postgres');
      else if (decisionId.includes('jwt')) setGraphDecisionKey('jwt');
      else if (decisionId.includes('graphql')) setGraphDecisionKey('graphql');
      else if (decisionId.includes('rabbitmq')) setGraphDecisionKey('rabbitmq');
    }
    setActiveTab('graph');
  };

  const handleInspectNodeRef = (sourceRef: string) => {
    const found = RAW_EVIDENCE_REPOSITORY.find(e => 
      e.reference.toLowerCase() === sourceRef.toLowerCase() ||
      e.reference.toLowerCase().includes(sourceRef.toLowerCase())
    );
    if (found) {
      setInspectedEvidence(found);
    } else {
      setActiveTab('evidence');
    }
  };

  const handleRunDemoStep = (stepNumber: number) => {
    if (stepNumber === 2) {
      setActiveTab('ask');
      handleAsk('Why was Redis chosen for caching?', 'redis');
    } else if (stepNumber === 5) {
      setGraphDecisionKey('redis');
      setActiveTab('graph');
    } else if (stepNumber === 6) {
      setIsBobHubOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Header */}
      <Header
        onOpenBobHub={() => setIsBobHubOpen(true)}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        onOpenGitHubConnect={() => setIsGitHubModalOpen(true)}
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      {/* Primary Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            onSelectPreset={handleSelectPreset}
            onNavigateToAsk={() => setActiveTab('ask')}
            onNavigateToGraph={handleNavigateToGraph}
          />
        )}

        {activeTab === 'ask' && (
          <AskWhyView
            onAsk={handleAsk}
            isLoading={isLoading}
            loadingStep={loadingStep}
            answer={currentAnswer}
            error={queryError}
            onNavigateToGraph={handleNavigateToGraph}
            onInspectEvidence={(ev) => setInspectedEvidence(ev)}
          />
        )}

        {activeTab === 'graph' && (
          <DecisionGraphView
            initialDecisionKey={graphDecisionKey}
            onInspectNodeRef={handleInspectNodeRef}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceView
            onInspectEvidence={(ev) => setInspectedEvidence(ev)}
          />
        )}

        {activeTab === 'analysis' && (
          <RepoAnalysisView
            currentRepoName={currentRepoName}
            onSelectRepo={(repo) => setCurrentRepoName(repo)}
            currentUser={currentUser}
            onOpenConnectModal={() => setIsGitHubModalOpen(true)}
            onAskQuestion={(q) => {
              setActiveTab('ask');
              handleAsk(q);
            }}
          />
        )}

        {activeTab === 'sources' && (
          <ProjectSourcesView />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectHistoryItem={(item) => {
              setCurrentAnswer(item);
              setActiveTab('ask');
            }}
            onClearHistory={() => setHistory([])}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            onOpenBobHub={() => setIsBobHubOpen(true)}
          />
        )}
      </main>

      {/* Footer (Section 22 requirements) */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Decision Memory AI</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">“Ask WHY. Get the Decision. See the Evidence.”</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBobHubOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>IBM Bob 2.0 Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              Citation Policy
            </button>

            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-semibold">
              LABLAB.AI × IBM BOB 2.0 HACKATHON 2026
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GitHubConnectModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        currentUser={currentUser}
        currentRepoName={currentRepoName}
        onUserChange={(user) => setCurrentUser(user)}
        onSelectRepo={(repo) => setCurrentRepoName(repo)}
        onNavigateToAnalysis={(repo) => {
          setCurrentRepoName(repo);
          setActiveTab('analysis');
        }}
      />

      <BobHubModal
        isOpen={isBobHubOpen}
        onClose={() => setIsBobHubOpen(false)}
      />

      <EvidenceModal
        evidence={inspectedEvidence}
        onClose={() => setInspectedEvidence(null)}
      />

      <DemoScriptModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onRunDemoStep={handleRunDemoStep}
      />
    </div>
  );
}
