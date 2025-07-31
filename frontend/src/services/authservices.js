
import api from './api';
export const getLocalUsers = () => api.get('auth/local-users/');
export const getLocalUser = (keycloak_id) => api.get(`local-users/${keycloak_id}/`);
export const login = (credentials) => api.post('auth/login/', credentials);
export const logout = () => api.post('auth/logout/');
export const register = (userData) => api.post('auth/register/', userData);
export const getCurrentUser = () => api.get('auth/user/');
export const updateProfile = (userData) => api.put('auth/profile/', userData);
export const changePassword = (passwordData) => api.post('auth/change-password/', passwordData);
export const refreshToken = () => api.post('auth/token/refresh/');
export const verifyToken = (token) => api.post('auth/token/verify/', { token });
export const getProprietaireInfo = () => api.get('auth/proprietaire/');

