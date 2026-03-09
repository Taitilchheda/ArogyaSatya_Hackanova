# ArogyaSatya: Agentic AI for Healthcare Misinformation Verification

ArogyaSatya is a multi-agent system that verifies healthcare claims from text, images, and videos with evidence-backed reasoning.  
It is designed for Agentic AI hackathons: explicit orchestration, specialized agents, tool use, and explainable outcomes.

## Why This Is Agentic AI

- Uses a `LangGraph` state machine, not a single prompt-response call.
- Splits work into specialized agents with clear responsibilities.
- Applies conditional routing (safety gate, no-claim fast path, multimodal branches).
- Uses tool-augmented retrieval (web + PubMed + vector memory) before verdicts.
- Produces claim-level outputs with evidence and an explainer layer.

## Project Blueprint And Diagrams

- Blueprint: [docs/AGENTIC_BLUEPRINT.md](docs/AGENTIC_BLUEPRINT.md)
- Architecture and flow diagrams: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Core Capabilities

- Multi-agent claim verification pipeline
- Multimodal input support (text, image, video transcript)
- Canonical claim memory (vector deduplication)
- Trend analysis for repeated misinformation narratives
- FastAPI backend + Next.js frontend

## Repository Layout

- `app/agents/` agent implementations and graph orchestration
- `app/api/` REST endpoints
- `app/db/` SQLAlchemy models and DB session setup
- `app/core/` config, cleanup, caching, trends
- `app/scrapers/` ingestion connectors
- `app/` (Next.js app router files) + `components/` UI
- `docs/` architecture and hackathon blueprint

## Quick Start

### 1) Backend setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Set `GROQ_API_KEY` in `.env`.

Run backend:

```bash
uvicorn app.main:app --reload --port 8000
```

### 2) Frontend setup

```bash
npm install --legacy-peer-deps
# Optional: set explicitly if backend runs on non-default port
# PowerShell:
# $env:NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:9000"
npm run dev
```

Frontend: `http://localhost:3000`  
Backend API: `http://localhost:8000`

## API Endpoints

- `GET /api/health`
- `POST /api/trigger-scan`
- `GET /api/articles`
- `POST /api/analyze/{id}`
- `POST /api/analyze-text`
- `GET /api/trends`

## Environment Variables

Use [`.env.example`](.env.example) as template:

- `DATABASE_URL`
- `GROQ_API_KEY`
- `FRONTEND_ORIGINS`
- `ENABLE_SQL_ECHO`

## Hackathon Demo Flow

1. Ingest article or paste a viral claim.
2. Trigger analysis and show stepwise agent outputs.
3. Highlight evidence-backed verdicts and explanation.
4. Show trend clustering for repeated narratives.
5. Conclude with reliability + speed metrics.
