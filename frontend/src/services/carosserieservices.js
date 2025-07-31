import api from './api';

export const getCarosseries = () => api.get('carrosseries/');
export const getCarosserie = (id) => api.get(`carrosseries/${id}/`);
export const createCarosserie = (data) => api.post('carrosseries/', data);
export const updateCarosserie = (id, data) => api.put(`carrosseries/${id}/`, data);
export const deleteCarosserie = (id) => api.delete(`carrosseries/${id}/`);
