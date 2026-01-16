import React from 'react';
import './TechModal.css';

function TechModal({ onClose }) {
  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📚 Technology Stack & Implementation Guide</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="tech-stack">
            <h4>🎯 Core Technologies</h4>
            <ul>
              <li><strong>Frontend:</strong> React.js with TypeScript, Material-UI or Tailwind CSS</li>
              <li><strong>Backend:</strong> Python FastAPI or Flask</li>
              <li><strong>ML Framework:</strong> PyTorch + Hugging Face Transformers</li>
              <li><strong>Database:</strong> PostgreSQL for metadata, MongoDB for training data</li>
              <li><strong>Storage:</strong> AWS S3 or Azure Blob for model artifacts</li>
            </ul>
          </div>

          <div className="tech-stack">
            <h4>🔧 Key Libraries & Tools</h4>
            <ul>
              <li><strong>transformers:</strong> DistilBERT model and tokenizers</li>
              <li><strong>datasets:</strong> Data loading and preprocessing</li>
              <li><strong>torch:</strong> Deep learning framework</li>
              <li><strong>scikit-learn:</strong> Data splitting and metrics</li>
              <li><strong>langchain:</strong> LLM integration abstraction</li>
              <li><strong>openai/anthropic/qwen SDKs:</strong> LLM API clients</li>
            </ul>
          </div>

          <div className="tech-stack">
            <h4>📋 Implementation Steps</h4>
            <ol>
              <li><strong>Setup Frontend:</strong> Create React app with form components for problem statement input</li>
              <li><strong>LLM Integration:</strong> Build API endpoints to call OpenAI/Claude/Qwen with proper prompting</li>
              <li><strong>Entity/Intent Generation:</strong> Design prompts to extract entities and intents from problem statement</li>
              <li><strong>Interactive Clarification:</strong> Implement multi-turn conversation flow for refinement</li>
              <li><strong>Editable Lists:</strong> Create CRUD interface for entities and intents with real-time updates</li>
              <li><strong>Data Preparation:</strong> Generate synthetic training data or allow user upload in CoNLL/JSON format</li>
              <li><strong>Model Training Pipeline:</strong> Set up PyTorch training loop with DistilBERT for token classification</li>
              <li><strong>Monitoring:</strong> Implement progress tracking, loss visualization, and validation metrics</li>
              <li><strong>Model Export:</strong> Save trained model and provide download/deployment options</li>
              <li><strong>Testing Interface:</strong> Add prediction testing UI for trained model validation</li>
            </ol>
          </div>

          <div className="tech-stack">
            <h4>🏗️ Architecture Overview</h4>
            <ul>
              <li><strong>Frontend Layer:</strong> React SPA with state management (Redux/Zustand)</li>
              <li><strong>API Gateway:</strong> REST/GraphQL endpoints for all operations</li>
              <li><strong>LLM Service:</strong> Microservice handling multi-provider LLM calls</li>
              <li><strong>Training Service:</strong> Separate microservice for model training jobs</li>
              <li><strong>Queue System:</strong> Celery + Redis for async training tasks</li>
              <li><strong>Monitoring:</strong> Weights & Biases or TensorBoard integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechModal;

