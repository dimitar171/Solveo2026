// Central API base URL, configurable via Vite env.
// Prefer a single VITE_API_BASE_URL, but allow host/port/path pieces as a fallback.

const API_HOST = import.meta.env.VITE_API_HOST || '127.0.0.1';
const API_PORT = import.meta.env.VITE_API_PORT || '8080';
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/api';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `http://${API_HOST}:${API_PORT}${API_BASE_PATH}`;


