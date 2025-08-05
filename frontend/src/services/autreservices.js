// src/services/autreservices.js
import api from './api';

export const getModeles = () => api.get('modeles/');
export const getLocalUsers = () => api.get('localUsers/');
export const getCarburants = () => api.get('carburants/');
export const getCarosseries = () => api.get('carosseries/');
