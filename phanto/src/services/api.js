// src/services/api.js

const API_BASE_URL = 'http://127.0.0.1:8000';

// Función helper para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// PRODUCTOS
// ============================================

export const productAPI = {
  // GET /api/products/
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Agregar parámetros si existen
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/api/products/${queryString ? `?${queryString}` : ''}`;
    
    return fetchAPI(endpoint);
  },
};

// ============================================
// CATEGORÍAS
// ============================================

export const categoryAPI = {
  // GET /api/products/categories/
  getAll: async () => {
    return fetchAPI('/api/products/categories/');
  },
};

// Exportar la URL base por si la necesitas
export const API_URL = API_BASE_URL;