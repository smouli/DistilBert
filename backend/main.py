from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
from dotenv import load_dotenv
from llm_service import LLMService
from training_service import TrainingService

load_dotenv()

app = FastAPI(title="DistilBERT Training Platform API")

# CORS middleware
frontend_url = os.getenv("FRONTEND_URL", "https://distilbert-frontend.onrender.com")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:4000", 
        "http://127.0.0.1:4000",
        frontend_url,
        "https://distilbert-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services with error handling
try:
    llm_service = LLMService()
except Exception as e:
    print(f"Warning: Failed to initialize LLMService: {e}")
    llm_service = None

try:
    training_service = TrainingService()
except Exception as e:
    print(f"Warning: Failed to initialize TrainingService: {e}")
    training_service = None


class ProblemStatement(BaseModel):
    problem: str
    llm_provider: str = "claude"


class QuestionAnswer(BaseModel):
    question: str
    answer: str


class AnalysisRequest(BaseModel):
    problem: str
    domain: Optional[str] = None
    questions: List[QuestionAnswer]
    llm_provider: str = "claude"


class Entity(BaseModel):
    name: str
    description: str


class Intent(BaseModel):
    name: str
    description: str


class EntitiesIntentsRequest(BaseModel):
    entities: List[Entity]
    intents: List[Intent]


class TrainingConfig(BaseModel):
    model_base: str = "distilbert-base-uncased"
    epochs: int = 10
    batch_size: int = 16
    learning_rate: float = 2e-5
    train_test_split: float = 0.8
    max_sequence_length: int = 128


class TrainingRequest(BaseModel):
    entities: List[Entity]
    intents: List[Intent]
    config: TrainingConfig


@app.get("/")
async def root():
    return {"message": "DistilBERT Training Platform API"}


@app.post("/api/analyze-problem")
async def analyze_problem(request: ProblemStatement):
    """Analyze problem statement and generate domain + questions"""
    if llm_service is None:
        raise HTTPException(status_code=503, detail="LLM service not available")
    try:
        result = await llm_service.analyze_problem(
            request.problem, 
            request.llm_provider
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-entities-intents")
async def generate_entities_intents(request: AnalysisRequest):
    """Generate entities and intents based on problem analysis"""
    if llm_service is None:
        raise HTTPException(status_code=503, detail="LLM service not available")
    try:
        result = await llm_service.generate_entities_intents(
            request.problem,
            request.domain,
            request.questions,
            request.llm_provider
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/start-training")
async def start_training(request: TrainingRequest):
    """Start DistilBERT model training"""
    if training_service is None:
        raise HTTPException(status_code=503, detail="Training service not available")
    try:
        job_id = await training_service.start_training(
            entities=request.entities,
            intents=request.intents,
            config=request.config
        )
        return {"job_id": job_id, "status": "started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/training-status/{job_id}")
async def get_training_status(job_id: str):
    """Get training job status"""
    if training_service is None:
        raise HTTPException(status_code=503, detail="Training service not available")
    try:
        status = await training_service.get_training_status(job_id)
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/training-stop/{job_id}")
async def stop_training(job_id: str):
    """Stop a running training job"""
    if training_service is None:
        raise HTTPException(status_code=503, detail="Training service not available")
    try:
        result = await training_service.stop_training(job_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/training-jobs")
async def get_all_training_jobs():
    """Get all training jobs and their status"""
    if training_service is None:
        raise HTTPException(status_code=503, detail="Training service not available")
    try:
        jobs_info = training_service.get_all_jobs()
        return jobs_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/presets")
async def get_presets():
    """Get available preset templates"""
    from presets import PRESET_DATA
    return PRESET_DATA


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    import sys
    print(f"Python version: {sys.version}")
    print(f"Server starting on port: {os.getenv('PORT', '8000')}")
    print(f"LLM Service initialized: {llm_service is not None}")
    print(f"Training Service initialized: {training_service is not None}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

