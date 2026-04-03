// API runs on port 8080 (same host as the UI or your VM IP). Routes are /api/...
// Optional build-time override: VITE_API_URL=http://your-host:8080 (no trailing /api).

const getApiOrigin = () => {
  if (import.meta.env.VITE_API_URL) {
    let base = String(import.meta.env.VITE_API_URL).replace(/\/$/, '');
    if (base.endsWith('/api')) {
      base = base.slice(0, -4);
    }
    return base;
  }
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:8080`;
};

export const API_ORIGIN = getApiOrigin();
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const API_ENDPOINTS = {
  search: `${API_BASE_URL}/search`,
  upload: `${API_BASE_URL}/upload`,
  summarize: `${API_BASE_URL}/summarize`,
  health: `${API_ORIGIN}/health`,
};
