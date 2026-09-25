import { EvidenceSource, DecisionAnswer, PresetDemoQuestion, ProjectSourceStats } from '../types/decision';

export const DEMO_PROJECT_STATS: ProjectSourceStats = {
  repositoryName: 'cloudscale-infra/core-api',
  branch: 'main',
  gitCommitsCount: 1420,
  pullRequestsCount: 388,
  issuesCount: 512,
  architectureDocsCount: 24,
  lastSynced: '2026-09-24T18:40:00Z',
  status: 'Demo Data',
};

export const PRESET_QUESTIONS: PresetDemoQuestion[] = [
  {
    id: 'redis',
    question: 'Why was Redis chosen for caching?',
    topic: 'Caching & State',
    keyTech: 'Redis vs Memcached',
    previewSummary: 'Selected for in-memory sub-millisecond lookups, cluster pub/sub invalidation, and data persistence guarantees.',
  },
  {
    id: 'postgres',
    question: 'Why was PostgreSQL selected over MongoDB?',
    topic: 'Primary Database',
    keyTech: 'PostgreSQL vs MongoDB',
    previewSummary: 'Chosen for strict ACID transactional consistency, multi-table billing foreign key constraints, and mature connection pooling.',
  },
  {
    id: 'jwt',
    question: 'Why was stateless JWT rejected for session storage?',
    topic: 'Authentication & Security',
    keyTech: 'Opaque Session Tokens vs JWT',
    previewSummary: 'Rejected due to the inability to immediately revoke tokens upon user logout or password compromise without a centralized blacklist.',
  },
  {
    id: 'graphql',
    question: 'Why did we move from REST to GraphQL for the dashboard API?',
    topic: 'API Architecture',
    keyTech: 'GraphQL vs REST',
    previewSummary: 'Migrated to resolve severe mobile over-fetching and eliminate 12 sequential HTTP roundtrips over high-latency cellular connections.',
  },
  {
    id: 'rabbitmq',
    question: 'Why was Kafka rejected in favor of RabbitMQ for event queuing?',
    topic: 'Message Broker',
    keyTech: 'RabbitMQ vs Kafka',
    previewSummary: 'RabbitMQ was chosen for priority queues, dead-letter routing, and low operational overhead at current 5,000 msg/sec volume.',
  },
];

export const RAW_EVIDENCE_REPOSITORY: EvidenceSource[] = [
  // REDIS EVIDENCE
  {
    id: 'ev-redis-adr',
    sourceType: 'architecture_doc',
    reference: 'ADR-004',
    title: 'ADR-004: Distributed Cache Layer Evaluation (Redis vs Memcached)',
    author: 'Elena Rostova',
    authorRole: 'Principal Architect',
    date: '2025-06-15',
    url: 'https://github.com/cloudscale-infra/core-api/blob/main/docs/adr/004-distributed-cache.md',
    tags: ['caching', 'redis', 'memcached', 'performance', 'database'],
    excerpt: 'Decision: We adopt Redis Cluster as the distributed cache layer. Rationale: Redis provides required data structure primitives (hashes, sets for tag-based invalidation), active replication, and RDB/AOF snapshots needed to quickly repopulate cache after cold restarts. Memcached was evaluated but rejected due to lack of persistence and absent pub/sub channels for cache invalidation events.',
    fullContent: `# ADR-004: Distributed Cache Layer Evaluation
Date: 2025-06-15
Status: Accepted
Deciders: Elena Rostova (Principal Architect), Marcus Chen (Lead Backend), Sarah Jenkins (VP Eng)

## Context
Our read volume on user profile, session state, and organization billing quotas has grown 4x month-over-month. Relational database read replicas are facing 85% CPU saturation under peak traffic.

## Options Considered
1. **Redis (v7.2 cluster mode)**
   - Pros: Rich data types (hashes, sorted sets), native Pub/Sub for broadcast invalidation across API replicas, optional RDB persistence for fast cold-cache restoration.
   - Cons: Higher memory overhead per key compared to raw slab allocation.
2. **Memcached**
   - Pros: Simpler multi-threaded architecture, lightweight memory allocation.
   - Cons: No native persistence; if node crashes, 100% cache stampede hits primary DB; lacks pub/sub for invalidation notifications.

## Decision
Adopt Redis Cluster.
Memcached was rejected specifically because:
1. It does not provide persistent snapshots, which creates catastrophic thundering-herd risk during cache pod restarts.
2. It lacks pub/sub broadcasting to invalidate local L1 node in-memory caches upon database writes.`,
  },
  {
    id: 'ev-redis-pr',
    sourceType: 'pull_request',
    reference: 'PR #217',
    title: 'PR #217: feat(cache): introduce Redis cluster cache with 15m TTL & pub/sub invalidation',
    author: 'Marcus Chen',
    authorRole: 'Lead Backend Engineer',
    date: '2025-06-21',
    url: 'https://github.com/cloudscale-infra/core-api/pull/217',
    tags: ['caching', 'redis', 'performance'],
    excerpt: 'Marcus: "Benchmarks show Redis p99 response times at 1.8ms under 25,000 req/sec compared to 42ms direct to Postgres. Invalidation is broadcast via Redis channel \'cache:invalidate:entity\' so worker pods drop stale in-memory items in <5ms."',
    fullContent: `PR #217: feat(cache): introduce Redis cluster cache with 15m TTL & pub/sub invalidation
Merged by: Sarah Jenkins on 2025-06-22

Discussion summary:
@marcus-dev: "Adds ioredis client with cluster reconnect backoff, connection pooling, and circuit breaker. Benchmarks show Redis p99 response times at 1.8ms under 25,000 req/sec compared to 42ms direct to Postgres."
@sarah-tech-lead: "Have we confirmed memory limits and eviction policy?"
@marcus-dev: "Yes, maxmemory 16gb with volatile-lru eviction. Keys with explicit TTL are evicted first under memory pressure."
@elena-arch: "LGTM. Verified against ADR-004 criteria."`,
  },
  {
    id: 'ev-redis-commit',
    sourceType: 'git_commit',
    reference: 'Commit c7b8a1f',
    title: 'Commit c7b8a1f: feat(cache): add redis cache provider with failover handling',
    author: 'Marcus Chen',
    date: '2025-06-20',
    url: 'https://github.com/cloudscale-infra/core-api/commit/c7b8a1f492b0',
    tags: ['redis', 'cache', 'commit'],
    excerpt: 'Commit c7b8a1f adds RedisCacheProvider implementing ICacheService interface. Includes cluster slot discovery, fallback to Postgres on Redis timeout > 50ms, and Prometheus latency histogram metrics.',
    fullContent: `commit c7b8a1f492b0e9d1a8c7b8a1f302e8d91c2b5f0a
Author: Marcus Chen <marcus@cloudscale.internal>
Date:   Fri Jun 20 16:42:10 2025 -0700

    feat(cache): add redis cache provider with failover handling
    
    - Implements ICacheService using ioredis cluster mode
    - Graceful fallback: if Redis response > 50ms, query bypasses cache to primary DB
    - Added prometheus counter: cache_hits_total and cache_misses_total
    - Fixes #142`,
  },
  {
    id: 'ev-redis-issue',
    sourceType: 'issue',
    reference: 'Issue #142',
    title: 'Issue #142: High database latency during peak read traffic on user profile endpoints',
    author: 'Sarah Jenkins',
    authorRole: 'VP of Engineering',
    date: '2025-06-10',
    url: 'https://github.com/cloudscale-infra/core-api/issues/142',
    tags: ['performance', 'postgres', 'incident'],
    excerpt: 'Sarah: "During the 10 AM UTC traffic spike, p95 latency on /api/v1/users/me climbed to 850ms. Postgres read replicas reached maximum connection limits due to un-cached repetitive authorization checks."',
    fullContent: `Issue #142: High database latency during peak read traffic on user profile endpoints
Opened by: Sarah Jenkins on 2025-06-10
Status: Closed (Resolved by PR #217)

Description:
During the 10 AM UTC traffic spike, p95 latency on /api/v1/users/me climbed to 850ms. Postgres read replicas reached maximum connection limits due to un-cached repetitive authorization checks.
Action item: Implement distributed caching layer per architectural roadmap. ADR-004 created to evaluate Redis vs Memcached.`,
  },

  // POSTGRESQL EVIDENCE
  {
    id: 'ev-pg-adr',
    sourceType: 'architecture_doc',
    reference: 'ADR-002',
    title: 'ADR-002: Primary Store Selection (PostgreSQL vs MongoDB)',
    author: 'Elena Rostova',
    authorRole: 'Principal Architect',
    date: '2025-03-05',
    url: 'https://github.com/cloudscale-infra/core-api/blob/main/docs/adr/002-primary-database.md',
    tags: ['database', 'postgres', 'mongodb', 'acid', 'billing'],
    excerpt: 'Decision: Select PostgreSQL 16 as the primary data store. Rationale: The application core requires strict multi-table relational integrity (Organizations -> Workspaces -> Invoices -> LineItems) and ACID transactions for financial ledger balances. MongoDB was considered for document flexibility, but rejected due to high risk of data inconsistency during distributed multi-document updates and lack of native foreign key cascade constraints.',
    fullContent: `# ADR-002: Primary Store Selection (PostgreSQL vs MongoDB)
Date: 2025-03-05
Status: Accepted
Deciders: Elena Rostova, Marcus Chen, David Patel (Security Lead)

## Context
Designing the foundational data architecture for multi-tenant accounts, subscription billing, and RBAC permissions.

## Options Evaluated
1. **PostgreSQL 16 (AWS RDS Aurora Postgres)**
   - Strict relational schema with foreign key cascades
   - Native JSONB support for semi-structured metadata
   - Serializable & Read Committed transaction isolation levels
   - Mature ecosystem for migrations and connection pooling (PgBouncer)
2. **MongoDB v7**
   - Flexible document schemas
   - Easy horizontal sharding
   - Weak cross-collection transaction guarantees under high concurrency; lack of declarative relational constraints.

## Decision
PostgreSQL selected. MongoDB rejected because invoice and quota reconciliation requires atomic multi-table ledger balance changes that cannot tolerate eventual consistency anomalies.`,
  },
  {
    id: 'ev-pg-pr',
    sourceType: 'pull_request',
    reference: 'PR #98',
    title: 'PR #98: feat(db): establish PostgreSQL connection pool and Drizzle schema migrations',
    author: 'Elena Rostova',
    authorRole: 'Principal Architect',
    date: '2025-03-14',
    url: 'https://github.com/cloudscale-infra/core-api/pull/98',
    tags: ['postgres', 'database', 'migrations'],
    excerpt: 'Elena: "Initializes Aurora Postgres connection pooling with PgBouncer max 120 clients. Configured transaction isolation to Read Committed with strict foreign key constraints across organizations and billing ledgers."',
    fullContent: `PR #98: feat(db): establish PostgreSQL connection pool and Drizzle schema migrations
Merged by: Marcus Chen on 2025-03-15

@elena-arch: "Implements core database layer per ADR-002. Includes foreign keys on delete restrict for billing accounts to prevent accidental orphaned financial records."
@david-sec: "Verified audit triggers and SSL connection enforcement (sslmode=require). Approved."`,
  },
  {
    id: 'ev-pg-commit',
    sourceType: 'git_commit',
    reference: 'Commit 3e4b892',
    title: 'Commit 3e4b892: chore(db): initialize postgres schema with foreign key cascades',
    author: 'Elena Rostova',
    date: '2025-03-12',
    url: 'https://github.com/cloudscale-infra/core-api/commit/3e4b89201a4e',
    tags: ['postgres', 'schema', 'commit'],
    excerpt: 'Commit 3e4b892 creates initial DDL schema for Postgres with organization and tenant isolation tables, composite unique indices, and ACID audit triggers.',
    fullContent: `commit 3e4b89201a4e57b98c3e4b89270df81e23a54b91
Author: Elena Rostova <elena@cloudscale.internal>
Date:   Wed Mar 12 11:20:44 2025 -0700

    chore(db): initialize postgres schema with foreign key cascades
    
    - Created organizations, users, memberships, and billing_ledgers tables
    - Enforced ON DELETE RESTRICT on billing_ledgers
    - Added JSONB columns for extensible workspace preferences
    - Closes #88`,
  },
  {
    id: 'ev-pg-issue',
    sourceType: 'issue',
    reference: 'Issue #88',
    title: 'Issue #88: Evaluate database choices for transactional billing & audit integrity',
    author: 'David Patel',
    authorRole: 'Security Lead',
    date: '2025-02-28',
    url: 'https://github.com/cloudscale-infra/core-api/issues/88',
    tags: ['security', 'compliance', 'database'],
    excerpt: 'David: "SOC2 compliance audit requires verifiable transaction logs and referential integrity across all billing actions. We cannot allow orphaned user or credit records."',
    fullContent: `Issue #88: Evaluate database choices for transactional billing & audit integrity
Opened by: David Patel on 2025-02-28
Status: Closed (Resolved by ADR-002 & PR #98)

Details:
SOC2 Type II compliance audit requirement: All debit and credit movements across multi-tenant accounts must occur in serialized ACID transactions. Document databases without native referential constraints failed preliminary security assessment.`,
  },

  // AUTH / JWT EVIDENCE
  {
    id: 'ev-auth-adr',
    sourceType: 'architecture_doc',
    reference: 'ADR-007',
    title: 'ADR-007: Authentication Strategy (Stateless JWT vs Redis-backed Opaque Session Tokens)',
    author: 'David Patel',
    authorRole: 'Security Lead',
    date: '2025-09-02',
    url: 'https://github.com/cloudscale-infra/core-api/blob/main/docs/adr/007-auth-sessions.md',
    tags: ['auth', 'jwt', 'security', 'redis', 'sessions'],
    excerpt: 'Decision: Use opaque crypto-random session tokens validated against Redis with 7-day sliding expiration. Stateless JWTs were explicitly rejected because enterprise customers require immediate session revocation upon SSO logout, password reset, or privilege revocation. Stateless JWTs cannot be invalidated prior to expiry without maintaining a distributed blocklist, which nullifies their stateless benefit.',
    fullContent: `# ADR-007: Authentication Strategy
Date: 2025-09-02
Status: Accepted
Deciders: David Patel (Security Lead), Sarah Jenkins (VP Eng), Elena Rostova

## Context
Engineering must standardize API authentication for web SPA, mobile clients, and enterprise SAML/SSO integrations.

## Options Considered
1. **Stateless JWT (JSON Web Tokens)**
   - Self-contained claims, verified via public key without DB lookup.
   - Flaw: Impossible to invalidate an individual token if an employee is terminated or laptop is stolen before JWT exp timestamp.
   - A distributed revocation blacklist requires Redis lookup on every request anyway, negating stateless performance advantages.
2. **Opaque Session Tokens + Redis Session Store**
   - High-entropy random token (256-bit) passed in Bearer header.
   - Redis cluster holds session payload (user_id, org_id, permissions).
   - Immediate revocation supported via single DEL command.

## Decision
Adopt opaque session tokens stored in Redis.
Stateless JWT rejected for authorization storage due to critical enterprise compliance requirement for instant session kill-switches.`,
  },
  {
    id: 'ev-auth-pr',
    sourceType: 'pull_request',
    reference: 'PR #341',
    title: 'PR #341: refactor(auth): switch token verification from stateless JWT to Redis session store',
    author: 'David Patel',
    authorRole: 'Security Lead',
    date: '2025-09-12',
    url: 'https://github.com/cloudscale-infra/core-api/pull/341',
    tags: ['auth', 'security', 'redis'],
    excerpt: 'David: "Replaces JWT verify middleware with Redis lookup. Token lookup takes 0.6ms on average. Instant logout endpoint /api/v1/auth/revoke-all now invalidates all active sessions for a user instantly in <2ms."',
    fullContent: `PR #341: refactor(auth): switch token verification from stateless JWT to Redis session store
Merged by: Sarah Jenkins on 2025-09-14

@david-sec: "Implements ADR-007. Removes jwt-decode library from backend. Provides session revocation endpoint needed for Okta SSO webhook."
@sarah-tech-lead: "Tested against 10,000 concurrent sessions in staging; Redis CPU increased by less than 2%."`,
  },
  {
    id: 'ev-auth-commit',
    sourceType: 'git_commit',
    reference: 'Commit 8a9f24e',
    title: 'Commit 8a9f24e: fix(auth): revoke session in redis on logout endpoint',
    author: 'David Patel',
    date: '2025-09-14',
    url: 'https://github.com/cloudscale-infra/core-api/commit/8a9f24e1837a',
    tags: ['auth', 'redis', 'security'],
    excerpt: 'Commit 8a9f24e implements instant key deletion in Redis upon user logout and broadcasts invalidation event to active WebSocket connections.',
    fullContent: `commit 8a9f24e1837acb76548a9f24ee189b27415a7702
Author: David Patel <david@cloudscale.internal>
Date:   Sun Sep 14 14:15:33 2025 -0700

    fix(auth): revoke session in redis on logout endpoint
    
    - Implemented DEL session:<token> in Redis
    - Emits websocket event to force client tab reload
    - Closes #289`,
  },
  {
    id: 'ev-auth-issue',
    sourceType: 'issue',
    reference: 'Issue #289',
    title: 'Issue #289: Security review: stateless JWT tokens cannot be instantly revoked upon password reset',
    author: 'David Patel',
    authorRole: 'Security Lead',
    date: '2025-08-25',
    url: 'https://github.com/cloudscale-infra/core-api/issues/289',
    tags: ['security', 'vulnerability', 'auth'],
    excerpt: 'David: "Penetration testing identified that changing a user password or revoking org membership leaves existing JWT tokens valid for up to 24 hours. Must move to server-revocable sessions."',
    fullContent: `Issue #289: Security review: stateless JWT tokens cannot be instantly revoked upon password reset
Opened by: David Patel on 2025-08-25
Status: Closed (Resolved by ADR-007 and PR #341)

Penetration test finding:
Stateless JWT tokens with 24-hour expiration created a severe security vulnerability. Compromised tokens remained valid even after the user performed a password reset. Recommending migration to Redis-backed revocable sessions.`,
  },

  // GRAPHQL EVIDENCE
  {
    id: 'ev-gql-adr',
    sourceType: 'architecture_doc',
    reference: 'ADR-011',
    title: 'ADR-011: Dashboard API Gateway (GraphQL Federation vs REST Endpoints)',
    author: 'Marcus Chen',
    authorRole: 'Lead Backend Engineer',
    date: '2025-10-22',
    url: 'https://github.com/cloudscale-infra/core-api/blob/main/docs/adr/011-dashboard-graphql.md',
    tags: ['graphql', 'rest', 'api', 'mobile', 'frontend'],
    excerpt: 'Decision: Adopt GraphQL as an aggregation layer for the web dashboard and mobile apps, keeping internal microservices RESTful. Rationale: The overview dashboard previously required 12 individual REST requests (user, org, usage metrics, billing, team members, notifications), causing slow time-to-interactive (TTI > 3.4s on 4G networks) due to mobile network roundtrips. GraphQL allows fetching the exact dashboard payload in a single roundtrip with DataLoader deduplication.',
    fullContent: `# ADR-011: Dashboard API Gateway
Date: 2025-10-22
Status: Accepted
Deciders: Marcus Chen, Elena Rostova, Chloe Kim (Lead Frontend)

## Context
Mobile and web client performance on the main dashboard is degraded due to waterfall REST API calls.

## Options Considered
1. **Bespoke Composite REST Endpoint (/api/v1/dashboard-summary)**
   - Hardcoded to current UI requirements; brittle and requires backend changes for every UI component modification.
2. **GraphQL Aggregation Gateway**
   - Client specifies precise shape; single HTTP request; eliminates over-fetching; uses DataLoader to batch downstream SQL and internal REST calls.

## Decision
Adopt GraphQL Gateway for client-facing dashboards.
Bespoke REST was rejected because frontend iteration velocity was bottlenecked by constant backend endpoint patch PRs.`,
  },
  {
    id: 'ev-gql-pr',
    sourceType: 'pull_request',
    reference: 'PR #412',
    title: 'PR #412: feat(api): implement GraphQL aggregator gateway for dashboard metrics',
    author: 'Marcus Chen',
    authorRole: 'Lead Backend Engineer',
    date: '2025-11-01',
    url: 'https://github.com/cloudscale-infra/core-api/pull/412',
    tags: ['graphql', 'api', 'performance'],
    excerpt: 'Marcus: "Dashboard load network roundtrips dropped from 12 HTTP calls to 1 single POST /graphql query. Over-the-wire payload reduced by 68% from 420KB to 134KB. P95 dashboard render dropped from 3.2s to 640ms."',
    fullContent: `PR #412: feat(api): implement GraphQL aggregator gateway for dashboard metrics
Merged by: Elena Rostova on 2025-11-04

@marcus-dev: "Introduces Apollo Server Express middleware with Dataloader caching for user, workspace, and billing subgraphs."
@chloe-frontend: "Verified on iOS and Android test builds; network waterfalls eliminated completely. Approving."`,
  },
  {
    id: 'ev-gql-commit',
    sourceType: 'git_commit',
    reference: 'Commit d2c91b8',
    title: 'Commit d2c91b8: feat(graphql): add schema stitching for unified dashboard query',
    author: 'Marcus Chen',
    date: '2025-11-03',
    url: 'https://github.com/cloudscale-infra/core-api/commit/d2c91b847120',
    tags: ['graphql', 'schema', 'commit'],
    excerpt: 'Commit d2c91b8 wires GraphQL query resolvers to internal REST microservices with DataLoader batching to prevent N+1 query overhead.',
    fullContent: `commit d2c91b8471203b58e7d2c91b802a45e998124c61
Author: Marcus Chen <marcus@cloudscale.internal>
Date:   Mon Nov 3 17:30:12 2025 -0800

    feat(graphql): add schema stitching for unified dashboard query
    
    - Created schema for DashboardSummary, OrgMetrics, and MemberActivity
    - Added DataLoader batching for PostgreSQL user queries
    - Fixes #377`,
  },
  {
    id: 'ev-gql-issue',
    sourceType: 'issue',
    reference: 'Issue #377',
    title: 'Issue #377: Mobile client experiencing 12 sequential HTTP calls to render dashboard home',
    author: 'Chloe Kim',
    authorRole: 'Lead Frontend Engineer',
    date: '2025-10-15',
    url: 'https://github.com/cloudscale-infra/core-api/issues/377',
    tags: ['mobile', 'performance', 'frontend'],
    excerpt: 'Chloe: "Profiling the dashboard initial load shows 12 network waterfalls. On 3G/4G connections, users experience blank skeleton cards for over 3 seconds. Need a unified aggregation strategy."',
    fullContent: `Issue #377: Mobile client experiencing 12 sequential HTTP calls to render dashboard home
Opened by: Chloe Kim on 2025-10-15
Status: Closed (Resolved by ADR-011 and PR #412)

Details:
Mobile clients must fetch:
1. /api/v1/users/me
2. /api/v1/orgs/current
3. /api/v1/orgs/current/members
4. /api/v1/billing/usage
5. /api/v1/billing/limits
6. /api/v1/projects
7. /api/v1/notifications/unread
... plus 5 more widget queries. Waterfall network latency is unacceptably slow.`,
  },

  // RABBITMQ EVIDENCE
  {
    id: 'ev-mq-adr',
    sourceType: 'architecture_doc',
    reference: 'ADR-009',
    title: 'ADR-009: Asynchronous Message Broker (RabbitMQ vs Apache Kafka)',
    author: 'Elena Rostova',
    authorRole: 'Principal Architect',
    date: '2025-07-01',
    url: 'https://github.com/cloudscale-infra/core-api/blob/main/docs/adr/009-message-broker.md',
    tags: ['queue', 'rabbitmq', 'kafka', 'messaging', 'architecture'],
    excerpt: 'Decision: Choose RabbitMQ (AMQP 0-9-1) as our primary asynchronous message broker. Rationale: Our workload consists of task processing (email dispatch, PDF export, video transcoding, webhook notifications) that requires per-message acknowledgments, dead-letter exchanges (DLX) for failed retries, and priority queues. Apache Kafka was evaluated but rejected due to the operational complexity of managing ZooKeeper/KRaft clusters, lack of individual message ACK/retry semantics, and overkill for our current volume of ~5,000 messages/sec.',
    fullContent: `# ADR-009: Asynchronous Message Broker (RabbitMQ vs Apache Kafka)
Date: 2025-07-01
Status: Accepted
Deciders: Elena Rostova, Marcus Chen, DevOps Team

## Context
We need a message broker for background job processing, event routing between worker services, and external webhook delivery with retry backoff.

## Options Considered
1. **RabbitMQ**
   - Native dead-letter exchanges (DLX) and delayed message exchange plugin
   - Flexible routing keys (direct, topic, fanout)
   - Fine-grained per-message acknowledgment
   - Low infrastructure overhead (single-node or 3-node HA cluster)
2. **Apache Kafka**
   - High-throughput stream log (millions msg/sec)
   - Consumer group offset tracking
   - Replay capability
   - Rejected because: Retrying a single poison pill message requires complex dead-letter topic re-routing; lacks native priority queueing; operational overhead of managing Kafka partitions is unjustified for 5,000 msg/sec.

## Decision
Adopt RabbitMQ. Kafka was rejected because our workload is discrete task processing with DLX retries, not high-volume real-time event streaming.`,
  },
  {
    id: 'ev-mq-pr',
    sourceType: 'pull_request',
    reference: 'PR #184',
    title: 'PR #184: feat(queue): integrate RabbitMQ message broker with DLX policy',
    author: 'Marcus Chen',
    authorRole: 'Lead Backend Engineer',
    date: '2025-07-06',
    url: 'https://github.com/cloudscale-infra/core-api/pull/184',
    tags: ['queue', 'rabbitmq', 'events'],
    excerpt: 'Marcus: "Configures amqplib connection manager with auto-reconnect, dead-letter routing to \'tasks.dlx\' after 3 failed delivery attempts, and prefetch count 50 to prevent consumer memory starvation."',
    fullContent: `PR #184: feat(queue): integrate RabbitMQ message broker with DLX policy
Merged by: Sarah Jenkins on 2025-07-09

@marcus-dev: "Sets up RabbitMQ topic exchanges and worker consumer loops. Poison-pill messages route to dead-letter queue with exponential backoff."
@elena-arch: "Verified compliance with ADR-009. Prefetch configuration looks solid."`,
  },
  {
    id: 'ev-mq-commit',
    sourceType: 'git_commit',
    reference: 'Commit 5f1e820',
    title: 'Commit 5f1e820: perf(queue): configure rabbitmq prefetch count to 50',
    author: 'Marcus Chen',
    date: '2025-07-08',
    url: 'https://github.com/cloudscale-infra/core-api/commit/5f1e8203c9a1',
    tags: ['queue', 'rabbitmq', 'commit'],
    excerpt: 'Commit 5f1e820 optimizes RabbitMQ consumer throughput by tuning channel prefetch window and binding dead-letter exchange policies.',
    fullContent: `commit 5f1e8203c9a1876543b5f1e82098234190283719
Author: Marcus Chen <marcus@cloudscale.internal>
Date:   Tue Jul 8 13:11:55 2025 -0700

    perf(queue): configure rabbitmq prefetch count to 50
    
    - Prevents single worker from monopolizing queued jobs
    - Configured x-dead-letter-exchange for webhook dispatch queue
    - Closes #165`,
  },
  {
    id: 'ev-mq-issue',
    sourceType: 'issue',
    reference: 'Issue #165',
    title: 'Issue #165: Need reliable async event queue with immediate message retry & dead letter routing',
    author: 'Sarah Jenkins',
    authorRole: 'VP of Engineering',
    date: '2025-06-25',
    url: 'https://github.com/cloudscale-infra/core-api/issues/165',
    tags: ['architecture', 'queue', 'reliability'],
    excerpt: 'Sarah: "Webhook failures to customer endpoints are blocking the main request worker threads. We need an asynchronous broker with dead-letter queueing to isolate retry bursts."',
    fullContent: `Issue #165: Need reliable async event queue with immediate message retry & dead letter routing
Opened by: Sarah Jenkins on 2025-06-25
Status: Closed (Resolved by ADR-009 & PR #184)

Problem statement:
Customer webhook endpoints frequently return 500 or timeout, blocking sync HTTP workers. We require a distributed task queue with retry exponential backoff and dead-letter queue routing.`,
  },
];

export const PRESET_DECISION_ANSWERS: Record<string, DecisionAnswer> = {
  redis: {
    id: 'ans-redis',
    question: 'Why was Redis chosen for caching?',
    decision: 'Redis Cluster was chosen as the primary distributed cache and cache invalidation broker.',
    reason: 'Redis provides sub-2ms p99 latency under 25,000 req/sec, rich native data structures (hashes, sets) for granular cache tagging, RDB/AOF persistence to prevent thundering-herd cache stampedes during pod restarts, and Pub/Sub channels to broadcast invalidations to API replica L1 caches.',
    alternatives: ['Memcached (evaluated)', 'In-memory local Node.js Maps only (evaluated)', 'Direct PostgreSQL read replicas (status quo)'],
    rejectedOptions: [
      {
        option: 'Memcached',
        reason: 'Rejected because it lacks native persistence (leading to catastrophic thundering-herd DB traffic on pod restarts) and lacks Pub/Sub channels to coordinate cache invalidations across cluster nodes.',
        evidenceRef: 'ADR-004',
      },
      {
        option: 'Direct PostgreSQL read replicas',
        reason: 'Rejected because read replicas reached 85% CPU saturation during 10 AM traffic peaks, with p95 query latency spiking to 850ms.',
        evidenceRef: 'Issue #142',
      },
    ],
    context: 'In June 2025, user profile and quota check traffic grew 4x month-over-month. Database read replicas reached maximum connection limits under authorization check loads.',
    timeline: [
      { step: 'Identified Issue', date: '2025-06-10', description: 'Issue #142 opened: High database latency during peak traffic spikes.', actor: 'Sarah Jenkins', sourceRef: 'Issue #142' },
      { step: 'Architectural Evaluation', date: '2025-06-15', description: 'ADR-004 drafted comparing Redis Cluster vs Memcached.', actor: 'Elena Rostova', sourceRef: 'ADR-004' },
      { step: 'Implementation Commit', date: '2025-06-20', description: 'Commit c7b8a1f added RedisCacheProvider with circuit breaker.', actor: 'Marcus Chen', sourceRef: 'Commit c7b8a1f' },
      { step: 'Pull Request Review', date: '2025-06-21', description: 'PR #217 opened and benchmarked: p99 latency dropped from 42ms to 1.8ms.', actor: 'Marcus Chen', sourceRef: 'PR #217' },
      { step: 'Merged & Deployed', date: '2025-06-22', description: 'PR #217 merged to main branch and deployed to production cluster.', actor: 'Sarah Jenkins', sourceRef: 'PR #217' },
    ],
    evidence: RAW_EVIDENCE_REPOSITORY.filter(e => e.tags.includes('redis')),
    confidence: 'high',
    sourcesChecked: ['ADR-004', 'PR #217', 'Commit c7b8a1f', 'Issue #142'],
    isInsufficientEvidence: false,
    generatedAt: '2026-09-25T09:14:00Z',
    modelUsed: 'Decision Memory AI / Grounded Knowledge Engine',
    graph: {
      nodes: [
        { id: 'node-dec', label: 'Adopt Redis Cluster', type: 'decision', detail: 'Chosen for distributed caching layer' },
        { id: 'node-rea-perf', label: '1.8ms p99 Latency & Pub/Sub', type: 'reason', detail: 'Sub-millisecond reads & instant invalidation broadcast' },
        { id: 'node-rea-pers', label: 'RDB Persistence', type: 'reason', detail: 'Prevents cold-start cache stampedes' },
        { id: 'node-alt-mem', label: 'Memcached', type: 'alternative', detail: 'High-performance multi-threaded memory cache' },
        { id: 'node-rej-mem', label: 'Rejected: No Persistence & No Pub/Sub', type: 'rejected_option', detail: 'High risk of thundering-herd DB failure' },
        { id: 'node-pr', label: 'PR #217', type: 'pull_request', detail: 'feat(cache): introduce Redis cluster cache', sourceRef: 'PR #217' },
        { id: 'node-commit', label: 'Commit c7b8a1f', type: 'commit', detail: 'feat(cache): add redis cache provider', sourceRef: 'Commit c7b8a1f' },
        { id: 'node-issue', label: 'Issue #142', type: 'issue', detail: 'High database latency during peak reads', sourceRef: 'Issue #142' },
        { id: 'node-doc', label: 'ADR-004', type: 'document', detail: 'Distributed Cache Layer Evaluation', sourceRef: 'ADR-004' },
        { id: 'node-author-elena', label: 'Elena Rostova', type: 'person', detail: 'Principal Architect (Authored ADR-004)' },
        { id: 'node-author-marcus', label: 'Marcus Chen', type: 'person', detail: 'Lead Backend Engineer (PR #217)' },
      ],
      edges: [
        { source: 'node-dec', target: 'node-rea-perf', label: 'justified by', type: 'caused_by' },
        { source: 'node-dec', target: 'node-rea-pers', label: 'justified by', type: 'caused_by' },
        { source: 'node-dec', target: 'node-alt-mem', label: 'evaluated against', type: 'caused_by' },
        { source: 'node-alt-mem', target: 'node-rej-mem', label: 'resulted in', type: 'rejected_for' },
        { source: 'node-dec', target: 'node-doc', label: 'formally specified in', type: 'documented_in' },
        { source: 'node-doc', target: 'node-author-elena', label: 'written by', type: 'decided_by' },
        { source: 'node-dec', target: 'node-pr', label: 'implemented via', type: 'committed_in' },
        { source: 'node-pr', target: 'node-author-marcus', label: 'authored by', type: 'decided_by' },
        { source: 'node-pr', target: 'node-commit', label: 'contains commit', type: 'committed_in' },
        { source: 'node-issue', target: 'node-doc', label: 'prompted', type: 'progressed_to' },
      ],
    },
  },
  postgres: {
    id: 'ans-postgres',
    question: 'Why was PostgreSQL selected over MongoDB?',
    decision: 'PostgreSQL 16 on AWS RDS Aurora was selected as the foundational relational primary data store.',
    reason: 'The application core handles multi-tenant subscription billing, ledger transactions, and complex RBAC. PostgreSQL provides strict ACID guarantees, declarative foreign key cascades (ON DELETE RESTRICT on billing accounts), and mature transaction isolation, alongside JSONB for semi-structured workspace data.',
    alternatives: ['MongoDB v7 Document Database (evaluated)', 'MySQL 8.0 (evaluated)'],
    rejectedOptions: [
      {
        option: 'MongoDB',
        reason: 'Rejected due to weak cross-collection transaction guarantees under high concurrency, lack of native referential constraint cascades, and unacceptable compliance risk for SOC2 billing integrity audits.',
        evidenceRef: 'ADR-002',
      },
    ],
    context: 'In March 2025 during foundational architecture planning, SOC2 compliance audit mandated zero orphaned billing records and verifiable ACID transactional history.',
    timeline: [
      { step: 'Compliance Review', date: '2025-02-28', description: 'Issue #88 opened: SOC2 requirement for atomic billing ledger integrity.', actor: 'David Patel', sourceRef: 'Issue #88' },
      { step: 'Architectural Selection', date: '2025-03-05', description: 'ADR-002 signed: PostgreSQL selected; MongoDB rejected.', actor: 'Elena Rostova', sourceRef: 'ADR-002' },
      { step: 'Schema Initialized', date: '2025-03-12', description: 'Commit 3e4b892: DDL schema with foreign key cascades.', actor: 'Elena Rostova', sourceRef: 'Commit 3e4b892' },
      { step: 'Connection Pool PR', date: '2025-03-14', description: 'PR #98: Aurora Postgres connection pooling with PgBouncer.', actor: 'Elena Rostova', sourceRef: 'PR #98' },
    ],
    evidence: RAW_EVIDENCE_REPOSITORY.filter(e => e.tags.includes('postgres')),
    confidence: 'high',
    sourcesChecked: ['ADR-002', 'PR #98', 'Commit 3e4b892', 'Issue #88'],
    isInsufficientEvidence: false,
    generatedAt: '2026-09-25T09:14:00Z',
    modelUsed: 'Decision Memory AI / Grounded Knowledge Engine',
    graph: {
      nodes: [
        { id: 'node-dec-pg', label: 'Select PostgreSQL 16', type: 'decision', detail: 'Aurora Postgres primary datastore' },
        { id: 'node-rea-acid', label: 'Strict ACID & Foreign Keys', type: 'reason', detail: 'Required for SOC2 billing ledger integrity' },
        { id: 'node-rea-jsonb', label: 'JSONB Hybrid Capabilities', type: 'reason', detail: 'Semi-structured workspace configs within relational bounds' },
        { id: 'node-alt-mongo', label: 'MongoDB v7', type: 'alternative', detail: 'Document-oriented database' },
        { id: 'node-rej-mongo', label: 'Rejected: No Declarative Constraints', type: 'rejected_option', detail: 'Risk of orphaned financial records and consistency anomalies' },
        { id: 'node-doc-pg', label: 'ADR-002', type: 'document', detail: 'Primary Store Selection', sourceRef: 'ADR-002' },
        { id: 'node-issue-pg', label: 'Issue #88', type: 'issue', detail: 'Transactional billing & audit integrity', sourceRef: 'Issue #88' },
        { id: 'node-pr-pg', label: 'PR #98', type: 'pull_request', detail: 'feat(db): establish connection pool', sourceRef: 'PR #98' },
        { id: 'node-commit-pg', label: 'Commit 3e4b892', type: 'commit', detail: 'chore(db): initialize postgres schema', sourceRef: 'Commit 3e4b892' },
      ],
      edges: [
        { source: 'node-dec-pg', target: 'node-rea-acid', label: 'demanded by', type: 'caused_by' },
        { source: 'node-dec-pg', target: 'node-rea-jsonb', label: 'supported by', type: 'caused_by' },
        { source: 'node-dec-pg', target: 'node-alt-mongo', label: 'evaluated against', type: 'caused_by' },
        { source: 'node-alt-mongo', target: 'node-rej-mongo', label: 'dismissed due to', type: 'rejected_for' },
        { source: 'node-dec-pg', target: 'node-doc-pg', label: 'formalized in', type: 'documented_in' },
        { source: 'node-issue-pg', target: 'node-doc-pg', label: 'triggered', type: 'progressed_to' },
        { source: 'node-dec-pg', target: 'node-pr-pg', label: 'implemented in', type: 'committed_in' },
        { source: 'node-pr-pg', target: 'node-commit-pg', label: 'contains commit', type: 'committed_in' },
      ],
    },
  },
  jwt: {
    id: 'ans-jwt',
    question: 'Why was stateless JWT rejected for session storage?',
    decision: 'Opaque 256-bit crypto session tokens stored in Redis were adopted; stateless JWTs were rejected.',
    reason: 'Enterprise security requirements (and SAML/SSO integrations) require an immediate kill-switch to invalidate active sessions upon user logout, password reset, or privilege revocation. Stateless JWTs cannot be revoked without maintaining a distributed token blacklist, which defeats the stateless benefit and requires a Redis lookup on every API call regardless.',
    alternatives: ['Stateless JWT with short expiration (15m) + refresh tokens', 'Database-backed sessions in PostgreSQL'],
    rejectedOptions: [
      {
        option: 'Stateless JWT',
        reason: 'Penetration testing identified that compromised tokens remained valid for up to 24 hours after password reset. Implementing a blacklist would re-introduce central lookup state without any of the architectural simplicity.',
        evidenceRef: 'ADR-007',
      },
    ],
    context: 'In August 2025, security audit issue #289 uncovered critical vulnerability where revoked users retained active API access. Enterprise clients demanded instant revocation support.',
    timeline: [
      { step: 'Vulnerability Discovered', date: '2025-08-25', description: 'Issue #289 opened: Penetration test identified inability to revoke JWTs.', actor: 'David Patel', sourceRef: 'Issue #289' },
      { step: 'Architecture Decision', date: '2025-09-02', description: 'ADR-007 formulated: Opaque session tokens in Redis selected.', actor: 'David Patel', sourceRef: 'ADR-007' },
      { step: 'Refactor PR', date: '2025-09-12', description: 'PR #341: Migrated token verification from JWT to Redis lookup (0.6ms).', actor: 'David Patel', sourceRef: 'PR #341' },
      { step: 'Revocation Verified', date: '2025-09-14', description: 'Commit 8a9f24e: Single DEL command revokes all user sessions in <2ms.', actor: 'David Patel', sourceRef: 'Commit 8a9f24e' },
    ],
    evidence: RAW_EVIDENCE_REPOSITORY.filter(e => e.tags.includes('auth') || e.tags.includes('jwt')),
    confidence: 'high',
    sourcesChecked: ['ADR-007', 'PR #341', 'Commit 8a9f24e', 'Issue #289'],
    isInsufficientEvidence: false,
    generatedAt: '2026-09-25T09:14:00Z',
    modelUsed: 'Decision Memory AI / Grounded Knowledge Engine',
    graph: {
      nodes: [
        { id: 'node-dec-auth', label: 'Adopt Redis Opaque Sessions', type: 'decision', detail: '256-bit random tokens with Redis backing' },
        { id: 'node-rea-revoke', label: 'Instant Session Revocation', type: 'reason', detail: 'Single DEL command invalidates stolen tokens in <2ms' },
        { id: 'node-alt-jwt', label: 'Stateless JWT Tokens', type: 'alternative', detail: 'Self-contained cryptographically signed tokens' },
        { id: 'node-rej-jwt', label: 'Rejected: No Revocation Without Blacklist', type: 'rejected_option', detail: 'Fails enterprise security audit for immediate kill-switch' },
        { id: 'node-doc-auth', label: 'ADR-007', type: 'document', detail: 'Authentication Strategy Evaluation', sourceRef: 'ADR-007' },
        { id: 'node-issue-auth', label: 'Issue #289', type: 'issue', detail: 'Security audit on JWT revocation vulnerability', sourceRef: 'Issue #289' },
        { id: 'node-pr-auth', label: 'PR #341', type: 'pull_request', detail: 'refactor(auth): switch to Redis session store', sourceRef: 'PR #341' },
        { id: 'node-commit-auth', label: 'Commit 8a9f24e', type: 'commit', detail: 'fix(auth): revoke session in redis on logout', sourceRef: 'Commit 8a9f24e' },
      ],
      edges: [
        { source: 'node-dec-auth', target: 'node-rea-revoke', label: 'required for', type: 'caused_by' },
        { source: 'node-dec-auth', target: 'node-alt-jwt', label: 'evaluated against', type: 'caused_by' },
        { source: 'node-alt-jwt', target: 'node-rej-jwt', label: 'eliminated because', type: 'rejected_for' },
        { source: 'node-issue-auth', target: 'node-doc-auth', label: 'prompted', type: 'progressed_to' },
        { source: 'node-doc-auth', target: 'node-pr-auth', label: 'governed', type: 'documented_in' },
        { source: 'node-pr-auth', target: 'node-commit-auth', label: 'includes', type: 'committed_in' },
      ],
    },
  },
  graphql: {
    id: 'ans-graphql',
    question: 'Why did we move from REST to GraphQL for the dashboard API?',
    decision: 'Adopted a GraphQL Federation gateway as an aggregation layer for web dashboard and mobile clients, while retaining internal REST microservices.',
    reason: 'The web and mobile dashboards suffered from severe client-side waterfall latency: rendering home screen required 12 individual REST requests (user, org, metrics, billing, notifications). On 4G/cellular networks, time-to-interactive exceeded 3.4 seconds. GraphQL collapsed all 12 requests into 1 single roundtrip, slashed over-the-wire payload by 68% (from 420KB to 134KB), and brought p95 render times down to 640ms.',
    alternatives: ['Bespoke Composite REST Endpoint (/api/v1/dashboard-summary)', 'HTTP/2 Server Push REST'],
    rejectedOptions: [
      {
        option: 'Bespoke Composite REST Endpoint',
        reason: 'Rejected because it tightly coupled backend endpoints to specific UI wireframes, creating a development bottleneck where every frontend component design change required a backend release.',
        evidenceRef: 'ADR-011',
      },
    ],
    context: 'In October 2025, mobile user retention dropped due to blank skeleton screens lasting >3 seconds over cellular connections (Issue #377).',
    timeline: [
      { step: 'Performance Bottleneck', date: '2025-10-15', description: 'Issue #377 opened: 12 sequential HTTP calls to render mobile home screen.', actor: 'Chloe Kim', sourceRef: 'Issue #377' },
      { step: 'Gateway Architecture', date: '2025-10-22', description: 'ADR-011 drafted: GraphQL aggregation layer with DataLoader batching.', actor: 'Marcus Chen', sourceRef: 'ADR-011' },
      { step: 'Gateway Implementation', date: '2025-11-01', description: 'PR #412 opened: Apollo Server gateway with 68% payload reduction.', actor: 'Marcus Chen', sourceRef: 'PR #412' },
      { step: 'Schema Stitching Commit', date: '2025-11-03', description: 'Commit d2c91b8: Unified DashboardSummary query with DataLoader batching.', actor: 'Marcus Chen', sourceRef: 'Commit d2c91b8' },
    ],
    evidence: RAW_EVIDENCE_REPOSITORY.filter(e => e.tags.includes('graphql')),
    confidence: 'high',
    sourcesChecked: ['ADR-011', 'PR #412', 'Commit d2c91b8', 'Issue #377'],
    isInsufficientEvidence: false,
    generatedAt: '2026-09-25T09:14:00Z',
    modelUsed: 'Decision Memory AI / Grounded Knowledge Engine',
    graph: {
      nodes: [
        { id: 'node-dec-gql', label: 'Adopt GraphQL Aggregator', type: 'decision', detail: 'Unified gateway for web & mobile clients' },
        { id: 'node-rea-single', label: '1 HTTP Roundtrip (vs 12)', type: 'reason', detail: 'Eliminated waterfall network delays' },
        { id: 'node-rea-payload', label: '68% Payload Reduction', type: 'reason', detail: 'Over-the-wire data cut from 420KB to 134KB' },
        { id: 'node-alt-bespoke', label: 'Bespoke /dashboard-summary REST', type: 'alternative', detail: 'Single custom endpoint tailored to current UI' },
        { id: 'node-rej-bespoke', label: 'Rejected: Brittle UI/Backend Coupling', type: 'rejected_option', detail: 'Requires backend deploy for every frontend widget change' },
        { id: 'node-doc-gql', label: 'ADR-011', type: 'document', detail: 'Dashboard API Gateway Decision', sourceRef: 'ADR-011' },
        { id: 'node-issue-gql', label: 'Issue #377', type: 'issue', detail: 'Mobile client 12 sequential HTTP calls', sourceRef: 'Issue #377' },
        { id: 'node-pr-gql', label: 'PR #412', type: 'pull_request', detail: 'feat(api): implement GraphQL aggregator gateway', sourceRef: 'PR #412' },
      ],
      edges: [
        { source: 'node-dec-gql', target: 'node-rea-single', label: 'solves latency via', type: 'caused_by' },
        { source: 'node-dec-gql', target: 'node-rea-payload', label: 'optimizes via', type: 'caused_by' },
        { source: 'node-dec-gql', target: 'node-alt-bespoke', label: 'preferred over', type: 'caused_by' },
        { source: 'node-alt-bespoke', target: 'node-rej-bespoke', label: 'ruled out by', type: 'rejected_for' },
        { source: 'node-issue-gql', target: 'node-doc-gql', label: 'instigated', type: 'progressed_to' },
        { source: 'node-doc-gql', target: 'node-pr-gql', label: 'guided', type: 'documented_in' },
      ],
    },
  },
  rabbitmq: {
    id: 'ans-rabbitmq',
    question: 'Why was Kafka rejected in favor of RabbitMQ for event queuing?',
    decision: 'RabbitMQ (AMQP 0-9-1) was chosen as the asynchronous message broker; Apache Kafka was evaluated and rejected.',
    reason: 'Our primary use case is task execution (email dispatches, PDF rendering, external webhook delivery) requiring individual message acknowledgments, priority queues, and automatic dead-letter exchanges (DLX) with exponential retry backoff. RabbitMQ provides these natively with lightweight operational overhead at our 5,000 msg/sec throughput. Kafka was rejected because it lacks individual message ACK semantics, requires complex dead-letter topic re-routing, and imposes disproportionate ZooKeeper/KRaft cluster maintenance overhead for simple job queuing.',
    alternatives: ['Apache Kafka (evaluated)', 'AWS SQS / SNS (evaluated)', 'Redis Pub/Sub (evaluated)'],
    rejectedOptions: [
      {
        option: 'Apache Kafka',
        reason: 'Rejected because its streaming commit-log model is tailored for append-only streaming rather than discrete task queuing. Retrying poison-pill messages requires complex multi-topic re-routing, and managing partition rebalances introduced unnecessary DevOps complexity for 5,000 msg/sec.',
        evidenceRef: 'ADR-009',
      },
      {
        option: 'Redis Pub/Sub',
        reason: 'Rejected because Redis Pub/Sub does not support persistent message durability or message acknowledgment; messages are lost if worker pods are offline.',
        evidenceRef: 'ADR-009',
      },
    ],
    context: 'In July 2025, external webhook timeouts were blocking HTTP worker threads (Issue #165), necessitating a dedicated asynchronous task queue with reliable DLX failure routing.',
    timeline: [
      { step: 'Worker Thread Exhaustion', date: '2025-06-25', description: 'Issue #165 opened: Webhook timeouts blocking core sync workers.', actor: 'Sarah Jenkins', sourceRef: 'Issue #165' },
      { step: 'Broker Decision', date: '2025-07-01', description: 'ADR-009 published: RabbitMQ adopted; Kafka rejected for task queues.', actor: 'Elena Rostova', sourceRef: 'ADR-009' },
      { step: 'Integration PR', date: '2025-07-06', description: 'PR #184: RabbitMQ setup with DLX routing after 3 retries.', actor: 'Marcus Chen', sourceRef: 'PR #184' },
      { step: 'Prefetch Tuning', date: '2025-07-08', description: 'Commit 5f1e820: Tuned prefetch window to 50 for optimal worker throughput.', actor: 'Marcus Chen', sourceRef: 'Commit 5f1e820' },
    ],
    evidence: RAW_EVIDENCE_REPOSITORY.filter(e => e.tags.includes('rabbitmq') || e.tags.includes('queue')),
    confidence: 'high',
    sourcesChecked: ['ADR-009', 'PR #184', 'Commit 5f1e820', 'Issue #165'],
    isInsufficientEvidence: false,
    generatedAt: '2026-09-25T09:14:00Z',
    modelUsed: 'Decision Memory AI / Grounded Knowledge Engine',
    graph: {
      nodes: [
        { id: 'node-dec-mq', label: 'Adopt RabbitMQ', type: 'decision', detail: 'AMQP 0-9-1 task queue with DLX' },
        { id: 'node-rea-dlx', label: 'Native DLX & Retries', type: 'reason', detail: 'Automatic dead-lettering for failed webhook dispatches' },
        { id: 'node-rea-ops', label: 'Low Operational Overhead', type: 'reason', detail: 'Ideal for 5k msg/sec without distributed log complexity' },
        { id: 'node-alt-kafka', label: 'Apache Kafka', type: 'alternative', detail: 'Distributed streaming commit-log platform' },
        { id: 'node-rej-kafka', label: 'Rejected: No Per-Message ACK & Ops Overhead', type: 'rejected_option', detail: 'Heavyweight partition management for discrete task queuing' },
        { id: 'node-doc-mq', label: 'ADR-009', type: 'document', detail: 'Asynchronous Message Broker Decision', sourceRef: 'ADR-009' },
        { id: 'node-issue-mq', label: 'Issue #165', type: 'issue', detail: 'Async event queue with DLX retry', sourceRef: 'Issue #165' },
        { id: 'node-pr-mq', label: 'PR #184', type: 'pull_request', detail: 'feat(queue): integrate RabbitMQ with DLX policy', sourceRef: 'PR #184' },
      ],
      edges: [
        { source: 'node-dec-mq', target: 'node-rea-dlx', label: 'fulfills', type: 'caused_by' },
        { source: 'node-dec-mq', target: 'node-rea-ops', label: 'benefits from', type: 'caused_by' },
        { source: 'node-dec-mq', target: 'node-alt-kafka', label: 'evaluated against', type: 'caused_by' },
        { source: 'node-alt-kafka', target: 'node-rej-kafka', label: 'declined due to', type: 'rejected_for' },
        { source: 'node-issue-mq', target: 'node-doc-mq', label: 'caused creation of', type: 'progressed_to' },
        { source: 'node-doc-mq', target: 'node-pr-mq', label: 'specified architecture for', type: 'documented_in' },
      ],
    },
  },
};
