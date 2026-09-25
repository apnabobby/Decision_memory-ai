# IBM Bob 2.0 Task 02: Architecture & Implementation Planning

- **Mode**: IBM Bob 2.0 Subagents & Architecture Planner
- **Timestamp**: 2026-09-24T15:30:00Z
- **Scope**: System architecture, Citation Safety boundaries, and Decision Graph schema

## Objectives
1. Design the grounded retrieval pipeline: Question -> Source Retrieval -> Evidence Extraction -> Decision Graph -> Grounded Answer.
2. Establish strict citation invariants: AI must never invent PR numbers, commit hashes, or author names.
3. Formulate the response schema and fallback mechanisms.

## Invariants Enforced by IBM Bob
1. **Evidence Invariant**: "Answer only using the supplied evidence. If the evidence does not support a claim, declare insufficient evidence."
2. **Dual-Layer Architecture**:
   - Primary: Server-side Gemini API with strict structured JSON schema (`responseSchema`).
   - Fallback: Local semantic keyword & tag matcher guaranteeing 100% demo uptime even without external internet/keys.
3. **Graph Topology**:
   - Nodes: Decision, Reason, Alternative, Rejected Option, Author, PR, Commit, Issue, Document, Timeline.
   - Edges: caused_by, rejected_for, documented_in, committed_in, discussed_in, decided_by.
