import React from 'react';
import './StepIndicator.css';

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Setup' },
    { number: 2, label: 'Analysis' },
    { number: 3, label: 'Refinement' },
    { number: 4, label: 'Training' }
  ];

  return (
    <div className="step-indicator">
      {steps.map((step) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        
        return (
          <div
            key={step.number}
            className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
          >
            <div className="step-circle">{step.number}</div>
            <div className="step-label">{step.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;

