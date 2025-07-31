import api from './api';

export const getOperateurs = () => api.get('operateurs/');
export const getOperateur = (id) => api.get(`operateurs/${id}/`);
export const createOperateur = (data) => api.post('operateurs/', data);
export const updateOperateur = (id, data) => api.put(`operateurs/${id}/`, data);
export const deleteOperateur = (id) => api.delete(`operateurs/${id}/`);
