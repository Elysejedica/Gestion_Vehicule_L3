// services/vehiculeapi.js
import axios from 'axios';

const API_KEY = 'rg5bgXZlyc5UAU0ugWsTjQ==au3w8whLUNxqxayD'; // 🗝 remplace par ta vraie clé
const BASE_URL = 'https://api.api-ninjas.com/v1/cars';

export const getAllMakes = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: { 'X-Api-Key': API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur API Makes :', error);
    throw error;
  }
};
