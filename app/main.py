from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import endpoints
from app.db.database import init_db
from app.core.config import settings

app = FastAPI(title=settings.APP_NAME, version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in settings.FRONTEND_ORIGINS.split(",")
    if origin.strip()
]

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(endpoints.router, prefix="/api")

@app.on_event("startup")
async def on_startup():
    await init_db()
    # Run cleanup in background
    from app.core.cleanup import cleanup_old_content
    import asyncio
    asyncio.create_task(cleanup_old_content())

@app.get("/")
async def root():
    return {"message": "Healthcare Misinformation Detector API is running"}
