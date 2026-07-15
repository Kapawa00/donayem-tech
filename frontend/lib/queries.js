import { api } from './api';

// Publiques — `locale` (fr/en/de) est transmis en en-tête X-Locale pour que l'API
// résolve les champs traduits (voir backend App\Http\Middleware\SetLocale). Fonctionne
// aussi bien en Server Component (locale passée explicitement depuis params.locale)
// qu'en Client Component (locale lue via useLocale()).
function localeHeaders(locale) {
  return locale ? { headers: { 'X-Locale': locale } } : undefined;
}

export const getServices = (locale) => api.get('/services', localeHeaders(locale)).then((r) => r.data);
export const getService = (slug, locale) =>
  api.get(`/services/${slug}`, localeHeaders(locale)).then((r) => r.data);
export const getPortfolio = (params, locale) =>
  api.get('/portfolio', { params, ...localeHeaders(locale) }).then((r) => r.data);
export const getPortfolioCategories = (locale) =>
  api.get('/portfolio/categories', localeHeaders(locale)).then((r) => r.data);
export const getTestimonials = (locale) => api.get('/testimonials', localeHeaders(locale)).then((r) => r.data);
export const getStats = () => api.get('/stats').then((r) => r.data);
export const getBlogPosts = (params, locale) =>
  api.get('/blog', { params, ...localeHeaders(locale) }).then((r) => r.data);
export const getBlogCategories = (locale) => api.get('/blog/categories', localeHeaders(locale)).then((r) => r.data);
export const getBlogPost = (slug, locale) => api.get(`/blog/${slug}`, localeHeaders(locale)).then((r) => r.data);
export const getFormations = (params, locale) =>
  api.get('/formations', { params, ...localeHeaders(locale) }).then((r) => r.data);
export const submitContact = (data) => api.post('/contact', data).then((r) => r.data);
export const submitQuote = (data) => api.post('/quotes', data).then((r) => r.data);
export const initiatePayment = (data) => api.post('/payments/initiate', data).then((r) => r.data);
export const getPaymentStatus = (orderId) => api.get(`/payments/${orderId}/status`).then((r) => r.data);
export const getOrder = (orderId) => api.get(`/orders/${orderId}`).then((r) => r.data);

// Admin (nécessitent un token admin_token valide, injecté automatiquement par lib/api.js)
export const login = (data) => api.post('/auth/login', data).then((r) => r.data);
export const logout = () => api.post('/auth/logout').then((r) => r.data);
export const getMe = () => api.get('/auth/me').then((r) => r.data);

export const getDashboardStats = () => api.get('/admin/dashboard/stats').then((r) => r.data);

export const getAdminServices = () => api.get('/admin/services').then((r) => r.data);
export const createService = (data) => api.post('/admin/services', data).then((r) => r.data);
export const updateService = (id, data) => api.put(`/admin/services/${id}`, data).then((r) => r.data);
export const deleteService = (id) => api.delete(`/admin/services/${id}`).then((r) => r.data);
export const reorderServices = (ids) => api.post('/admin/services/reorder', { ids }).then((r) => r.data);

export const getAdminPortfolio = (params) => api.get('/admin/portfolio', { params }).then((r) => r.data);
export const createPortfolioItem = (data) => api.post('/admin/portfolio', data).then((r) => r.data);
export const updatePortfolioItem = (id, data) => api.post(`/admin/portfolio/${id}`, data).then((r) => r.data);
export const deletePortfolioItem = (id) => api.delete(`/admin/portfolio/${id}`).then((r) => r.data);
export const togglePortfolioFeatured = (id) =>
  api.post(`/admin/portfolio/${id}/toggle-featured`).then((r) => r.data);

export const getAdminQuotes = (params) => api.get('/admin/quotes', { params }).then((r) => r.data);
export const getAdminQuote = (id) => api.get(`/admin/quotes/${id}`).then((r) => r.data);
export const updateQuote = (id, data) => api.put(`/admin/quotes/${id}`, data).then((r) => r.data);
export const createOrderFromQuote = (id) => api.post(`/admin/quotes/${id}/create-order`).then((r) => r.data);

export const getAdminBlogPosts = (params) => api.get('/admin/blog', { params }).then((r) => r.data);
export const createBlogPost = (data) => api.post('/admin/blog', data).then((r) => r.data);
export const updateBlogPost = (id, data) => api.post(`/admin/blog/${id}`, data).then((r) => r.data);
export const deleteBlogPost = (id) => api.delete(`/admin/blog/${id}`).then((r) => r.data);
export const publishBlogPost = (id) => api.post(`/admin/blog/${id}/publish`).then((r) => r.data);
export const unpublishBlogPost = (id) => api.post(`/admin/blog/${id}/unpublish`).then((r) => r.data);

export const getAdminPayments = (params) => api.get('/admin/payments', { params }).then((r) => r.data);
export const getAdminPayment = (id) => api.get(`/admin/payments/${id}`).then((r) => r.data);
export const refundPayment = (id) => api.post(`/admin/payments/${id}/refund`).then((r) => r.data);

export const getAdminSettings = () => api.get('/admin/settings').then((r) => r.data);
export const updateSettings = (settings) => api.put('/admin/settings', { settings }).then((r) => r.data);

export const getAdminTestimonials = (params) => api.get('/admin/testimonials', { params }).then((r) => r.data);
export const createTestimonial = (data) => api.post('/admin/testimonials', data).then((r) => r.data);
export const updateTestimonial = (id, data) => api.post(`/admin/testimonials/${id}`, data).then((r) => r.data);
export const deleteTestimonial = (id) => api.delete(`/admin/testimonials/${id}`).then((r) => r.data);

export const getAdminMessages = (params) => api.get('/admin/messages', { params }).then((r) => r.data);
