# DistilBERT Training Platform

AI-Powered Entity & Intent Recognition Model Builder

## Features

- 🤖 AI-Assisted Configuration with multi-LLM support (OpenAI, Claude, Qwen)
- ✏️ Editable Entities & Intents
- 📥 CSV Export
- 🎯 Preset Templates (Manufacturing, M&A, Pharmaceutical)
- ✨ Custom Template Creation Wizard
- 🚀 DistilBERT Model Training Pipeline

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS
- Axios for API calls

### Backend
- Python FastAPI
- PyTorch + Hugging Face Transformers
- OpenAI/Anthropic/Qwen SDKs
- PostgreSQL (metadata)
- MongoDB (training data)

## Project Structure

```
DistilBert/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend application
├── models/            # Trained model artifacts
└── data/              # Training datasets
```

## Setup Instructions

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend `.env`
```
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
QWEN_API_KEY=your_qwen_key
DATABASE_URL=postgresql://user:pass@localhost/dbname
MONGODB_URL=mongodb://localhost:27017/distilbert
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:8000
PORT=4000
```

## Usage

1. Start the backend server (port 8000)
2. Start the frontend development server (port 4000)
3. Open http://localhost:4000 in your browser
4. Follow the 4-step workflow to build your custom DistilBERT model

## License

MIT

