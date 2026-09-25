export type SourceType = 'git_commit' | 'pull_request' | 'issue' | 'architecture_doc';

export interface EvidenceSource {
  id: string;
  sourceType: SourceType;
  reference: string; // e.g. "PR #217", "Commit c7b8a1f", "ADR-004", "Issue #142"
  title: string;
  author: string;
  authorRole?: string;
  date: string;
  url?: string;
  excerpt: string;
  fullContent?: string;
  tags: string[];
  relevanceScore?: number;
  matchedReason?: string;
}

export interface DecisionTimelineItem {
  step: string;
  date: string;
  description: string;
  actor?: string;
  sourceRef?: string;
}

export interface RejectedOption {
  option: string;
  reason: string;
  evidenceRef?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'decision' | 'reason' | 'alternative' | 'rejected_option' | 'person' | 'pull_request' | 'commit' | 'issue' | 'document' | 'timeline';
  detail?: string;
  sourceRef?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
  type?: 'caused_by' | 'rejected_for' | 'documented_in' | 'committed_in' | 'discussed_in' | 'decided_by' | 'progressed_to';
}

export interface DecisionGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface DecisionAnswer {
  id: string;
  question: string;
  decision: string;
  reason: string;
  alternatives: string[];
  rejectedOptions: RejectedOption[];
  context: string;
  timeline: DecisionTimelineItem[];
  evidence: EvidenceSource[];
  confidence: 'high' | 'medium' | 'low';
  sourcesChecked: string[];
  isInsufficientEvidence: boolean;
  graph: DecisionGraphData;
  generatedAt: string;
  modelUsed?: string;
}

export interface ProjectSourceStats {
  gitCommitsCount: number;
  pullRequestsCount: number;
  issuesCount: number;
  architectureDocsCount: number;
  lastSynced: string;
  repositoryName: string;
  branch: string;
  status: 'Connected' | 'Demo Data';
}

export interface PresetDemoQuestion {
  id: string;
  question: string;
  topic: string;
  keyTech: string;
  previewSummary: string;
}

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  default_branch: string;
  stargazers_count: number;
  open_issues_count: number;
  updated_at: string;
}

export interface ADRDocument {
  id: string;
  number: string;
  title: string;
  status: 'Accepted' | 'Proposed' | 'Deprecated' | 'Superseded' | 'Rejected';
  date: string;
  deciders: string;
  context: string;
  decision: string;
  consequences: string;
  alternativesConsidered: string[];
  rejectedOptions: { option: string; reason: string }[];
  filePath?: string;
  sha?: string;
}

export interface RepoAnalysisReport {
  repoName: string;
  scannedAt: string;
  commitsAnalyzed: number;
  prsAnalyzed: number;
  issuesAnalyzed: number;
  adrsFound: number;
  documentationHealthScore: number; // 0 - 100
  keyDecisions: {
    title: string;
    decision: string;
    why: string;
    confidence: 'high' | 'medium' | 'low';
    source: string;
  }[];
  undocumentedChanges: {
    type: 'dependency' | 'architecture' | 'config';
    summary: string;
    commitSha?: string;
    suggestedAction: string;
  }[];
}

