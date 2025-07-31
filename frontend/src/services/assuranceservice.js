import api from './api';

export const getAssurances = () => api.get('assurances/');
export const getAssurance = (id) => api.get(`assurances/${id}/`);
export const createAssurance = (data) => api.post('assurances/', data);
export const updateAssurance = (id, data) => api.put(`assurances/${id}/`, data);
export const deleteAssurance = (id) => api.delete(`assurances/${id}/`);

