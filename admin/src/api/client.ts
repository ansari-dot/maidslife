import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Propagate error; can add toast handling elsewhere
    return Promise.reject(error);
  }
);
