import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import './MisOrdenes.css';

const MisOrdenes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getAll();
      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError('Error al cargar órdenes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      processing: 'En Proceso',
      shipped: 'Enviada',
      in_transit: 'En Tránsito',
      delivered: 'Entregada',
      cancelled: 'Cancelada',
      refunded: 'Reembolsada',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      processing: '⚙️',
      shipped: '📦',
      in_transit: '🚚',
      delivered: '✔️',
      cancelled: '❌',
      refunded: '💰',
    };
    return icons[status] || '•';
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const handleCancelOrder = async (orderNumber) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta orden?')) {
      try {
        await orderAPI.cancel(orderNumber);
        setError('');
        loadOrders();
      } catch (err) {
        setError('Error al cancelar la orden');
      }
    }
  };

  const handleDownloadInvoice = async (orderNumber) => {
    try {
      await orderAPI.getInvoice(orderNumber);
    } catch (err) {
      setError('Error al descargar la factura');
    }
  };

  if (!user) {
    return (
      <div className="mis-ordenes-page">
        <div className="container">
          <div className="error-container">
            <h2>Debes iniciar sesión</h2>
            <p>Para ver tus órdenes, inicia sesión en tu cuenta</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/login')}
            >
              Ir a Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-ordenes-page">
      <div className="container">
        <div className="ordenes-header">
          <h1>Mis Órdenes</h1>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Continuar Comprando
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <p>Cargando tus órdenes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-container">
            <div className="empty-icon">📭</div>
            <h2>No tienes órdenes aún</h2>
            <p>Cuando realices tu primera compra, aparecerá aquí</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/')}
            >
              Empezar a Comprar
            </button>
          </div>
        ) : (
          <>
            <div className="ordenes-filters">
              <div className="filter-group">
                <label>Filtrar por estado:</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todas las órdenes</option>
                  <option value="pending">Pendientes</option>
                  <option value="confirmed">Confirmadas</option>
                  <option value="processing">En Proceso</option>
                  <option value="shipped">Enviadas</option>
                  <option value="in_transit">En Tránsito</option>
                  <option value="delivered">Entregadas</option>
                  <option value="cancelled">Canceladas</option>
                </select>
              </div>
              <p className="ordenes-count">
                Mostrando {filteredOrders.length} de {orders.length} órdenes
              </p>
            </div>

            <div className="ordenes-grid">
              {filteredOrders.map((order) => (
                <div key={order.id} className="orden-card">
                  <div className="orden-header-card">
                    <div className="orden-numero">
                      <strong>Orden #{order.order_number}</strong>
                      <span className={`status-badge status-${order.status}`}>
                        {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="orden-fecha">
                      {new Date(order.created_at).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="orden-cliente">
                    <div className="cliente-item">
                      <span className="label">Cliente:</span>
                      <span className="valor">{order.full_name}</span>
                    </div>
                    <div className="cliente-item">
                      <span className="label">Email:</span>
                      <span className="valor">{order.email}</span>
                    </div>
                  </div>

                  <div className="orden-items">
                    <strong>Artículos ({order.items?.length || 0})</strong>
                    <div className="items-list">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="item-row">
                          <span className="item-name">{item.product_name}</span>
                          <span className="item-qty">x{item.quantity}</span>
                          <span className="item-price">${parseFloat(item.product_price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="orden-totales">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>${parseFloat(order.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Envío:</span>
                      <span>${parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Impuesto:</span>
                      <span>${parseFloat(order.tax || 0).toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="total-row discount">
                        <span>Descuento:</span>
                        <span>-${parseFloat(order.discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="total-row total-final">
                      <strong>Total:</strong>
                      <strong>${parseFloat(order.total).toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="orden-metodo-pago">
                    <span className="label">Método de pago:</span>
                    <span className="metodo">
                      {order.payment_method === 'credit_card' && '💳 Tarjeta'}
                      {order.payment_method === 'transfer' && '🏦 Transferencia'}
                      {order.payment_method === 'cash' && '💵 Efectivo'}
                      {!['credit_card', 'transfer', 'cash'].includes(order.payment_method) && order.payment_method}
                    </span>
                  </div>

                  {order.order_notes && (
                    <div className="orden-notas">
                      <span className="label">Notas:</span>
                      <p>{order.order_notes}</p>
                    </div>
                  )}

                  <div className="orden-acciones">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    >
                      {selectedOrder?.id === order.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                    </button>
                    {order.status in ['pending', 'confirmed'] && (
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleCancelOrder(order.order_number)}
                      >
                        Cancelar Orden
                      </button>
                    )}
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleDownloadInvoice(order.order_number)}
                    >
                      📄 Factura
                    </button>
                  </div>

                  {selectedOrder?.id === order.id && (
                    <div className="orden-detalles-expandido">
                      <div className="detalles-seccion">
                        <h4>Dirección de Envío</h4>
                        <p>{order.address_line1}</p>
                        {order.address_line2 && <p>{order.address_line2}</p>}
                        <p>{order.city}, {order.state} {order.postal_code}</p>
                        <p>{order.country}</p>
                      </div>

                      {order.history && order.history.length > 0 && (
                        <div className="detalles-seccion">
                          <h4>Historial de Estados</h4>
                          <div className="timeline">
                            {order.history.map((h, idx) => (
                              <div key={idx} className="timeline-item">
                                <span className="timeline-status">{getStatusLabel(h.status)}</span>
                                <span className="timeline-date">
                                  {new Date(h.created_at).toLocaleDateString('es-PE')}
                                </span>
                                {h.comment && <p className="timeline-comment">{h.comment}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="detalles-seccion">
                        <h4>Información de Pago</h4>
                        <p><strong>Estado:</strong> {order.is_paid ? '✅ Pagado' : '⏳ Pendiente'}</p>
                        {order.payment_id && <p><strong>ID Pago:</strong> {order.payment_id}</p>}
                        {order.paid_at && (
                          <p><strong>Fecha de Pago:</strong> {new Date(order.paid_at).toLocaleDateString('es-PE')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MisOrdenes;
