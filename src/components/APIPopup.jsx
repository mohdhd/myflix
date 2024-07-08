// components/APIPopup.js
import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Alert } from "@mui/material";

const APIPopup = ({ open, onClose }) => {
  const [openAiKey, setOpenAiKey] = useState("");
  const [tmdbKey, setTmdbKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleValidation = async () => {
    setLoading(true);
    setError("");

    try {
      // Validate OpenAI Key
      await axios.post(
        "https://api.openai.com/v1/chat/completions",
        { 
            model: "gpt-3.5-turbo",
            messages : [{role: "system", content: "You are a friendly assistant."}],
            max_tokens: 5 },
        { headers: { Authorization: `Bearer ${openAiKey}` } }
      );

      // Validate TMDB Key
      await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}`);

      // Save keys to local storage if both are valid
      localStorage.setItem("openAiKey", openAiKey);
      localStorage.setItem("tmdbKey", tmdbKey);

      // Close the dialog
      onClose();
    } catch (err) {
      setError("Invalid OpenAI or TMDB API key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog fullWidth="90" open={open} onClose={onClose} >
      <DialogTitle>Enter API Keys</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="OpenAI Key"
          value={openAiKey}
          onChange={(e) => setOpenAiKey(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="TMDB Key"
          value={tmdbKey}
          onChange={(e) => setTmdbKey(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>

        <Button onClick={handleValidation} color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Validate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default APIPopup;
