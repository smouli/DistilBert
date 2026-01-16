import React, { useState } from 'react';
import './AnalysisSection.css';

function AnalysisSection({ domain, setDomain, questions, setQuestions, onBack, onSubmit }) {
  const [isEditingDomain, setIsEditingDomain] = useState(false);
  const [domainInput, setDomainInput] = useState(domain);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleSaveDomain = () => {
    if (domainInput.trim()) {
      setDomain(domainInput.trim());
      setIsEditingDomain(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleEditQuestion = (index) => {
    setEditingQuestion(index);
  };

  const handleSaveQuestion = (index, newQuestion) => {
    const updated = [...questions];
    updated[index].question = newQuestion;
    setQuestions(updated);
    setEditingQuestion(null);
  };

  return (
    <div className="section">
      <div className="section-title">AI Analysis & Clarification</div>
      
      <div className="info-box">
        <strong>💡 Interactive Clarification:</strong> The AI has identified your domain/segment and generated questions. 
        You can edit both the domain and questions as needed.
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ fontWeight: '600', color: '#333', fontSize: '1.1em' }}>
            🎯 Identified Domain/Segment:
          </label>
          <button className="icon-btn" onClick={() => setIsEditingDomain(true)} style={{ background: '#667eea', color: 'white', padding: '6px 12px', borderRadius: '6px' }}>
            ✏️ Edit
          </button>
        </div>
        {!isEditingDomain ? (
          <div style={{ padding: '12px', background: '#f0f4ff', borderRadius: '6px', borderLeft: '4px solid #667eea' }}>
            <span style={{ fontWeight: '500', color: '#333' }}>{domain || 'Customer Service & Support'}</span>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '2px solid #667eea', borderRadius: '6px' }}
              placeholder="Enter domain/segment..."
            />
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={handleSaveDomain} style={{ padding: '8px 16px', fontSize: '0.9em' }}>
                ✓ Save
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditingDomain(false)} style={{ padding: '8px 16px', fontSize: '0.9em' }}>
                ✕ Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong style={{ color: '#333', fontSize: '1.1em' }}>
          To create the best entity and intent model, I have a few questions:
        </strong>
      </div>

      <div className="questions-container">
        {questions.map((q, index) => (
          <div key={index} className="question-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <label className="question-label" style={{ flex: '1', margin: 0 }}>
                <span className="question-number">Q{index + 1}:</span>
                {editingQuestion === index ? (
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    onBlur={() => setEditingQuestion(null)}
                    className="question-input"
                    autoFocus
                  />
                ) : (
                  <span className="question-text" onClick={() => handleEditQuestion(index)}>{q.question}</span>
                )}
              </label>
              <button className="icon-btn" onClick={() => handleEditQuestion(index)} style={{ background: '#667eea', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85em', marginLeft: '10px' }}>
                ✏️ Edit
              </button>
            </div>
            <textarea
              className="question-response"
              value={q.answer}
              onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
              placeholder="Type your answer here..."
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn btn-add" onClick={handleAddQuestion}>
          + Add Another Question
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onSubmit}>
          Send All Answers & Generate →
        </button>
      </div>
    </div>
  );
}

export default AnalysisSection;

