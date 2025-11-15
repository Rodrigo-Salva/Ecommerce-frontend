import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productos, categorias } from '../data/productos';
import { useCart } from '../context/CartContext';
import './DetalleProducto.css';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregadoAlCarrito, setAgregadoAlCarrito] = useState(false);

  useEffect(() => {
    const productoEncontrado = productos.find(p => p.id === parseInt(id));
    if (productoEncontrado) {
      setProducto(productoEncontrado);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleCantidadChange = (tipo) => {
    if (tipo === 'incrementar' && cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    } else if (tipo === 'decrementar' && cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleAgregarAlCarrito = () => {
    addToCart(producto, cantidad);
    setAgregadoAlCarrito(true);
    setTimeout(() => setAgregadoAlCarrito(false), 2000);
  };

  if (!producto) {
    return (
      <div className="loading-container">
        <p>Cargando producto...</p>
      </div>
    );
  }

  const categoriaInfo = categorias.find(c => c.id === producto.categoria);

  return (
    <div className="detalle-producto fade-in">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Volver
          </Link>
        </div>

        <div className="detalle-grid">
          {/* Imagen del Producto */}
          <div className="detalle-imagen-container">
            <div className="detalle-imagen">
              <div className="imagen-placeholder">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Información del Producto */}
          <div className="detalle-info">
            <div className="producto-categoria-badge">
              {categoriaInfo?.nombre}
            </div>

            <h1 className="detalle-titulo">{producto.nombre}</h1>

            {/* Rating */}
            <div className="detalle-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(producto.rating) ? 'star filled' : 'star'}>
                  ★
                </span>
              ))}
              <span className="rating-value">({producto.rating})</span>
            </div>

            {/* Precio */}
            <div className="detalle-precio">
              ${producto.precio}
            </div>

            {/* Descripción */}
            <p className="detalle-descripcion">{producto.descripcion}</p>

            {/* Características */}
            <div className="caracteristicas">
              <h3 className="caracteristicas-titulo">Características:</h3>
              <ul className="caracteristicas-lista">
                {producto.caracteristicas.map((caract, index) => (
                  <li key={index} className="caracteristica-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {caract}
                  </li>
                ))}
              </ul>
            </div>

            {/* Materiales y Dimensiones */}
            <div className="especificaciones">
              <div className="especificacion-item">
                <span className="especificacion-label">Materiales</span>
                <span className="especificacion-valor">{producto.materiales}</span>
              </div>
              <div className="especificacion-item">
                <span className="especificacion-label">Dimensiones</span>
                <span className="especificacion-valor">{producto.dimensiones}</span>
              </div>
            </div>

            {/* Cantidad */}
            <div className="cantidad-container">
              <label className="cantidad-label">Cantidad:</label>
              <div className="cantidad-controls">
                <button
                  className="cantidad-btn"
                  onClick={() => handleCantidadChange('decrementar')}
                  disabled={cantidad <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  value={cantidad}
                  readOnly
                  className="cantidad-input"
                />
                <button
                  className="cantidad-btn"
                  onClick={() => handleCantidadChange('incrementar')}
                  disabled={cantidad >= producto.stock}
                >
                  +
                </button>
              </div>
              <span className="stock-info">
                {producto.stock} disponibles
              </span>
            </div>

            {/* Botón Agregar al Carrito */}
            <button
              className={`btn-agregar-carrito ${agregadoAlCarrito ? 'agregado' : ''}`}
              onClick={handleAgregarAlCarrito}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {agregadoAlCarrito ? 'Agregado al Carrito ✓' : `Agregar al Carrito - $${producto.precio * cantidad}`}
            </button>

            {/* Información adicional */}
            <div className="info-adicional">
              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-9"/>
                  <path d="M14 17H5"/>
                  <circle cx="17" cy="17" r="3"/>
                  <circle cx="7" cy="7" r="3"/>
                </svg>
                <span>Envío gratis en compras +$1000</span>
              </div>
              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Garantía de 2 años</span>
              </div>
              <div className="info-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Devolución en 30 días</span>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        <section className="productos-relacionados">
          <h2 className="section-title">Productos Relacionados</h2>
          <div className="relacionados-grid">
            {productos
              .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
              .slice(0, 4)
              .map(p => (
                <Link key={p.id} to={`/producto/${p.id}`} className="relacionado-card">
                  <div className="relacionado-imagen">
                    <div className="imagen-placeholder-small">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                  </div>
                  <div className="relacionado-info">
                    <h4>{p.nombre}</h4>
                    <p className="relacionado-precio">${p.precio}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DetalleProducto;