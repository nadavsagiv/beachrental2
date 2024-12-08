import axios from 'axios';

// Determine the base URL based on the environment
const baseURL = import.meta.env.PROD 
  ? '/api'  // In production, use relative path
  : 'http://localhost:3001/api'; // In development, use localhost

// Create an axios instance with default config
const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api; 