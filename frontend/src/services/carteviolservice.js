import api from './api';

export const getCarteviolettes = () => api.get('carteviolettes/');
export const getCarteviolette = (id) => api.get(`carteviolettes/${id}/`);
export const createCarteviolette = (data) => api.post('carteviolettes/', data);
export const updateCarteviolette = (id, data) => api.put(`carteviolettes/${id}/`, data);
export const deleteCarteviolette = (id) => api.delete(`carteviolettes/${id}/`);
