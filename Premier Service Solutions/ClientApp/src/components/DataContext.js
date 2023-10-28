import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [privateData, setPrivateData] = useState({});
  
  return (
    <DataContext.Provider value={{ privateData, setPrivateData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};