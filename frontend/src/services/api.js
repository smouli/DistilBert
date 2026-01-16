import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = {
  async analyzeProblem(problem, llmProvider) {
    const response = await axios.post(`${API_URL}/api/analyze-problem`, {
      problem,
      llm_provider: llmProvider
    });
    return response.data;
  },

  async generateEntitiesIntents(problem, domain, questions, llmProvider) {
    const response = await axios.post(`${API_URL}/api/generate-entities-intents`, {
      problem,
      domain,
      questions: questions.map(q => ({
        question: q.question,
        answer: q.answer
      })),
      llm_provider: llmProvider
    });
    return response.data;
  },

  async startTraining(data) {
    const response = await axios.post(`${API_URL}/api/start-training`, data);
    return response.data;
  },

  async getTrainingStatus(jobId) {
    const response = await axios.get(`${API_URL}/api/training-status/${jobId}`);
    return response.data;
  },

  async getPresets() {
    const response = await axios.get(`${API_URL}/api/presets`);
    return response.data;
  },

  async stopTraining(jobId) {
    const response = await axios.post(`${API_URL}/api/training-stop/${jobId}`);
    return response.data;
  },

  async getAllTrainingJobs() {
    const response = await axios.get(`${API_URL}/api/training-jobs`);
    return response.data;
  }
};

