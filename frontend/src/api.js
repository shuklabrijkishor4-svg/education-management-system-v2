// Helper for calling the backend. It adds the admin login token automatically.
import { API_BASE } from "./config.js";

export const TOKEN_KEY = "adminToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Returns the "data" part of the response. Throws Error(message) on failure.
export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = "Bearer " + token;

  let response;
  try {
    response = await fetch(API_BASE + path, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (e) {
    throw new Error("Cannot reach the server. Is the backend running on port 5000?");
  }

  let result = {};
  try { result = await response.json(); } catch (e) { /* empty body */ }

  if (response.status === 401 && token) {
    // Token expired or invalid: go back to login
    clearToken();
    window.location.href = "/admin/login";
    throw new Error(result.message || "Please log in again.");
  }
  if (!response.ok) throw new Error(result.message || "Request failed (" + response.status + ")");

  // Works for { data: [...] } and for a plain array
  return result.data !== undefined ? result.data : result;
}

// Used only for login (a 401 there means wrong password, not an expired token)
export async function loginRequest(username, password) {
  let response;
  try {
    response = await fetch(API_BASE + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch (e) {
    throw new Error("Cannot reach the server. Is the backend running on port 5000?");
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.token) throw new Error(result.message || "Login failed.");
  return result.token;
}
