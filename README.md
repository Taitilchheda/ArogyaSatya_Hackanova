# Healthcare Misinformation Detector

A multi-agent AI system to detect, analyze, and verify healthcare misinformation across text, images, and videos.

## Overview

The project uses a LangGraph workflow with specialized agents for claim extraction, canonicalization, evidence retrieval, and verification. It provides explainable outputs for healthcare-related content.

## Features

- Multi-agent verification pipeline
- Multimodal support: text, images, and video transcription
- Trend clustering for recurring misinformation narratives
- FastAPI backend with database-backed persistence

## Tech Stack

- Python, FastAPI, SQLAlchemy
- LangGraph / LangChain
- ChromaDB
- Groq LLM API + local model components (vision/audio)

## Quick Start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open: `http://localhost:8000/static/index.html`

## API Endpoints

- `POST /api/trigger-scan`
- `GET /api/articles`
- `POST /api/analyze/{id}`
- `POST /api/analyze-text`
- `GET /api/trends`
