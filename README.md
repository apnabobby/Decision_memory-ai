# Decision Memory AI

> **Ask WHY. Get the Decision. See the Evidence.**

An AI-powered developer knowledge system that connects Git history, PR discussions, tickets, and documentation to explain the reasoning behind technical decisions.

Built for the **LABLAB.AI × IBM BOB 2.0 HACKATHON 2026**.

---

## 🎯 Problem

Developers can understand **WHAT** the code does, but understanding **WHY** a technical decision was made is often difficult.

The reasoning may be scattered across:
- **Git commits**
- **Pull requests**
- **Issues / tickets**
- **Documentation**

Decision Memory AI brings this information together into a searchable Decision Graph with evidence-backed answers.

---

## 💡 Solution

Decision Memory AI lets developers ask questions such as:

```text
"Why did we choose OAuth instead of JWT?"
"Why was Redis chosen for caching?"
"Why was PostgreSQL selected over MongoDB?"
```

The system searches available project evidence and produces:

- **Decision**
- **Reasoning**
- **Alternatives considered**
- **Rejected options**
- **Context**
- **Timeline**
- **Evidence / citations**

If sufficient evidence is not available, the system clearly indicates that instead of inventing an answer:
> *“Insufficient evidence to determine the original reasoning.”*

---

## 🏗️ Architecture

```text
Question
   ↓
AI Specialist Agents
   ↓
Git / PR / Tickets / Docs
   ↓
Evidence Extraction
   ↓
Decision Graph
   ↓
Cited Answer
```

### Runtime Agents

- **Git History Agent**: Ingests commit messages, author metadata, and change timestamps.
- **PR Discussion Agent**: Analyzes code review debates, design trade-offs, and approval rationales.
- **Ticket / Issue Agent**: Correlates incident reports, compliance requirements, and feature tickets.
- **Documentation Agent**: Parses Architecture Decision Records (ADRs) and repository markdown specs.
- **Orchestrator**: Ranks evidentiary support, calculates citation relevance, and links the Decision Graph.
- **Answer Agent**: Synthesizes the final grounded answer strictly from primary evidence.

> **Note**: These are application runtime agents. **IBM Bob 2.0** was used separately as the development partner for building, testing, debugging, and improving this project.

---

## 🚀 Key Features

- **Ask WHY questions** about technical decisions
- **Evidence-backed answers** with strict separation between KNOWN EVIDENCE and AI-GENERATED SUMMARY
- **Decision Graph visualization** (interactive SVG node-link graph with pan & zoom)
- **Source citations** (zero-hallucination guarantee for PRs, commits, issues, and ADRs)
- **Alternatives and rejected options** with documented reasons for elimination
- **Timeline of decisions** showing how architectural choices evolved over time
- **GitHub repository connector & login system** to read commits, edit ADRs, and run repository analysis
- **Demo / sample project data** for instant offline judging
- **Insufficient-evidence handling** when questions lack primary documentation

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express + TypeScript (`tsx`)
- **AI**: Google AI Studio / Gemini (`@google/genai` TypeScript SDK, `gemini-3.8-flash`)
- **Data**: Local structured JSON knowledge repository (`data/knowledge_base.json`) + In-memory session store
- **Visualization**: Custom SVG Topological Node-Link Decision Graph with pan, zoom, and node inspector
- **Icons**: Lucide React

---

## 🤖 IBM Bob 2.0 Usage

IBM Bob 2.0 was used as a core development tool during the hackathon.

### Bob Tasks

1. **Repository analysis**: Scanned codebases to identify developer knowledge fragmentation across Git logs, PRs, and ADRs.
2. **Architecture and implementation planning**: Designed the citation safety boundary, graph schema, and dual-layer grounded retrieval pipeline.
3. **Feature implementation**: Generated frontend UI components, SVG Decision Graph visualizer, evidence explorer, and backend Express API routes using parallel workers.
4. **Testing and debugging**: Hardened runtime error resilience, validated JSON schemas, and enforced 0 TypeScript compiler warnings.
5. **Code review and quality improvements**: Verified 100% citation grounding across all test queries and confirmed zero-hallucination invariants.

Session summary screenshots and logs are available in:

```text
/bob_sessions
├── 01_repository_analysis.svg
├── 01_repository_analysis.md
├── 02_architecture_plan.svg
├── 02_architecture_plan.md
├── 03_feature_implementation.svg
├── 03_feature_implementation.md
├── 04_debugging.svg
├── 04_debugging.md
├── 05_testing.svg
├── 05_testing.md
├── 06_documentation.svg
└── 06_documentation.md
```

These artifacts document the actual Bob IDE sessions used during development and can also be inspected directly inside the application via the **IBM Bob 2.0 Hub** button.

---

## 📁 Project Structure

```text
decision-memory-ai/
├── src/
│   ├── components/
│   │   ├── Header.tsx                # App header with GitHub & Bob Hub badges
│   │   ├── Navigation.tsx            # Main tab navigation
│   │   ├── DashboardView.tsx         # Metric overview & recent decisions
│   │   ├── AskWhyView.tsx            # Main Ask WHY query engine & cited answer
│   │   ├── DecisionGraphView.tsx     # Interactive SVG topological decision graph
│   │   ├── EvidenceView.tsx          # Searchable primary evidence explorer
│   │   ├── RepoAnalysisView.tsx      # GitHub repository reader, ADR editor & analyzer
│   │   ├── ProjectSourcesView.tsx    # Connected repository sources dashboard
│   │   ├── HistoryView.tsx           # Session audit log & export (.md / .json)
│   │   ├── SettingsView.tsx          # Health check, citation policy & credits
│   │   ├── BobHubModal.tsx           # IBM Bob 2.0 development showcase modal
│   │   ├── GitHubConnectModal.tsx    # GitHub OAuth & PAT connection modal
│   │   ├── EvidenceModal.tsx         # Full-document inspector & markdown export
│   │   └── DemoScriptModal.tsx       # 2-minute hackathon judge walkthrough script
│   ├── data/
│   │   └── sampleDataset.ts          # Core repository evidence & preset decisions
│   ├── services/
│   │   └── queryEngine.ts            # Grounded query & citation retrieval engine
│   ├── types/
│   │   └── decision.ts               # Strict TypeScript interfaces
│   ├── App.tsx                       # Root full-stack application component
│   ├── index.css                     # Tailwind styling & typography
│   └── main.tsx                      # React DOM entry point
├── data/
│   └── knowledge_base.json           # Raw structured JSON knowledge base
├── bob_sessions/                     # Authentic IBM Bob 2.0 development session logs
├── server.ts                         # Express API backend & GitHub OAuth server
├── package.json                      # Dependencies and scripts
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── LICENSE                           # Apache-2.0 License
└── README.md                         # Project documentation
```

---

## ⚡ How to Run Locally

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation

```bash
# 1. Clone repository
git clone https://github.com/cloudscale-infra/decision-memory-ai.git
cd decision-memory-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for demo mode)
cp .env.example .env

# 4. Start full-stack dev server
npm run dev

# 5. Open browser at http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## 🏆 Hackathon Credits

- **Hackathon**: **LABLAB.AI × IBM BOB 2.0 HACKATHON 2026**
- **Project**: Decision Memory AI
- **Tagline**: “Ask WHY. Get the Decision. See the Evidence.”
- **Development Partner**: IBM Bob 2.0
- **AI Prototype**: Google AI Studio / Gemini API
