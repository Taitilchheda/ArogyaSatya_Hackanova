# Agentic AI Hackathon Blueprint

## 1) Product Positioning

**One-liner:**  
ArogyaSatya is an agentic AI system that verifies healthcare claims across text, images, and videos using a coordinated team of specialized agents and evidence-backed reasoning.

**Hackathon objective:**  
Demonstrate autonomous, tool-using, multi-agent reasoning with explainable outcomes in a high-impact domain (health misinformation).

## 2) Core Problem

- Healthcare misinformation spreads quickly and in multiple formats.
- Single-model chatbots are weak at reliability, source-grounding, and repeatable workflows.
- Users need claim-level verdicts with evidence, not generic summaries.

## 3) Agentic System Design

### Agent roles
- `Safety Agent`: blocks unsafe or non-compliant requests before expensive inference.
- `Claim Extraction Agent`: decomposes input into atomic, verifiable claims.
- `VLM Agent`: extracts visual claims from medical images/memes/charts.
- `Canonicalization Agent`: maps semantically-similar claims to canonical narratives.
- `Evidence Retrieval Agent`: gathers supporting/refuting evidence from trusted sources.
- `PubMed Agent`: enriches evidence with biomedical references.
- `Verification Agent`: assigns verdict (`True/False/Unverified/Misleading`) with reasoning.
- `Explainer Agent`: composes final, user-facing report.
- `Video Processor Agent`: transcribes video/audio for downstream analysis.

### Coordination pattern
- Orchestration: `LangGraph StateGraph`
- Shared state: claim list, evidence map, image findings, safety flags, final report
- Dynamic routing: skip branches when unsafe/no claims/no images

## 4) Evaluation Plan (Judge-Friendly)

### Quantitative KPIs
- Claim extraction precision/recall on a labeled mini-set
- Evidence grounding rate: `% verdicts with at least one trusted citation`
- End-to-end latency: p50/p95 from input to final report
- Failure handling rate: `% cases with graceful fallback instead of crash`

### Qualitative KPIs
- Explainability score (clarity of verdict reasoning)
- Hallucination resistance (unsupported assertions flagged)
- Safety quality (ability to stop unsafe medical guidance patterns)

## 5) Demo Storyboard (5-7 Minutes)

1. Input one trending health claim from social/news content.
2. Show graph progression: extraction -> retrieval -> verification -> report.
3. Run one multimodal case (image or video URL).
4. Show canonicalization: repeated narrative maps to known claim cluster.
5. Show trend endpoint for recurring misinformation topics.
6. End with measurable outcomes (latency, grounding rate, sample accuracy).

## 6) Industry-Grade Checklist

- `.env.example` and explicit runtime profiles (local/dev/prod)
- Deterministic orchestration graph with clear node contracts
- Health endpoint + startup initialization path
- Persistent memory layers (SQL + vector DB)
- Security posture:
  - API keys in env only
  - CORS restricted to configured frontend origin
  - safety-gated execution before heavy agent chain
- Observability next step:
  - structured logs per node
  - per-node latency and token cost metrics

## 7) Post-Hackathon Roadmap

- Add async job queue for long-running video analyses
- Add claim-level confidence calibration and evaluator set
- Add provenance UI: clickable evidence-to-claim mapping
- Add RBAC + audit logs for moderation workflows
- Add CI gates for lint/tests/security checks
