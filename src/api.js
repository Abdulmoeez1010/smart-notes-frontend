import axios from "axios";

const API_BASE = "https://smart-notes-rag-assistant.onrender.com";
// const API_BASE = "http://127.0.0.1:8000";

export const ingestYoutube = (videoUrl) =>
  axios.post(`${API_BASE}/ingest/youtube`, { video_url: videoUrl });

export const ingestPdf = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_BASE}/ingest/pdf`, formData);
};

export const ingestPptx = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_BASE}/ingest/pptx`, formData);
};

export const askQuestion = (docId, question) =>
  axios.post(`${API_BASE}/ask/doc`, { doc_id: docId, question });

export const getSummary = (docId) =>
  axios.post(`${API_BASE}/summarize/doc`, { doc_id: docId });

export const getQuiz = (docId) =>
  axios.post(`${API_BASE}/quiz/doc`, { doc_id: docId });

export const getMindmap = (docId) =>
  axios.post(`${API_BASE}/mindmap/doc`, { doc_id: docId });