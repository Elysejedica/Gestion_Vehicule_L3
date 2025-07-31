import api from './api';

export const getCarburants = () => api.get('carburants/');
export const getCarburant = (id) => api.get(`carburants/${id}/`);
export const createCarburant = (data) => api.post('carburants/', data);
export const updateCarburant = (id, data) => api.put(`carburants/${id}/`, data);
export const deleteCarburant = (id) => api.delete(`carburants/${id}/`);
