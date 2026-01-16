import React, { useState, useEffect } from 'react';
import StepIndicator from './components/StepIndicator';
import SetupSection from './components/SetupSection';
import AnalysisSection from './components/AnalysisSection';
import RefinementSection from './components/RefinementSection';
import TrainingSection from './components/TrainingSection';
import TechModal from './components/TechModal';
import TemplateWizard from './components/TemplateWizard';
import { api } from './services/api';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLLM, setSelectedLLM] = useState('claude');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [problemStatement, setProblemStatement] = useState('');
  const [domain, setDomain] = useState('');
  const [questions, setQuestions] = useState([]);
  const [entities, setEntities] = useState([]);
  const [intents, setIntents] = useState([]);
  const [presets, setPresets] = useState({});
  const [showTechModal, setShowTechModal] = useState(false);
  const [showTemplateWizard, setShowTemplateWizard] = useState(false);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const data = await api.getPresets();
      setPresets(data);
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

  const handleAnalyzeProblem = async () => {
    if (!problemStatement.trim()) {
      alert('Please enter a problem statement first.');
      return;
    }

    try {
      const result = await api.analyzeProblem(problemStatement, selectedLLM);
      console.log('Analysis result:', result);
      
      // Validate response structure
      if (!result || !result.domain || !result.questions) {
        console.error('Invalid response structure:', result);
        alert('Invalid response from server. Please check console for details.');
        return;
      }
      
      // Ensure questions is an array
      const questionsArray = Array.isArray(result.questions) 
        ? result.questions 
        : [];
      
      setDomain(result.domain);
      setQuestions(questionsArray.map(q => {
        // Handle both string and object formats
        if (typeof q === 'string') {
          return { question: q, answer: '' };
        } else if (q && typeof q === 'object') {
          return { question: q.question || q.text || '', answer: q.answer || '' };
        }
        return { question: String(q), answer: '' };
      }));
      setCurrentStep(2);
    } catch (error) {
      console.error('Analysis failed:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      alert(`Failed to analyze problem: ${errorMsg}. Please check console for details.`);
    }
  };

  const handleSubmitAnswers = async () => {
    const allAnswered = questions.every(q => q.answer.trim());
    if (!allAnswered) {
      alert('Please answer all questions before proceeding.');
      return;
    }

    try {
      const result = await api.generateEntitiesIntents(
        problemStatement,
        domain,
        questions,
        selectedLLM
      );
      setEntities(result.entities);
      setIntents(result.intents);
      setCurrentStep(3);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate entities and intents. Please try again.');
    }
  };

  const handleConfigureTraining = () => {
    setCurrentStep(4);
  };

  const handleStartTraining = async (config) => {
    try {
      const result = await api.startTraining({
        entities,
        intents,
        config
      });
      
      // Poll for training status
      const jobId = result.job_id;
      const interval = setInterval(async () => {
        try {
          const status = await api.getTrainingStatus(jobId);
          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Failed to get training status:', error);
          clearInterval(interval);
        }
      }, 2000);
      
      return jobId;
    } catch (error) {
      console.error('Training failed:', error);
      alert('Failed to start training. Please try again.');
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="App">
      <button className="btn btn-reset" onClick={() => goToStep(1)}>
        🏠 Home
      </button>
      <button className="create-template-btn" onClick={() => setShowTemplateWizard(true)}>
        ✨ Create Custom Template
      </button>
      <button className="tech-info-btn" onClick={() => setShowTechModal(true)}>
        📚 Technology Info
      </button>

      <div className="container">
        <div className="header">
          <h1>🤖 DistilBERT Training Platform</h1>
          <p>AI-Powered Entity & Intent Recognition Model Builder</p>
        </div>

        <div className="main-content">
          <StepIndicator currentStep={currentStep} />

          {currentStep === 1 && (
            <SetupSection
              problemStatement={problemStatement}
              setProblemStatement={setProblemStatement}
              selectedLLM={selectedLLM}
              setSelectedLLM={setSelectedLLM}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPreset}
              presets={presets}
              onAnalyze={handleAnalyzeProblem}
            />
          )}

          {currentStep === 2 && (
            <AnalysisSection
              domain={domain}
              setDomain={setDomain}
              questions={questions}
              setQuestions={setQuestions}
              onBack={() => goToStep(1)}
              onSubmit={handleSubmitAnswers}
            />
          )}

          {currentStep === 3 && (
            <RefinementSection
              entities={entities}
              setEntities={setEntities}
              intents={intents}
              setIntents={setIntents}
              onBack={() => goToStep(2)}
              onNext={handleConfigureTraining}
            />
          )}

          {currentStep === 4 && (
            <TrainingSection
              onBack={() => goToStep(3)}
              onStartTraining={handleStartTraining}
            />
          )}

          <div className="section">
            <div className="section-title">Quick Start Guide</div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
              <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '15px' }}>
                This platform helps you build custom DistilBERT models for entity and intent recognition. 
                Follow the 4-step workflow above, or click the <strong>"Technology Info"</strong> button 
                (bottom-right) to view implementation details and technology stack.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ background: '#e3f2fd', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9em' }}>
                  ✓ AI-Assisted Configuration
                </span>
                <span style={{ background: '#f3e5f5', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9em' }}>
                  ✓ Editable Entities & Intents
                </span>
                <span style={{ background: '#e8f5e9', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9em' }}>
                  ✓ CSV Export
                </span>
                <span style={{ background: '#fff3e0', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9em' }}>
                  ✓ Multi-LLM Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTechModal && (
        <TechModal onClose={() => setShowTechModal(false)} />
      )}

      {showTemplateWizard && (
        <TemplateWizard
          onClose={() => setShowTemplateWizard(false)}
          onSave={(template) => {
            // Handle custom template save
            console.log('Template saved:', template);
            setShowTemplateWizard(false);
          }}
        />
      )}
    </div>
  );
}

export default App;


