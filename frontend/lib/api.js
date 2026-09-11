import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Ajoute le token admin si présent. Garde SSR : localStorage n'existe pas côté serveur
// (ce client est aussi utilisé par des Server Components, ex. app/(public)/blog/[slug]).
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // L'instance a 'Content-Type: application/json' par défaut. Si le body est un FormData
  // (upload de fichier), ce header explicite fait qu'axios convertit le FormData en JSON
  // (formDataToJSON) au lieu de l'envoyer en multipart/form-data — les File/Blob perdent
  // tout leur contenu (JSON.stringify d'un File = {}). On retire le header pour laisser
  // axios/le navigateur poser le bon 'multipart/form-data; boundary=...'.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(`[API] ${error.response.status} ${error.config?.url}`, error.response.data);
    } else {
      console.error('[API] Network error', error.message);
    }

    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/admin')
    ) {
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export default api;
