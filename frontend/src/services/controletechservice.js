import api from './api';

export const getControles = () => api.get('controles/');
export const getControle = (id) => api.get(`controles/${id}/`);
export const createControle = (data) => api.post('controles/', data);
export const updateControle = (id, data) => api.put(`controles/${id}/`, data);
export const deleteControle = (id) => api.delete(`controles/${id}/`);
