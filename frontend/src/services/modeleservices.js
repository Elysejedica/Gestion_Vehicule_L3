import api from './api';

export const getModeles = () => api.get('modeles/');
export const getModele = (id) => api.get(`modeles/${id}/`);
export const createModele = (data) => api.post('modeles/', data);
export const updateModele = (id, data) => api.put(`modeles/${id}/`, data);
export const deleteModele = (id) => api.delete(`modeles/${id}/`);
