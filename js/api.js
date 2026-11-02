/*
 * GitHub Pages is static hosting and cannot run /api routes.
 * Set API_BASE_URL to your deployed backend origin (without a trailing slash)
 * before enabling backend-dependent features.
 */
const API_BASE_URL = "";

const API = {
  login(data) {
    if (!API_BASE_URL) {
      return Promise.reject(new Error("AURA backend is not configured. Set API_BASE_URL in js/api.js."));
    }
    return fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },

  getResources() {
    if (!API_BASE_URL) {
      return Promise.reject(new Error("AURA backend is not configured. Set API_BASE_URL in js/api.js."));
    }
    return fetch(`${API_BASE_URL}/api/resources`);
  }
};
