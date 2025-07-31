import api from './api';

export const getProprietaires = () => api.get('proprietaires/');
export const getProprietaire = (id) => api.get(`proprietaires/${id}/`);
export const createProprietaire = (data) => api.post('proprietaires/', data);
export const updateProprietaire = (id, data) => api.put(`proprietaires/${id}/`, data);
export const deleteProprietaire = (id) => api.delete(`proprietaires/${id}/`);
