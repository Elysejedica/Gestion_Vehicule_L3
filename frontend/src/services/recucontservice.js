import api from './api';

export const getRecuControles = () => api.get('recucontroles/');
export const getRecuControle = (id) => api.get(`recucontroles/${id}/`);
export const createRecuControle = (data) => api.post('recucontroles/', data);
export const updateRecuControle = (id, data) => api.put(`recucontroles/${id}/`, data);
export const deleteRecuControle = (id) => api.delete(`recucontroles/${id}/`);
