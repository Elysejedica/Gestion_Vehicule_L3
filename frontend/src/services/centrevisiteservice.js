import api from './api';

export const getCentresvisites = () => api.get('centresvisites/');
export const getCentrevisiteById = (id) => api.get(`centresvisites/${id}/`);
export const createCentrevisite = (data) => api.post('centresvisites/', data);
export const updateCentrevisite = (id, data) => api.put(`centresvisites/${id}/`, data);
export const deleteCentrevisite = (id) => api.delete(`centresvisites/${id}/`);
