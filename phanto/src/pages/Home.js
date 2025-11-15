// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI, API_URL } from '../services/api';
import './Home.css';

const Home = () => {
  const [searchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaParam || 'todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {};
        
        // Filtrar por categoría si existe
        if (categoriaParam && categoriaParam !== 'todos') {
          params.category = categoriaParam;
        }

        const data = await productAPI.getAll(params);
        setProductos(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [categoriaParam]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await categoryAPI.getAll();
        setCategorias(data.results || data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };

    fetchCategorias();
  }, []);

  const filtrarPorCategoria = (categoriaSlug) => {
    setCategoriaActiva(categoriaSlug);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Transforma Tu Espacio con
              <span className="hero-accent"> Elegancia</span>
            </h1>
            <p className="hero-subtitle">
              Descubre muebles de diseño exclusivo que combinan estilo, confort y funcionalidad.
            </p>
            <div className="hero-actions">
              <a href="#productos" className="btn btn-primary">
                Explorar Colección
              </a>
              <a href="#categorias" className="btn btn-outline">
                Ver Categorías
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Section */}
      <section id="categorias" className="categorias-section">
        <div className="container">
          <h2 className="section-title">Explora por Categoría</h2>
          <p className="section-subtitle">
            Encuentra exactamente lo que necesitas para cada espacio de tu hogar
          </p>

          <div className="categorias-grid">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                to={`/?categoria=${cat.slug}`}
                className="categoria-card"
                onClick={() => filtrarPorCategoria(cat.slug)}
              >
                <div className="categoria-overlay">
                  <h3 className="categoria-nombre">{cat.name}</h3>
                  <p className="categoria-descripcion">{cat.product_count} productos</p>
                  <span className="categoria-cta">Ver Productos →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Section */}
      <section id="productos" className="productos-section">
        <div className="container">
          <div className="productos-header">
            <div>
              <h2 className="section-title">
                {categoriaActiva === 'todos' ? 'Todos los Productos' : 
                 categorias.find(c => c.slug === categoriaActiva)?.name || 'Productos'}
              </h2>
              <p className="section-subtitle">
                {productos.length} productos disponibles
              </p>
            </div>

            <div className="filtros">
              <button
                className={`filtro-btn ${categoriaActiva === 'todos' ? 'active' : ''}`}
                onClick={() => filtrarPorCategoria('todos')}
              >
                Todos
              </button>
              {categorias.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/?categoria=${cat.slug}`}
                  className={`filtro-btn ${categoriaActiva === cat.slug ? 'active' : ''}`}
                  onClick={() => filtrarPorCategoria(cat.slug)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="productos-grid">
            {productos.map((producto) => (
              <Link
                key={producto.id}
                to={`/producto/${producto.slug}`}
                className="producto-card"
              >
                <div className="producto-imagen">
                  {producto.primary_image ? (
                    <img 
                      src={`${API_URL}${producto.primary_image}`} 
                      alt={producto.name}
                    />
                  ) : (
                    <div className="producto-placeholder">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="producto-info">
                  <div className="producto-categoria-tag">
                    {producto.category?.name}
                  </div>
                  
                  <h3 className="producto-nombre">{producto.name}</h3>
                  
                  <div className="producto-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(parseFloat(producto.average_rating || 0)) ? 'star filled' : 'star'}>
                        ★
                      </span>
                    ))}
                    <span className="rating-numero">({producto.average_rating || '0.0'})</span>
                  </div>

                  <div className="producto-footer">
                    <div className="producto-precios">
                      {producto.discount_price ? (
                        <>
                          <p className="producto-precio-original">${producto.price}</p>
                          <p className="producto-precio">${producto.final_price}</p>
                        </>
                      ) : (
                        <p className="producto-precio">${producto.price}</p>
                      )}
                    </div>
                    <button className="btn-ver-mas">
                      Ver más →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-9"/>
                  <path d="M14 17H5"/>
                  <circle cx="17" cy="17" r="3"/>
                  <circle cx="7" cy="7" r="3"/>
                </svg>
              </div>
              <h3>Envío Gratis</h3>
              <p>En compras mayores a $1000</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Garantía Extendida</h3>
              <p>2 años en todos los productos</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Entrega Rápida</h3>
              <p>Recibe en 24-48 horas</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <h3>Devoluciones Fáciles</h3>
              <p>30 días para devoluciones</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;