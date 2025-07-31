// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Assure-toi que Django expose bien les routes sous /api/
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
