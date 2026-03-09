# ArogyaSatya Architecture

## 1) System Context (Deployment + Integrations)

```mermaid
flowchart LR
    user([User / Judge])

    subgraph client["Client Layer"]
        fe["Next.js Frontend\n(app/, components/)"]
    end

    subgraph platform["Application Layer"]
        api["FastAPI API\n(app/main.py, app/api/endpoints.py)"]
        orch["LangGraph Orchestrator\n(app/agents/agent_graph.py)"]
    end

    subgraph agents["Agent Runtime"]
        vp["Video Processor Agent"]
        sm["Safety Monitor Agent"]
        ce["Claim Extraction Agent"]
        vlm["Vision-Language Agent"]
        can["Canonicalization Agent"]
        er["Evidence Retrieval Agent"]
        pub["PubMed Agent"]
        ver["Verification Agent"]
        exp["Explainer Agent"]
    end

    subgraph storage["State + Memory"]
        sql[("SQL DB\n(raw_content, canonical_claims, claim_evidence)")]
        vdb[("Chroma Vector DB\n(claim embeddings)")]
    end

    subgraph external["External Intelligence"]
        groq["Groq LLM API"]
        trusted["Trusted Web Sources\n(CDC/WHO/PubMed/News)"]
        local["Local Models\n(Whisper, Moondream)"]
    end

    user --> fe --> api --> orch
    api <--> sql

    orch --> vp --> sm --> ce --> vlm --> can --> er --> pub --> ver --> exp

    can <--> vdb
    ce <--> groq
    ver <--> groq
    exp <--> groq
    er <--> trusted
    pub <--> trusted
    vp <--> local
    vlm <--> local
```

## 2) Agent Orchestration Graph (LangGraph Runtime)

```mermaid
flowchart TD
    start([START])
    input["Input State\n{text, images, article_id}"]

    vp["video_processor"]
    sm["safety_monitor"]
    safe{"is_safe?"}
    ce["claim_extraction"]
    claims{"claims_found?"}
    vlm["vlm_analysis"]
    can["canonicalization"]
    ret["evidence_retrieval"]
    pub["pubmed_search"]
    ver["verification"]
    exp["explainer"]
    endnode([END])

    start --> input --> vp --> sm --> safe

    safe -- "No (unsafe content)" --> exp
    safe -- "Yes" --> ce

    ce --> claims
    claims -- "No" --> exp
    claims -- "Yes" --> vlm

    vlm --> can --> ret --> pub --> ver --> exp --> endnode

    classDef gate fill:#fff4cc,stroke:#c88a00,color:#333,stroke-width:1px;
    class safe,claims gate;
```

## 3) End-to-End Request Sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Next.js Frontend
    participant API as FastAPI API
    participant G as LangGraph Orchestrator
    participant A as Agent Chain
    participant DB as SQL/Vector DB
    participant X as External Tools (Groq/Web/PubMed/Local Models)

    U->>FE: Submit text/article/video URL
    FE->>API: POST /api/analyze-text or /api/analyze/{id}
    API->>G: invoke(initial_state)

    G->>A: video_processor + safety_monitor
    alt Unsafe content
        A-->>G: safety_status = blocked
        G->>A: explainer(safety warning)
    else Safe
        G->>A: claim_extraction
        alt No claims extracted
            A-->>G: claims = []
            G->>A: explainer(no misinformation)
        else Claims extracted
            G->>A: vlm_analysis (if images)
            G->>A: canonicalization
            A->>DB: read/write canonical claims + embeddings
            G->>A: evidence_retrieval + pubmed_search
            A->>X: fetch evidence and references
            G->>A: verification + explainer
        end
    end

    G-->>API: final_state(report, verdicts, evidence)
    API->>DB: persist claims/evidence links
    API-->>FE: JSON response
    FE-->>U: Render explainable verdict report
```

## 4) Data Model

- `raw_content`: ingested input (text/media metadata/transcripts)
- `canonical_claims`: normalized claim memory and evolving verdict status
- `claim_evidence`: evidence snippets + support/refute polarity
- `claim_content_association`: many-to-many mapping between content and claims

## 5) Why This Is Agentic

- Explicit planner/executor graph (LangGraph), not single-shot prompting.
- Specialized role-based agents with distinct tools and outputs.
- Conditional control flow (`safety gate`, `no-claim shortcut`) for dynamic behavior.
- Shared memory through SQL + vector DB for retrieval and claim continuity.
- Multi-step reasoning with evidence collection before verdict generation.
