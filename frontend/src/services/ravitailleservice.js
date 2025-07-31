import api from './api';

export const getRavitaillers = () => api.get('ravitaillers/');
export const getRavitailleur = (id) => api.get(`ravitaillers/${id}/`);
export const createRavitailleur = (data) => api.post('ravitaillers/', data);
export const updateRavitailleur = (id, data) => api.put(`ravitaillers/${id}/`, data);
export const deleteRavitailleur = (id) => api.delete(`ravitaillers/${id}/`);