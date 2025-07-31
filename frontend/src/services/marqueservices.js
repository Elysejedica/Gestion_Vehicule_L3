import api from './api';

export const getMarques = () => api.get('marques/');
export const getMarque = (id) => api.get(`marques/${id}/`);
export const createMarque = (data) => api.post('marques/', data);
export const updateMarque = (id, data) => api.put(`marques/${id}/`, data);
export const deleteMarque = (id) => api.delete(`marques/${id}/`);
