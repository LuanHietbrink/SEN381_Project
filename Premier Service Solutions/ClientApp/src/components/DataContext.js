import React, { createContext, useContext, useState } from 'react';

// Create a new context instance
const DataContext = createContext();

// Define a DataProvider component to wrap your application with the context
export const DataProvider = ({ children }) => {
  // Initialize the privateData state and a function to set its value
  const [privateData, setPrivateData] = useState({});

  // Render the context provider with privateData and setPrivateData as the context value
  return (
    <DataContext.Provider value={{ privateData, setPrivateData }}>
      {children}
    </DataContext.Provider>
  );
};

// Define a custom hook, useData, to access the context
export const useData = () => {
  return useContext(DataContext);
};