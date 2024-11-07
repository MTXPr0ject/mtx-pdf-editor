import { useState } from 'react';
import { usePdfStore } from '../store/pdfStore';

interface Annotation {
  id: string;
  text: string;
  page: number;
  position: { x: number; y: number };
  color: string;
  timestamp: number;
}

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const { currentPage } = usePdfStore();

  const addAnnotation = () => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      text: '',
      page: currentPage,
      position: { x: 0, y: 0 },
      color: '#ffeb3b',
      timestamp: Date.now()
    };

    setAnnotations([...annotations, newAnnotation]);
    setSelectedAnnotation(newAnnotation);
  };

  const updateAnnotation = (annotation: Annotation) => {
    const updatedAnnotations = annotations.map(a =>
      a.id === annotation.id ? annotation : a
    );
    setAnnotations(updatedAnnotations);
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
    if (selectedAnnotation?.id === id) {
      setSelectedAnnotation(null);
    }
  };

  const selectAnnotation = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
  };

  return {
    annotations,
    selectedAnnotation,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    selectAnnotation
  };
};