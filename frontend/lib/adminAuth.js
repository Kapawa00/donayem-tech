import { api } from './api';

const TOKEN_KEY = 'admin_token';
const TOKEN_COOKIE = 'admin_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
  // Le middleware Next.js tourne côté serveur/edge et ne peut pas lire le localStorage :
  // on duplique le token dans un cookie pour que middleware.js puisse vérifier la présence de session.
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

// lib/api.js's `api` instance already injects the admin_token (localStorage) as a
// Bearer header and redirects to /admin/login on 401 — reused here instead of a
// second axios instance so the admin panel and public pages share one client.
export default api;
