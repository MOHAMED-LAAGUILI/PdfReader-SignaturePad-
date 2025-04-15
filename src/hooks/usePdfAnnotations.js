import { useState } from 'react';

const usePdfAnnotations = () => {
  const [signatures, setSignatures] = useState([]);
  const [stamps, setStamps] = useState([]);
  const [textAnnotations, setTextAnnotations] = useState([]);
  
  const addSignature = (signatureData, pageNumber) => {
    const newSignature = {
      id: Date.now(),
      type: 'signature',
      data: signatureData,
      page: pageNumber,
      x: 80,
      y: -100,
      width: 200,
      height: 100,
      rotation: 0,
      createdAt: new Date().toISOString()
    };
    setSignatures([...signatures, newSignature]);
    return newSignature;
  };
  
  const addStamp = (text, color, pageNumber) => {
    const newStamp = {
      id: Date.now(),
      type: 'stamp',
      text,
      page: pageNumber,
      x: 80,
      y: -100,
      color,
      fontSize: 24,
      width: 150,
      height: 50,
      rotation: 0,
      createdAt: new Date().toISOString()
    };
    setStamps([...stamps, newStamp]);
    return newStamp;
  };
  
  const addTextAnnotation = (content, pageNumber) => {
    const newAnnotation = {
      id: Date.now(),
      type: 'text',
      content,
      page: pageNumber,
      x: 40,
      y: -80,
      color: '#000000',
      fontSize: 14,
      width: 200,
      height: 50,
      rotation: 0,
      createdAt: new Date().toISOString()
    };
    setTextAnnotations([...textAnnotations, newAnnotation]);
    return newAnnotation;
  };

  const updateAnnotationPosition = (id, x, y) => {
    setSignatures(prev => prev.map(sig => 
      sig.id === id ? { ...sig, x, y } : sig
    ));
    setStamps(prev => prev.map(stamp => 
      stamp.id === id ? { ...stamp, x, y } : stamp
    ));
    setTextAnnotations(prev => prev.map(annotation => 
      annotation.id === id ? { ...annotation, x, y } : annotation
    ));
  };

  const updateAnnotationSize = (id, width, height) => {
    setSignatures(prev => prev.map(sig => 
      sig.id === id ? { ...sig, width, height } : sig
    ));
    setStamps(prev => prev.map(stamp => 
      stamp.id === id ? { ...stamp, width, height } : stamp
    ));
    setTextAnnotations(prev => prev.map(annotation => 
      annotation.id === id ? { ...annotation, width, height } : annotation
    ));
  };

  const updateAnnotationRotation = (id, rotation) => {
    setSignatures(prev => prev.map(sig => 
      sig.id === id ? { ...sig, rotation } : sig
    ));
    setStamps(prev => prev.map(stamp => 
      stamp.id === id ? { ...stamp, rotation } : stamp
    ));
    setTextAnnotations(prev => prev.map(annotation => 
      annotation.id === id ? { ...annotation, rotation } : annotation
    ));
  };

  const deleteAnnotation = (id) => {
    setSignatures(signatures.filter(sig => sig.id !== id));
    setStamps(stamps.filter(stamp => stamp.id !== id));
    setTextAnnotations(textAnnotations.filter(annotation => annotation.id !== id));
  };

  const clearAll = () => {
    setSignatures([]);
    setStamps([]);
    setTextAnnotations([]);
  };

  return {
    signatures,
    stamps,
    textAnnotations,
    addSignature,
    addStamp,
    addTextAnnotation,
    updateAnnotationPosition,
    updateAnnotationSize,
    updateAnnotationRotation,
    deleteAnnotation,
    clearAll
  };
};

export default usePdfAnnotations;