// src/services/api.js
const API_URL = 'http://127.0.0.1:8000';

// PRODUCTOS
export const getAllProducts = async () => {
  const res = await fetch(`${API_URL}/api/products/`);
  if (!res.ok) throw new Error('No se pudieron obtener los productos');
  const data = await res.json();
  return data.results || data;
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/api/products/${id}/`);
  if (!res.ok) throw new Error('Producto no encontrado');
  return await res.json();
};

export const getProductBySlug = async (slug) => {
  const products = await getAllProducts();
  return products.find(p => p.slug === slug) || null;
};

// CATEGORÍAS
export const getAllCategories = async () => {
  const res = await fetch(`${API_URL}/api/products/categories/`);
  if (!res.ok) throw new Error('No se pudieron obtener las categorías');
  const data = await res.json();
  return data.results || data;
};

export { API_URL };
