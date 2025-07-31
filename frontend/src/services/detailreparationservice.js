import api from './api';

export const getDetailreparationservices= () => api.get('detailreparations/');
export const getDetailreparationservice= (id) => api.get(`detailreparations/${id}/`);
export const createDetailreparationservice = (data) => api.post('detailreparations/', data);
export const updateDetailreparationservice = (id, data) => api.put(`detailreparations/${id}/`, data);
export const deleteDetailreparationservice = (id) => api.delete(`detailreparations/${id}/`);