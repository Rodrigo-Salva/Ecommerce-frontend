const API_BASE_URL = 'http://127.0.0.1:8000';

const getAuthToken = () => {
  const tokens = localStorage.getItem('authTokens');
  if (tokens) {
    const { access } = JSON.parse(tokens);
    return access;
  }
  return null;
};

const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers,
      ...options,
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const authAPI = {
  login: async (username, password) => {
    return fetchAPI('/api/users/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (userData) => {
    return fetchAPI('/api/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  refreshToken: async (refresh) => {
    return fetchAPI('/api/users/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
  },
};

export const productAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/api/products/${queryString ? `?${queryString}` : ''}`;
    
    const data = await fetchAPI(endpoint);
    return data.results || data || [];
  },

  getBySlug: async (slug) => {
    return fetchAPI(`/api/products/${slug}/`);
  },

  getRelated: async (slug) => {
    const data = await fetchAPI(`/api/products/${slug}/related/`);
    return data.results || data || [];
  },
};

export const categoryAPI = {
  getAll: async () => {
    const data = await fetchAPI('/api/products/categories/');
    return data.results || data || [];
  },

  getBySlug: async (slug) => {
    return fetchAPI(`/api/products/categories/${slug}/`);
  },

  getProducts: async (slug) => {
    const data = await fetchAPI(`/api/products/categories/${slug}/products/`);
    return data.results || data || [];
  },
};

export const cartAPI = {
  get: async () => {
    return fetchAPI('/api/cart/');
  },

  addItem: async (productId, quantity = 1) => {
    console.log('🔵 Enviando a API:', { product_id: productId, quantity });
    return fetchAPI('/api/cart/items/', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    });
  },

  updateItem: async (itemId, quantity) => {
    return fetchAPI(`/api/cart/items/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        quantity: quantity,
      }),
    });
  },

  removeItem: async (itemId) => {
    return fetchAPI(`/api/cart/items/${itemId}/`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return fetchAPI('/api/cart/clear/', {
      method: 'DELETE',
    });
  },
};

export const userAPI = {
  getProfile: async () => {
    const data = await fetchAPI('/api/users/profile/');
    return data.results?.[0] || data;
  },

  updateProfile: async (profileData) => {
    return fetchAPI('/api/users/profile/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (oldPassword, newPassword, newPassword2) => {
    return fetchAPI('/api/users/change-password/', {
      method: 'PATCH',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: newPassword2,
      }),
    });
  },

  getAddresses: async () => {
    const data = await fetchAPI('/api/users/addresses/');
    return data.results || data || [];
  },

  createAddress: async (addressData) => {
    return fetchAPI('/api/users/addresses/', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (id, addressData) => {
    return fetchAPI(`/api/users/addresses/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(addressData),
    });
  },

  deleteAddress: async (id) => {
    return fetchAPI(`/api/users/addresses/${id}/`, {
      method: 'DELETE',
    });
  },
};

export const API_URL = API_BASE_URL;
export const getAllProducts = productAPI.getAll;
export const getProductBySlug = productAPI.getBySlug;
export const getAllCategories = categoryAPI.getAll;