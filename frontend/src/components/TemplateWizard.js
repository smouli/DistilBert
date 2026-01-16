import React, { useState } from 'react';
import './TemplateWizard.css';

const INDUSTRIES = [
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'retail', name: 'Retail', icon: '🛒' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'legal', name: 'Legal', icon: '⚖️' },
  { id: 'education', name: 'Education', icon: '🎓' }
];

const INDUSTRY_SUBCATEGORIES = {
  healthcare: ['Patient Records', 'Medical Imaging', 'Clinical Trials', 'Telemedicine'],
  finance: ['Fraud Detection', 'Credit Scoring', 'Investment Analysis', 'Insurance Claims'],
  retail: ['Inventory Management', 'Customer Analytics', 'Supply Chain', 'Price Optimization'],
  technology: ['Bug Tracking', 'Code Review', 'DevOps', 'API Management'],
  legal: ['Contract Review', 'Case Management', 'Legal Research', 'Compliance Monitoring'],
  education: ['Student Assessment', 'Curriculum Planning', 'Learning Analytics', 'Admissions']
};

function TemplateWizard({ onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [templateIcon, setTemplateIcon] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');

  const handleNext = () => {
    if (step === 1 && selectedIndustry) {
      setStep(2);
    } else if (step === 2 && selectedSubcategory) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = () => {
    if (!templateName || !templateIcon || !templateDesc) {
      alert('Please fill in all fields.');
      return;
    }

    onSave({
      name: templateName,
      icon: templateIcon,
      description: templateDesc,
      industry: selectedIndustry,
      subcategory: selectedSubcategory
    });
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✨ Create Custom Template Wizard</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="wizard-progress">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`wizard-progress-item ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}`}>
                <div className="wizard-progress-circle">{s}</div>
                <div className="wizard-progress-label">
                  {s === 1 ? 'Industry' : s === 2 ? 'Subcategory' : s === 3 ? 'Preview' : 'Customize'}
                </div>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="wizard-step active">
              <h3>Select Your Industry</h3>
              <div className="industry-grid">
                {INDUSTRIES.map((industry) => (
                  <div
                    key={industry.id}
                    className={`industry-card ${selectedIndustry === industry.id ? 'selected' : ''}`}
                    onClick={() => setSelectedIndustry(industry.id)}
                  >
                    <div className="icon">{industry.icon}</div>
                    <div className="name">{industry.name}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '30px', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleNext} disabled={!selectedIndustry}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step active">
              <h3>Select Subcategory</h3>
              <div className="subcategory-list">
                {INDUSTRY_SUBCATEGORIES[selectedIndustry]?.map((sub) => (
                  <div
                    key={sub}
                    className={`subcategory-item ${selectedSubcategory === sub ? 'selected' : ''}`}
                    onClick={() => setSelectedSubcategory(sub)}
                  >
                    {sub}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={handlePrev}>← Back</button>
                <button className="btn btn-primary" onClick={handleNext} disabled={!selectedSubcategory}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step active">
              <h3>AI-Generated Template Preview</h3>
              <div className="info-box">
                <strong>🤖 AI Analysis:</strong> Based on your selection of <strong>{selectedIndustry}</strong> - <strong>{selectedSubcategory}</strong>, 
                I've generated a template structure.
              </div>
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={handlePrev}>← Back</button>
                <button className="btn btn-primary" onClick={handleNext}>Customize →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="wizard-step active">
              <h3>Customize Your Template</h3>
              <div className="form-group">
                <label>Template Name:</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="E.g., Healthcare Patient Records"
                />
              </div>
              <div className="form-group">
                <label>Template Icon (Emoji):</label>
                <input
                  type="text"
                  value={templateIcon}
                  onChange={(e) => setTemplateIcon(e.target.value)}
                  placeholder="E.g., 🏥"
                  maxLength={2}
                />
              </div>
              <div className="form-group">
                <label>Short Description:</label>
                <input
                  type="text"
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                  placeholder="E.g., Patient data extraction"
                />
              </div>
              <div className="info-box">
                <strong>💡 Note:</strong> You can further edit entities and intents after saving the template.
              </div>
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={handlePrev}>← Back</button>
                <button className="btn btn-primary" onClick={handleSave}>💾 Save Template</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplateWizard;

