import React from 'react';
import './RefinementSection.css';

function RefinementSection({ entities, setEntities, intents, setIntents, onBack, onNext }) {
  const handleEntityChange = (index, field, value) => {
    const updated = [...entities];
    updated[index] = { ...updated[index], [field]: value };
    setEntities(updated);
  };

  const handleIntentChange = (index, field, value) => {
    const updated = [...intents];
    updated[index] = { ...updated[index], [field]: value };
    setIntents(updated);
  };

  const addEntity = () => {
    setEntities([...entities, { name: '', description: '' }]);
  };

  const addIntent = () => {
    setIntents([...intents, { name: '', description: '' }]);
  };

  const removeEntity = (index) => {
    setEntities(entities.filter((_, i) => i !== index));
  };

  const removeIntent = (index) => {
    setIntents(intents.filter((_, i) => i !== index));
  };

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${(row[header] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportEntities = () => {
    if (entities.length === 0) {
      alert('No entities to export.');
      return;
    }
    exportToCSV(entities.map(e => ({ 'Entity Name': e.name, 'Description': e.description })), 'entities.csv');
  };

  const exportIntents = () => {
    if (intents.length === 0) {
      alert('No intents to export.');
      return;
    }
    exportToCSV(intents.map(i => ({ 'Intent Name': i.name, 'Description': i.description })), 'intents.csv');
  };

  return (
    <div className="section">
      <div className="section-title">Entities</div>
      
      <div className="info-box">
        <strong>✏️ Editable List:</strong> Review and modify the AI-generated entities. Add new ones as needed.
      </div>

      <div className="list-container">
        {entities.map((entity, index) => (
          <div key={index} className="list-item">
            <div className="list-item-content">
              <input
                type="text"
                value={entity.name}
                onChange={(e) => handleEntityChange(index, 'name', e.target.value)}
                placeholder="ENTITY_NAME"
                style={{ maxWidth: '200px' }}
              />
              <input
                type="text"
                value={entity.description}
                onChange={(e) => handleEntityChange(index, 'description', e.target.value)}
                placeholder="Description"
              />
            </div>
            <div className="list-item-actions">
              <button className="icon-btn delete" onClick={() => removeEntity(index)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-add" onClick={addEntity}>+ Add Entity</button>

      <div style={{ marginTop: '15px' }}>
        <button className="btn btn-secondary" onClick={exportEntities} style={{ background: '#17a2b8', marginLeft: 0 }}>
          📥 Export Entities to CSV
        </button>
      </div>

      <div className="section-title" style={{ marginTop: '40px' }}>Intents</div>

      <div className="list-container">
        {intents.map((intent, index) => (
          <div key={index} className="list-item">
            <div className="list-item-content">
              <input
                type="text"
                value={intent.name}
                onChange={(e) => handleIntentChange(index, 'name', e.target.value)}
                placeholder="intent_name"
              />
              <input
                type="text"
                value={intent.description}
                onChange={(e) => handleIntentChange(index, 'description', e.target.value)}
                placeholder="Description"
              />
            </div>
            <div className="list-item-actions">
              <button className="icon-btn delete" onClick={() => removeIntent(index)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-add" onClick={addIntent}>+ Add Intent</button>

      <div style={{ marginTop: '15px' }}>
        <button className="btn btn-secondary" onClick={exportIntents} style={{ background: '#17a2b8', marginLeft: 0 }}>
          📥 Export Intents to CSV
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>Configure Training →</button>
      </div>
    </div>
  );
}

export default RefinementSection;

