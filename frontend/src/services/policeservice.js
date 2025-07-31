import api from './api';

export const getPolices = () => api.get('polices/');
export const getPolice = (id) => api.get(`polices/${id}/`);
export const createPolice = (data) => api.post('polices/', data);
export const updatePolice = (id, data) => api.put(`polices/${id}/`, data);
export const deletePolice = (id) => api.delete(`polices/${id}/`);
