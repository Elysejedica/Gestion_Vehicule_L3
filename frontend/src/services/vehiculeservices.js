// services/vehiculeService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/vehicules/';

export const getVehicules = () => axios.get(API_URL);
export const getVehicule = (id) => axios.get(`${API_URL}${id}/`);
export const createVehicule = (data) => axios.post(API_URL, data);
export const updateVehicule = (id, data) => axios.put(`${API_URL}${id}/`, data);
export const deleteVehicule = (id) => axios.delete(`${API_URL}${id}/`);


