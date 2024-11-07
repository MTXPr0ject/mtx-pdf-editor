import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { useAnnotations } from '../hooks/useAnnotations';

export const Annotations: React.FC = () => {
  const {
    annotations,
    selectedAnnotation,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    selectAnnotation
  } = useAnnotations();

  return (
    <div className="annotations-panel">
      <div className="annotations-header">
        <h3>Annotations</h3>
        <button onClick={() => addAnnotation()}>
          <span className="codicon codicon-add"></span>
          Add Note
        </button>
      </div>

      <div className="annotations-list">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className={`annotation-item ${selectedAnnotation?.id === annotation.id ? 'selected' : ''}`}
            onClick={() => selectAnnotation(annotation)}
          >
            <div className="annotation-content">
              <div className="annotation-text">{annotation.text}</div>
              <div className="annotation-page">Page {annotation.page}</div>
            </div>
            <div className="annotation-actions">
              <button onClick={() => updateAnnotation(annotation)}>
                <span className="codicon codicon-edit"></span>
              </button>
              <button onClick={() => deleteAnnotation(annotation.id)}>
                <span className="codicon codicon-trash"></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};