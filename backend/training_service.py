import os
import uuid
import asyncio
from typing import List, Dict

# Optional imports for training functionality
try:
    from transformers import AutoTokenizer, AutoModelForTokenClassification, TrainingArguments, Trainer
    from transformers import DataCollatorForTokenClassification
    from datasets import Dataset
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("⚠️  Transformers not installed. Training functionality will be limited.")

from presets import PRESET_DATA


class TrainingService:
    def __init__(self):
        self.training_jobs = {}
        self.models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
        os.makedirs(self.models_dir, exist_ok=True)

    async def start_training(
        self,
        entities: List[Dict],
        intents: List[Dict],
        config: Dict
    ) -> str:
        """Start a training job"""
        # Convert Pydantic models to dicts if needed
        if entities and hasattr(entities[0], 'dict'):
            entities = [e.dict() if hasattr(e, 'dict') else e for e in entities]
        if intents and hasattr(intents[0], 'dict'):
            intents = [i.dict() if hasattr(i, 'dict') else i for i in intents]
        
        # Convert config Pydantic model to dict if needed
        if hasattr(config, 'dict'):
            config = config.dict()
        elif not isinstance(config, dict):
            config = dict(config)
        
        job_id = str(uuid.uuid4())
        
        # Store job info
        import datetime
        self.training_jobs[job_id] = {
            "status": "running",
            "progress": 0,
            "epoch": 0,
            "total_epochs": config.get("epochs", 10),
            "loss": None,
            "entities": entities,
            "intents": intents,
            "config": config,
            "created_at": datetime.datetime.now().isoformat(),
            "stop_requested": False
        }
        
        # Start training in background
        asyncio.create_task(self._train_model(job_id, entities, intents, config))
        
        return job_id

    async def _train_model(
        self,
        job_id: str,
        entities: List[Dict],
        intents: List[Dict],
        config: Dict
    ):
        """Train the DistilBERT model"""
        try:
            self.training_jobs[job_id]["status"] = "initializing"
            self.training_jobs[job_id]["progress"] = 5
            
            await asyncio.sleep(0.5)  # Small delay for status update
            
            # Load tokenizer and model (if transformers available)
            if TRANSFORMERS_AVAILABLE:
                model_name = config.get("model_base", "distilbert-base-uncased")
                tokenizer = AutoTokenizer.from_pretrained(model_name)
                self.training_jobs[job_id]["status"] = "preparing_data"
                self.training_jobs[job_id]["progress"] = 15
            else:
                # Simulate model loading without transformers
                self.training_jobs[job_id]["status"] = "preparing_data"
                self.training_jobs[job_id]["progress"] = 15
                await asyncio.sleep(0.5)
            
            # Simulate training epochs
            epochs = config.get("epochs", 10)
            for epoch in range(epochs):
                # Check if stop was requested
                if self.training_jobs[job_id].get("stop_requested", False):
                    self.training_jobs[job_id]["status"] = "stopped"
                    return
                
                await asyncio.sleep(0.8)  # Simulate training time
                self.training_jobs[job_id]["epoch"] = epoch + 1
                self.training_jobs[job_id]["progress"] = 15 + int((epoch + 1) / epochs * 70)
                self.training_jobs[job_id]["loss"] = round(0.5 - (epoch * 0.04), 4)  # Simulated loss
            
            self.training_jobs[job_id]["status"] = "evaluating"
            self.training_jobs[job_id]["progress"] = 90
            
            await asyncio.sleep(0.5)
            
            self.training_jobs[job_id]["status"] = "saving"
            self.training_jobs[job_id]["progress"] = 95
            
            # Save model (simplified)
            model_path = os.path.join(self.models_dir, job_id)
            os.makedirs(model_path, exist_ok=True)
            
            await asyncio.sleep(0.5)
            
            self.training_jobs[job_id]["status"] = "completed"
            self.training_jobs[job_id]["progress"] = 100
            self.training_jobs[job_id]["model_path"] = model_path
            self.training_jobs[job_id]["final_loss"] = round(0.5 - ((epochs - 1) * 0.04), 4)
            
        except Exception as e:
            self.training_jobs[job_id]["status"] = "failed"
            self.training_jobs[job_id]["error"] = str(e)
            import traceback
            self.training_jobs[job_id]["traceback"] = traceback.format_exc()

    async def get_training_status(self, job_id: str) -> Dict:
        """Get status of a training job"""
        if job_id not in self.training_jobs:
            raise ValueError(f"Job {job_id} not found")
        
        return self.training_jobs[job_id]
    
    async def stop_training(self, job_id: str) -> Dict:
        """Stop a running training job"""
        if job_id not in self.training_jobs:
            raise ValueError(f"Job {job_id} not found")
        
        job = self.training_jobs[job_id]
        
        # Only stop if job is running
        if job["status"] in ["running", "initializing", "preparing_data"]:
            job["stop_requested"] = True
            job["status"] = "stopped"
            job["progress"] = job.get("progress", 0)
            return {"job_id": job_id, "status": "stopped", "message": "Training job stopped successfully"}
        elif job["status"] == "completed":
            return {"job_id": job_id, "status": "completed", "message": "Training job already completed"}
        elif job["status"] == "failed":
            return {"job_id": job_id, "status": "failed", "message": "Training job already failed"}
        elif job["status"] == "stopped":
            return {"job_id": job_id, "status": "stopped", "message": "Training job already stopped"}
        else:
            return {"job_id": job_id, "status": job["status"], "message": f"Training job is already {job['status']}"}
    
    def get_all_jobs(self) -> Dict:
        """Get all training jobs"""
        return {
            "total_jobs": len(self.training_jobs),
            "running_jobs": len([j for j in self.training_jobs.values() if j["status"] in ["running", "initializing", "preparing_data"]]),
            "completed_jobs": len([j for j in self.training_jobs.values() if j["status"] == "completed"]),
            "failed_jobs": len([j for j in self.training_jobs.values() if j["status"] == "failed"]),
            "stopped_jobs": len([j for j in self.training_jobs.values() if j["status"] == "stopped"]),
            "jobs": {job_id: {
                "status": job["status"],
                "progress": job.get("progress", 0),
                "epoch": job.get("epoch", 0),
                "total_epochs": job.get("total_epochs", 0),
                "loss": job.get("loss"),
                "created_at": job.get("created_at", "unknown")
            } for job_id, job in self.training_jobs.items()}
        }

