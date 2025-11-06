import React, { createContext, useContext, useState } from 'react';

const PageLoadingContext = createContext();

export const usePageLoading = () => {
  const ctx = useContext(PageLoadingContext);
  if (!ctx) throw new Error('usePageLoading must be used within PageLoadingProvider');
  return ctx;
};

export const PageLoadingProvider = ({ children }) => {
  const [pageLoading, setPageLoading] = useState(false);
  return (
    <PageLoadingContext.Provider value={{ pageLoading, setPageLoading }}>
      {children}
    </PageLoadingContext.Provider>
  );
};

export default PageLoadingProvider;