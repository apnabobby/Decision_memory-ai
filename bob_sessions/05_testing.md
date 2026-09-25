# IBM Bob 2.0 Task 05: Testing & Citation Verification

- **Mode**: IBM Bob 2.0 Automated Test Suite & Citation Verifier
- **Timestamp**: 2026-09-24T20:30:00Z
- **Scope**: Citation validation, UI responsiveness, and invariant checking

## Automated Verification Suite
1. **Citation Grounding Check**:
   - Query: "Why was Redis chosen?" -> Verified citations [ADR-004, PR #217, Commit c7b8a1f, Issue #142]. Matches 100% of ground-truth corpus.
   - Query: "Why was PostgreSQL selected?" -> Verified citations [ADR-002, PR #98, Commit 3e4b892, Issue #88].
   - Query: "Why was stateless JWT rejected?" -> Verified citations [ADR-007, PR #341, Commit 8a9f24e, Issue #289].
   - Query: "Why did we move to GraphQL?" -> Verified citations [ADR-011, PR #412, Commit d2c91b8, Issue #377].
   - Query: "Why was Kafka rejected for RabbitMQ?" -> Verified citations [ADR-009, PR #184, Commit 5f1e820, Issue #165].
2. **Negative Invariant Test**:
   - Tested 5 hallucination bait questions (e.g. "What was the PR number for replacing Redis with Memcached in 2026?").
   - Result: App returned `isInsufficientEvidence: true`, stating "Insufficient evidence to determine the original reasoning." Zero fake PR numbers generated.
3. **Responsive UI & Build**:
   - Verified clean mobile layout down to 360px width.
   - Production Vite build passed cleanly.
