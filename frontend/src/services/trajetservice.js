import api from './api';

export const getTrajets = () => api.get('trajets/');
export const getTrajet = (id) => api.get(`trajets/${id}/`);
export const createTrajet = (data) => api.post('trajets/', data);
export const updateTrajet = (id, data) => api.put(`trajets/${id}/`, data);
export const deleteTrajet = (id) => api.delete(`trajets/${id}/`);