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

