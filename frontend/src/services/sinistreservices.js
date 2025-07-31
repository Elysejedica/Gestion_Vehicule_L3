import api from './api';

export const getSinistres = () => api.get('sinistres/');
export const getSinistre = (id) => api.get(`sinistres/${id}/`);
export const createSinistre = (data) => api.post('sinistres/', data);
export const updateSinistre = (id, data) => api.put(`sinistres/${id}/`, data);
export const deleteSinistre = (id) => api.delete(`sinistres/${id}/`);