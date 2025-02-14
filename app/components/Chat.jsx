"use client";

import {
  Box,
  Button,
  TextField,
  Avatar,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useLLM } from "../context/LLMContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { selectedModel, setSelectedModel } = useLLM();
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input, model: selectedModel }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      setMessages([
        ...newMessages,
        {
          role: "system",
          content: data.choices[0]?.message?.content || "No response from AI",
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { role: "system", content: "Failed to send message" },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        flex={1}
        width="80vh"
        height="100vh"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        sx={{ backgroundColor: darkTheme.palette.background.default }}
      >
        {/*LLM Selection */}
        <Box mt={2}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="model-select-label">Select LLM Model</InputLabel>
            <Select
              labelId="model-select-label"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              label="Select LLM Model"
            >
              <MenuItem value={"gemma2-9b-it"}>Gemma 2.9b IT</MenuItem>
              <MenuItem value={"mixtral-8x7b-32768"}>
                Mixtral-8x7b-32768
              </MenuItem>
              <MenuItem value={"llama3-8b-8192"}>Llama3-8b-8192</MenuItem>
              <MenuItem value={"llama-3.1-8b-instant"}>
                Llama 3.1 8b Instant
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* Chat Messages */}
        <Box flex={1} p={2} sx={{ overflow: "auto" }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "user" ? "flex-end" : "flex-start"
              }
              mb={2}
            >
              {message.role !== "user" && (
                <Avatar sx={{ bgcolor: "#818181", mr: 1 }}>AI</Avatar>
              )}
              <Box
                sx={{
                  maxWidth: "75%",
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor:
                    message.role === "user"
                      ? "#2196f3"
                      : darkTheme.palette.background.paper,
                  color:
                    message.role === "user"
                      ? "text.primary"
                      : darkTheme.palette.text.primary,
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
              </Box>
              {message.role === "user" && (
                <Avatar sx={{ bgcolor: "#2196f3", ml: 1 }}>U</Avatar>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        {/* Input Field */}
        <Box
          display="flex"
          p={2}
          sx={{
            borderTop: `1px solid ${darkTheme.palette.divider}`,
            backgroundColor: darkTheme.palette.background.paper,
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ marginRight: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={loading}
          >
            Send
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
