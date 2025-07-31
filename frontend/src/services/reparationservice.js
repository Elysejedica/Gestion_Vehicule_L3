import api from './api';

export const getReparations = () => api.get('reparations/');
export const getReparation = (id) => api.get(`reparations/${id}/`);
export const createReparation = (data) => api.post('reparations/', data);
export const updateReparation = (id, data) => api.put(`reparations/${id}/`, data);
export const deleteReparation = (id) => api.delete(`reparations/${id}/`);