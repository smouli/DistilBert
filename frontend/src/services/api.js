import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
console.log('API URL configured:', API_URL);

export const api = {
  async analyzeProblem(problem, llmProvider) {
    try {
      console.log('Calling API:', `${API_URL}/api/analyze-problem`);
      console.log('Request payload:', { problem, llm_provider: llmProvider });
      const response = await axios.post(`${API_URL}/api/analyze-problem`, {
        problem,
        llm_provider: llmProvider
      });
      console.log('API Response:', response.status, response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      if (error.response) {
        // Server responded with error status
        console.error('Response error:', error.response.status, error.response.data);
        throw new Error(error.response.data?.detail || error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request made but no response
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Error setting up request
        console.error('Request setup error:', error.message);
        throw error;
      }
    }
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

