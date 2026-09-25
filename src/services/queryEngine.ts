import { DecisionAnswer, EvidenceSource } from '../types/decision';
import { PRESET_DECISION_ANSWERS, RAW_EVIDENCE_REPOSITORY } from '../data/sampleDataset';

export interface QueryOptions {
  onProgress?: (step: string) => void;
  presetKey?: string;
}

export async function askDecisionMemory(question: string, options?: QueryOptions): Promise<DecisionAnswer> {
  const { onProgress, presetKey } = options || {};

  // Step 1: Searching project knowledge
  onProgress?.('Searching project knowledge...');
  await new Promise(r => setTimeout(r, 450));

  // If a presetKey is provided and recognized
  if (presetKey && PRESET_DECISION_ANSWERS[presetKey]) {
    onProgress?.('Analyzing evidence...');
    await new Promise(r => setTimeout(r, 400));
    onProgress?.('Connecting decisions...');
    await new Promise(r => setTimeout(r, 350));
    onProgress?.('Preparing cited answer...');
    await new Promise(r => setTimeout(r, 300));
    return PRESET_DECISION_ANSWERS[presetKey];
  }

  // Check matching against presets by text similarity
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('redis') || (lowerQ.includes('cache') && (lowerQ.includes('why') || lowerQ.includes('memcached')))) {
    return runPresetSequence('redis', onProgress);
  }
  if (lowerQ.includes('postgres') || lowerQ.includes('postgresql') || (lowerQ.includes('mongo') && lowerQ.includes('database'))) {
    return runPresetSequence('postgres', onProgress);
  }
  if (lowerQ.includes('jwt') || lowerQ.includes('session') || (lowerQ.includes('auth') && lowerQ.includes('token'))) {
    return runPresetSequence('jwt', onProgress);
  }
  if (lowerQ.includes('graphql') || (lowerQ.includes('rest') && (lowerQ.includes('dashboard') || lowerQ.includes('api')))) {
    return runPresetSequence('graphql', onProgress);
  }
  if (lowerQ.includes('rabbitmq') || lowerQ.includes('kafka') || (lowerQ.includes('queue') && lowerQ.includes('event'))) {
    return runPresetSequence('rabbitmq', onProgress);
  }

  // Attempt server API call first for free-form custom queries
  try {
    onProgress?.('Analyzing project knowledge via server engine...');
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.decision) {
        onProgress?.('Connecting decisions...');
        await new Promise(r => setTimeout(r, 300));
        onProgress?.('Preparing cited answer...');
        await new Promise(r => setTimeout(r, 300));
        return data as DecisionAnswer;
      }
    }
  } catch {
    // Graceful fallback to client knowledge retrieval if server endpoint is offline
  }

  // Grounded search across raw evidence repository
  onProgress?.('Analyzing evidence...');
  await new Promise(r => setTimeout(r, 400));

  const words = lowerQ.split(/\s+/).filter(w => w.length > 2);
  const matchedEvidence: EvidenceSource[] = [];

  for (const item of RAW_EVIDENCE_REPOSITORY) {
    let score = 0;
    const itemContent = `${item.title} ${item.excerpt} ${item.tags.join(' ')} ${item.reference}`.toLowerCase();
    for (const w of words) {
      if (itemContent.includes(w)) {
        score += 1;
      }
    }
    if (score > 0) {
      matchedEvidence.push({
        ...item,
        relevanceScore: score,
      });
    }
  }

  matchedEvidence.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  onProgress?.('Connecting decisions...');
  await new Promise(r => setTimeout(r, 350));

  // If evidence is insufficient (score too low or no matches)
  if (matchedEvidence.length === 0) {
    onProgress?.('Preparing cited answer...');
    await new Promise(r => setTimeout(r, 300));

    return {
      id: `ans-insufficient-${Date.now()}`,
      question,
      decision: 'Insufficient evidence to determine the original reasoning.',
      reason: 'No documented Architecture Decision Records, Pull Request discussions, or Git commit messages in the repository corpus contain evidence explaining this question.',
      alternatives: [],
      rejectedOptions: [],
      context: 'The repository knowledge base (cloudscale-infra/core-api) was searched across Git commit logs, 388 PR reviews, and 24 ADRs.',
      timeline: [],
      evidence: [],
      confidence: 'low',
      sourcesChecked: [
        'ADR-001 through ADR-024 (Architecture Decision Records)',
        'Merged Pull Request Discussions (PR #1 through #388)',
        'Issue Tracker Incident & Architecture Tickets (Issue #1 through #512)',
        'Git Commit History (1,420 commits on main branch)',
      ],
      isInsufficientEvidence: true,
      generatedAt: new Date().toISOString(),
      modelUsed: 'Decision Memory AI / Citation Guard Engine',
      graph: {
        nodes: [
          { id: 'node-query', label: question.slice(0, 35) + '...', type: 'decision', detail: 'Target Query' },
          { id: 'node-insufficient', label: 'Insufficient Evidence', type: 'rejected_option', detail: 'Zero grounded citations located in repository records' },
        ],
        edges: [
          { source: 'node-query', target: 'node-insufficient', label: 'status', type: 'rejected_for' },
        ],
      },
    };
  }

  // Synthesize answer grounded strictly in top matches
  onProgress?.('Preparing cited answer...');
  await new Promise(r => setTimeout(r, 300));

  const topMatch = matchedEvidence[0];
  const relatedTags = topMatch.tags;
  const filteredEvidence = RAW_EVIDENCE_REPOSITORY.filter(e => 
    e.tags.some(t => relatedTags.includes(t))
  );

  return {
    id: `ans-synth-${Date.now()}`,
    question,
    decision: `Decision documented in ${topMatch.reference}: ${topMatch.title.replace(/^[^:]+:\s*/, '')}`,
    reason: topMatch.excerpt,
    alternatives: topMatch.tags.includes('redis') ? ['Memcached'] :
                 topMatch.tags.includes('postgres') ? ['MongoDB'] :
                 topMatch.tags.includes('jwt') ? ['Stateless JWT'] :
                 topMatch.tags.includes('graphql') ? ['Bespoke Composite REST'] :
                 topMatch.tags.includes('rabbitmq') ? ['Apache Kafka'] : ['Unspecified alternatives'],
    rejectedOptions: [
      {
        option: topMatch.tags.includes('redis') ? 'Memcached' :
                topMatch.tags.includes('postgres') ? 'MongoDB' :
                topMatch.tags.includes('jwt') ? 'Stateless JWT' :
                topMatch.tags.includes('graphql') ? 'Bespoke REST' : 'Alternative tool',
        reason: 'Rejected based on lack of requirements match as documented in primary architecture records.',
        evidenceRef: topMatch.reference,
      }
    ],
    context: `Extracted from repository knowledge records authored by ${topMatch.author} (${topMatch.date}).`,
    timeline: [
      { step: 'Documented', date: topMatch.date, description: topMatch.title, actor: topMatch.author, sourceRef: topMatch.reference }
    ],
    evidence: filteredEvidence.length > 0 ? filteredEvidence : [topMatch],
    confidence: filteredEvidence.length > 2 ? 'high' : 'medium',
    sourcesChecked: filteredEvidence.map(e => e.reference),
    isInsufficientEvidence: false,
    generatedAt: new Date().toISOString(),
    modelUsed: 'Decision Memory AI / Grounded Knowledge Engine',
    graph: {
      nodes: [
        { id: 'node-dec', label: topMatch.title.slice(0, 32), type: 'decision', detail: topMatch.reference, sourceRef: topMatch.reference },
        { id: 'node-rea', label: 'Primary Justification', type: 'reason', detail: topMatch.excerpt.slice(0, 60) + '...' },
        { id: 'node-author', label: topMatch.author, type: 'person', detail: topMatch.authorRole || 'Contributor' },
        { id: 'node-src', label: topMatch.reference, type: topMatch.sourceType === 'git_commit' ? 'commit' : topMatch.sourceType === 'pull_request' ? 'pull_request' : topMatch.sourceType === 'issue' ? 'issue' : 'document', detail: topMatch.title, sourceRef: topMatch.reference },
      ],
      edges: [
        { source: 'node-dec', target: 'node-rea', label: 'justified by', type: 'caused_by' },
        { source: 'node-dec', target: 'node-author', label: 'decided by', type: 'decided_by' },
        { source: 'node-dec', target: 'node-src', label: 'recorded in', type: 'documented_in' },
      ],
    },
  };
}

async function runPresetSequence(key: string, onProgress?: (s: string) => void): Promise<DecisionAnswer> {
  onProgress?.('Analyzing evidence...');
  await new Promise(r => setTimeout(r, 380));
  onProgress?.('Connecting decisions...');
  await new Promise(r => setTimeout(r, 350));
  onProgress?.('Preparing cited answer...');
  await new Promise(r => setTimeout(r, 300));
  return PRESET_DECISION_ANSWERS[key];
}
