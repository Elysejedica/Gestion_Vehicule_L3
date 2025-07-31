// src/services/autreservices.js
import api from './api';

export const getModeles = () => api.get('modeles/');
export const getProprietaires = () => api.get('proprietaires/');
export const getCarburants = () => api.get('carburants/');
export const getCarosseries = () => api.get('carosseries/');
