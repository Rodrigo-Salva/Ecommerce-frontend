import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Carrito.css';

const Carrito = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  const handleCantidadChange = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removeFromCart(productoId);
    } else {
      updateQuantity(productoId, nuevaCantidad);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="carrito-vacio">
        <div className="container">
          <div className="vacio-content fade-in">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos increíbles para comenzar tu compra</p>
            <Link to="/" className="btn btn-primary">
              Explorar Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-page fade-in">
      <div className="container">
        <div className="carrito-header">
          <h1 className="carrito-titulo">Carrito de Compras</h1>
          <button className="btn-limpiar" onClick={clearCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Vaciar Carrito
          </button>
        </div>

        <div className="carrito-grid">
          {/* Items del Carrito */}
          <div className="carrito-items">
            {cartItems.map((item) => (
              <div key={item.id} className="carrito-item">
                <Link to={`/producto/${item.id}`} className="item-imagen">
                  <div className="imagen-placeholder-carrito">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                  </div>
                </Link>

                <div className="item-info">
                  <Link to={`/producto/${item.id}`} className="item-nombre">
                    {item.nombre}
                  </Link>
                  <p className="item-categoria">{item.categoria}</p>
                  <p className="item-precio-unitario">${item.precio} c/u</p>
                </div>

                <div className="item-cantidad">
                  <button
                    className="cantidad-btn-carrito"
                    onClick={() => handleCantidadChange(item.id, item.cantidad - 1)}
                  >
                    −
                  </button>
                  <span className="cantidad-valor">{item.cantidad}</span>
                  <button
                    className="cantidad-btn-carrito"
                    onClick={() => handleCantidadChange(item.id, item.cantidad + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-precio-total">
                  ${item.precio * item.cantidad}
                </div>

                <button
                  className="item-eliminar"
                  onClick={() => removeFromCart(item.id)}
                  title="Eliminar producto"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Resumen del Carrito */}
          <div className="carrito-resumen">
            <h3 className="resumen-titulo">Resumen del Pedido</h3>

            <div className="resumen-detalles">
              <div className="resumen-linea">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="resumen-linea">
                <span>Envío</span>
                <span className={total >= 1000 ? 'gratis' : ''}>
                  {total >= 1000 ? 'Gratis' : '$50'}
                </span>
              </div>
              {total >= 1000 && (
                <div className="envio-gratis-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  ¡Envío gratis aplicado!
                </div>
              )}
              <div className="resumen-divider"></div>
              <div className="resumen-linea total">
                <span>Total</span>
                <span>${total + (total >= 1000 ? 0 : 50)}</span>
              </div>
            </div>

            <button className="btn-finalizar">
              Proceder al Pago
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
                <path d="M12 5l7 7-7 7"/>
              </svg>
            </button>

            <Link to="/" className="btn-continuar">
              Continuar Comprando
            </Link>

            <div className="garantias">
              <div className="garantia-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                <span>Pago seguro</span>
              </div>
              <div className="garantia-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Garantía de 2 años</span>
              </div>
              <div className="garantia-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Devolución gratis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;