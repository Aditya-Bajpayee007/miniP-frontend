import React, { createContext, useContext, useState } from 'react';

const GenerationContext = createContext();

export const useGeneration = () => {
  const ctx = useContext(GenerationContext);
  if (!ctx) throw new Error('useGeneration must be used within GenerationProvider');
  return ctx;
};

export const GenerationProvider = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  return (
    <GenerationContext.Provider value={{ isGenerating, setIsGenerating }}>
      {children}
    </GenerationContext.Provider>
  );
};

export default GenerationProvider;