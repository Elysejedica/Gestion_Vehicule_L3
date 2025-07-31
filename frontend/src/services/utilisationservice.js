import api from './api';

export const getUtilises = () => api.get('utilises/');
export const getUtilise = (id) => api.get(`utilises/${id}/`);
export const createUtilise = (data) => api.post('utilises/', data);
export const updateUtilise = (id, data) => api.put(`utilises/${id}/`, data);
export const deleteUtilise = (id) => api.delete(`utilises/${id}/`);