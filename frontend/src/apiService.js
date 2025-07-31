//export { apiService, keycloakConfig };

const API_BASE_URL = 'http://localhost:8000/api';

const keycloakConfig = {
  url: 'http://localhost:8080/',
  realm: 'mon-realm',
  clientId: 'react-frontend',
};

const apiService = {
  post: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur inconnue');
    }

    return await response.json();
  },

  get: async (url, config) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur inconnue');
    }

    return await response.json();
  }
};

export { apiService, keycloakConfig };