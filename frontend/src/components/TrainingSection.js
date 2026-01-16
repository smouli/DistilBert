import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './TrainingSection.css';

function TrainingSection({ onBack, onStartTraining }) {
  const [config, setConfig] = useState({
    model_base: 'distilbert-base-uncased',
    epochs: 10,
    batch_size: 16,
    learning_rate: 2e-5,
    train_test_split: 0.8,
    max_sequence_length: 128
  });

  const [trainingStatus, setTrainingStatus] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [allJobs, setAllJobs] = useState(null);

  useEffect(() => {
    // Fetch all jobs periodically
    const jobsInterval = setInterval(async () => {
      try {
        const jobs = await api.getAllTrainingJobs();
        setAllJobs(jobs);
      } catch (error) {
        console.error('Failed to get all jobs:', error);
      }
    }, 3000);

    if (jobId) {
      const interval = setInterval(async () => {
        try {
          const status = await api.getTrainingStatus(jobId);
          setTrainingStatus(status);
          if (status.status === 'completed' || status.status === 'failed' || status.status === 'stopped') {
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Failed to get training status:', error);
          clearInterval(interval);
        }
      }, 2000);
      return () => {
        clearInterval(interval);
        clearInterval(jobsInterval);
      };
    }

    return () => clearInterval(jobsInterval);
  }, [jobId]);

  const handleStartTraining = async () => {
    try {
      const result = await onStartTraining(config);
      setJobId(result);
      setTrainingStatus({ status: 'running', progress: 0 });
    } catch (error) {
      console.error('Training failed:', error);
      alert('Failed to start training. Please try again.');
    }
  };

  const handleStopTraining = async () => {
    if (!jobId) return;
    
    try {
      const result = await api.stopTraining(jobId);
      alert(result.message || 'Training stopped successfully');
      // Refresh status
      const status = await api.getTrainingStatus(jobId);
      setTrainingStatus(status);
    } catch (error) {
      console.error('Failed to stop training:', error);
      alert('Failed to stop training. Please try again.');
    }
  };

  return (
    <div className="section">
      <div className="section-title">Training Configuration</div>

      <div className="training-config">
        <div className="form-group">
          <label>Model Base:</label>
          <select
            value={config.model_base}
            onChange={(e) => setConfig({ ...config, model_base: e.target.value })}
          >
            <option>distilbert-base-uncased</option>
            <option>distilbert-base-cased</option>
            <option>distilbert-base-multilingual-cased</option>
          </select>
        </div>

        <div className="form-group">
          <label>Training Epochs:</label>
          <input
            type="number"
            value={config.epochs}
            onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Batch Size:</label>
          <input
            type="number"
            value={config.batch_size}
            onChange={(e) => setConfig({ ...config, batch_size: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Learning Rate:</label>
          <input
            type="number"
            step="0.00001"
            value={config.learning_rate}
            onChange={(e) => setConfig({ ...config, learning_rate: parseFloat(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Train/Test Split:</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={config.train_test_split}
            onChange={(e) => setConfig({ ...config, train_test_split: parseFloat(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Max Sequence Length:</label>
          <input
            type="number"
            value={config.max_sequence_length}
            onChange={(e) => setConfig({ ...config, max_sequence_length: parseInt(e.target.value) })}
          />
        </div>
      </div>

      {allJobs && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
          <strong>📊 Training Jobs Status:</strong>
          <div style={{ marginTop: '10px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <span>Total: <strong>{allJobs.total_jobs}</strong></span>
            <span style={{ color: allJobs.running_jobs > 0 ? '#ff9800' : '#666' }}>
              Running: <strong>{allJobs.running_jobs}</strong>
            </span>
            <span style={{ color: '#4caf50' }}>Completed: <strong>{allJobs.completed_jobs}</strong></span>
            <span style={{ color: '#f44336' }}>Failed: <strong>{allJobs.failed_jobs}</strong></span>
            <span style={{ color: '#9e9e9e' }}>Stopped: <strong>{allJobs.stopped_jobs}</strong></span>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button 
          className="btn btn-primary" 
          onClick={handleStartTraining} 
          disabled={trainingStatus?.status === 'running' || trainingStatus?.status === 'initializing' || trainingStatus?.status === 'preparing_data'}
        >
          Start Training 🚀
        </button>
        {trainingStatus && (trainingStatus.status === 'running' || trainingStatus.status === 'initializing' || trainingStatus.status === 'preparing_data') && (
          <button 
            className="btn" 
            onClick={handleStopTraining}
            style={{ background: '#f44336', color: 'white', marginLeft: '10px' }}
          >
            ⏹ Stop Training
          </button>
        )}
      </div>

      {trainingStatus && (
        <div id="trainingProgress" style={{ marginTop: '30px' }}>
          <h3>Training {trainingStatus.status === 'completed' ? 'Complete!' : 'in Progress...'}</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${trainingStatus.progress || 0}%` }}>
              {trainingStatus.progress || 0}%
            </div>
          </div>
          <div style={{ marginTop: '15px', color: '#666' }}>
            {(trainingStatus.status === 'running' || trainingStatus.status === 'initializing' || trainingStatus.status === 'preparing_data') && 
              `Epoch ${trainingStatus.epoch || 0}/${trainingStatus.total_epochs || config.epochs}`}
            {trainingStatus.status === 'completed' && '✓ Training completed successfully!'}
            {trainingStatus.status === 'failed' && `✗ Training failed: ${trainingStatus.error || 'Unknown error'}`}
            {trainingStatus.status === 'stopped' && '⏹ Training stopped by user'}
            {trainingStatus.loss && ` Loss: ${trainingStatus.loss.toFixed(4)}`}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainingSection;

