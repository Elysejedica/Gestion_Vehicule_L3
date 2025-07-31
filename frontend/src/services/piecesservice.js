import api from './api';

export const getPieces = () => api.get('pieces/');
export const getPiece = (id) => api.get(`pieces/${id}/`);
export const createPiece = (data) => api.post('pieces/', data);
export const updatePiece = (id, data) => api.put(`pieces/${id}/`, data);
export const deletePiece = (id) => api.delete(`pieces/${id}/`);