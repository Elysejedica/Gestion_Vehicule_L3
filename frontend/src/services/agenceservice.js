import api from './api';

export const getAgences = () => api.get('agences/');
export const getAgence = (id) => api.get(`agences/${id}/`);
export const createAgence = (data) => api.post('agences/', data);
export const updateAgence = (id, data) => api.put(`agences/${id}/`, data);
export const deleteAgence = (id) => api.delete(`agences/${id}/`);
