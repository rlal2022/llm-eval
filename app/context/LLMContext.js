"use client";
import React, { createContext, useState, useContext } from "react";

const LLMContext = createContext();

export const LLMProvider = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");

  return (
    <LLMContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </LLMContext.Provider>
  );
};

export const useLLM = () => useContext(LLMContext);
