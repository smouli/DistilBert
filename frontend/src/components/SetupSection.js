import React from 'react';
import './SetupSection.css';

function SetupSection({
  problemStatement,
  setProblemStatement,
  selectedLLM,
  setSelectedLLM,
  selectedPreset,
  setSelectedPreset,
  presets,
  onAnalyze
}) {
  const handlePresetSelect = (presetKey) => {
    setSelectedPreset(presetKey);
    const preset = presets[presetKey];
    if (preset) {
      let problemText = '';
      if (presetKey === 'manufacturing') {
        problemText = 'I need an NLP model to process procurement documents and identify rebate recovery opportunities.';
      } else if (presetKey === 'ma') {
        problemText = 'I need an NLP model for M&A due diligence that can analyze customer, vendor, and employment contracts.';
      } else if (presetKey === 'pharma') {
        problemText = 'I need an NLP model for pharmaceutical operations that can process clinical trial data and adverse event reports.';
      }
      setProblemStatement(problemText);
    }
  };

  return (
    <div className="section">
      <div className="section-title">Problem Statement</div>
      
      <div className="form-group">
        <label>Select a preset template or describe your own problem:</label>
        <div className="preset-container">
          {Object.entries(presets).map(([key, preset]) => (
            <div
              key={key}
              className={`preset-card ${selectedPreset === key ? 'selected' : ''}`}
              onClick={() => handlePresetSelect(key)}
            >
              <h3>{preset.icon} {preset.name}</h3>
              <div className="subtitle">{preset.subtitle}</div>
              <div className="preset-tags">
                {preset.tags.map((tag, idx) => (
                  <span key={idx} className="preset-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Or describe your custom NLP problem:</label>
        <textarea
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          placeholder="Example: I need to build a chatbot for restaurant reservations that can understand booking requests, menu inquiries, and customer feedback..."
        />
      </div>

      <div className="form-group">
        <label>Select LLM Provider:</label>
        <div className="llm-selector">
          <div
            className={`llm-option ${selectedLLM === 'openai' ? 'selected' : ''}`}
            onClick={() => setSelectedLLM('openai')}
          >
            <div className="icon">🟢</div>
            <div><strong>OpenAI</strong></div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>GPT-4</div>
          </div>
          <div
            className={`llm-option ${selectedLLM === 'claude' ? 'selected' : ''}`}
            onClick={() => setSelectedLLM('claude')}
          >
            <div className="icon">🔵</div>
            <div><strong>Claude</strong></div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Sonnet 4</div>
          </div>
          <div
            className={`llm-option ${selectedLLM === 'qwen' ? 'selected' : ''}`}
            onClick={() => setSelectedLLM('qwen')}
          >
            <div className="icon">🟣</div>
            <div><strong>Qwen</strong></div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>Qwen 2.5</div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onAnalyze}>
        Analyze Problem Statement →
      </button>
    </div>
  );
}

export default SetupSection;

