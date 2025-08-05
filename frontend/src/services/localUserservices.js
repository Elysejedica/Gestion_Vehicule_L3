import api from './api';

export const getKeycloakUsers = () => api.get('keycloak-users/');
export const getLocalUser = (id) => api.get(`localusers/${id}/`);
export const createLocalUser = (data) => api.post('localusers/', data);
export const updateLocalUser = (id, data) => api.put(`localusers/${id}/`, data);
export const deleteLocalUser = (id) => api.delete(`localusers/${id}/`);
