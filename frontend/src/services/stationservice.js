import api from './api';
// stationservice.js
import axios from 'axios';

export const findStation = async (nom_station, localisation) => {
  return await axios.get('/api/stations', {
    params: { nom_station, localisation }
  });
};

export const getStationservices = () => api.get('stationservices/');
export const getStationservice = (id) => api.get(`stationservices/${id}/`);
export const createStationservice = (data) => api.post('stationservices/', data);
export const updateStationservice = (id, data) => api.put(`stationservices/${id}/`, data);
export const deleteStationservice = (id) => api.delete(`stationservices/${id}/`);