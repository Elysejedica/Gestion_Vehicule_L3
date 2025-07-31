import api from './api';

export const getCategories = () => api.get('categories/');
export const getCategorie = (id) => api.get(`categories/${id}/`);
export const createCategorie = (data) => api.post('categories/', data);
export const updateCategorie = (id, data) => api.put(`categories/${id}/`, data);
export const deleteCategorie = (id) => api.delete(`categories/${id}/`);

