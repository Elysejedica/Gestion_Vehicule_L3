import api from './api';

export const getCotisations = () => api.get('cotisations/');
export const getCotisation = (id) => api.get(`cotisations/${id}/`);
export const createCotisation = (data) => api.post('cotisations/', data);
export const updateCotisation = (id, data) => api.put(`cotisations/${id}/`, data);
export const deleteCotisation = (id) => api.delete(`cotisations/${id}/`);
