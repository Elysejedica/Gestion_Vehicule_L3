import api from './api';

export const getVidanges = () => api.get('vidanges/');
export const getVidange = (id) => api.get(`vidanges/${id}/`);
export const createVidange = (data) => api.post('vidanges/', data);
export const updateVidange = (id, data) => api.put(`vidanges/${id}/`, data);
export const deleteVidange = (id) => api.delete(`vidanges/${id}/`);