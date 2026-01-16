# Quick Start Guide

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- API keys for at least one LLM provider (OpenAI, Anthropic, or Qwen)

## Installation

### Option 1: Automated Setup (Recommended)

```bash
./setup.sh
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your API keys
```

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed (default API URL is http://localhost:8000)
```

## Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
QWEN_API_KEY=...  # Optional
DATABASE_URL=postgresql://user:pass@localhost:5432/distilbert  # Optional for now
MONGODB_URL=mongodb://localhost:27017/distilbert  # Optional for now
```

**Note:** You only need to configure the LLM providers you plan to use. The app will work with at least one provider configured.

### Frontend Environment Variables

Edit `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000
```

## Running the Application

### Terminal 1: Start Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

The backend will start on `http://localhost:8000`

### Terminal 2: Start Frontend

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:4000` and automatically open in your browser.

## Usage

1. **Setup**: Enter a problem statement or select a preset template (Manufacturing, M&A, or Pharmaceutical)
2. **Analysis**: Review the AI-generated domain and answer clarification questions
3. **Refinement**: Edit the generated entities and intents, add new ones, or export to CSV
4. **Training**: Configure training parameters and start training your DistilBERT model

## Features

- ✅ Multi-LLM support (OpenAI GPT-4, Claude Sonnet, Qwen)
- ✅ Preset templates for common use cases
- ✅ Custom template creation wizard
- ✅ Interactive entity and intent editing
- ✅ CSV export functionality
- ✅ Real-time training progress tracking

## Troubleshooting

### Backend won't start
- Check that Python 3.8+ is installed: `python3 --version`
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check that port 8000 is not in use

### Frontend won't start
- Check that Node.js 16+ is installed: `node --version`
- Ensure dependencies are installed: `npm install`
- Check that port 4000 is not in use

### API errors
- Verify your API keys are correct in `backend/.env`
- Check that at least one LLM provider is configured
- Ensure the backend is running before starting the frontend

### CORS errors
- Make sure the backend is running on `http://localhost:8000`
- Check that `REACT_APP_API_URL` in `frontend/.env` matches the backend URL

## Next Steps

- Add your own training data for more accurate models
- Customize the training pipeline in `backend/training_service.py`
- Extend the preset templates in `backend/presets.py`
- Deploy to production (see README.md for deployment considerations)

## Support

For issues or questions, please check the main README.md file or open an issue in the repository.

