"use client";
import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLLM } from "../context/LLMContext";

const Benchmarks = () => {
  const [time, setTime] = useState(null);
  const { selectedModel } = useLLM();

  const fetchTime = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Hello",
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat completion time");
      }

      const data = await response.json();
      setTime(data.time);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchTime();
  }, [selectedModel]);

  return (
    <Box>
      <Typography>Time: {time} ms</Typography>
    </Box>
  );
};

export default Benchmarks;
