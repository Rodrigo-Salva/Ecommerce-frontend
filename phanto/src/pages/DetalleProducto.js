import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL, productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProductDetail, useRelatedProducts } from '../hooks/useProducts';
import { useProductReviews, useCreateReview } from '../hooks/useReviews';
import './DetalleProducto.css';

const DetalleProducto = () => {
  const queryClient = useQueryClient();
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItemAsync, isAddingItem } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [agregadoAlCarrito, setAgregadoAlCarrito] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const isNumeric = /^\d+$/.test(slugOrId);

  const { data: productoBySlug, isLoading: loadingSlug } = useProductDetail(
    !isNumeric ? slugOrId : null
  );

  const { data: relatedProducts } = useRelatedProducts(
    !isNumeric ? slugOrId : null
  );

  const { data: reviews, isLoading: loadingReviews } = useProductReviews(
    !isNumeric ? slugOrId : null
  );

  const createReviewMutation = useCreateReview();

  const isLoading = loadingSlug;

  const producto = productoBySlug ? {
    id: productoBySlug.id,
    slug: productoBySlug.slug,
    nombre: productoBySlug.name || productoBySlug.nombre,
    precio: productoBySlug.final_price || productoBySlug.price || productoBySlug.precio || 0,
    precio_unitario: productoBySlug.price || productoBySlug.precio || 0,
    stock: productoBySlug.stock || 0,
    categoria: productoBySlug.category?.name || productoBySlug.categoria || '',
    descripcion: productoBySlug.description || productoBySlug.descripcion || '',
    caracteristicas: productoBySlug.specifications?.map(s => `${s.name}: ${s.value}`) || productoBySlug.specs || productoBySlug.features || [],
    materiales: productoBySlug.materials?.map(m => m.name).join(', ') || productoBySlug.materiales || '',
    dimensiones: productoBySlug.dimensions || productoBySlug.dimensiones || (productoBySlug.width ? `${productoBySlug.width}x${productoBySlug.height}x${productoBySlug.depth} cm` : ''),
    rating: productoBySlug.average_rating || productoBySlug.rating || 0,
    review_count: productoBySlug.review_count || 0,
    primary_image: productoBySlug.primary_image || productoBySlug.image || '',
    images: productoBySlug.images || [],
  } : null;

  const relacionados = relatedProducts
    ? relatedProducts.map(p => ({ 
        id: p.id, 
        slug: p.slug,
        nombre: p.name, 
        precio: p.final_price || p.price || p.precio || 0,
        primary_image: p.primary_image,
        discount_percentage: p.discount_percentage,
        is_new: p.is_new
      }))
    : [];

  const handleProductHover = (productSlug) => {
    if (!productSlug) return;
    queryClient.prefetchQuery({
      queryKey: ['product', productSlug],
      queryFn: () => productAPI.getBySlug(productSlug),
      staleTime: 1000 * 60 * 5,
    });
  };

  const handleCantidadChange = (tipo) => {
    if (!producto) return;
    
    if (tipo === 'incrementar' && cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    } else if (tipo === 'decrementar' && cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const handleAgregarAlCarrito = async () => {
    if (!producto) return;

    try {
      console.log('🔵 Intentando agregar al carrito:', {
        productId: producto.id,
        quantity: cantidad
      });

      await addItemAsync({ 
        productId: producto.id, 
        quantity: cantidad 
      });
      
      console.log('✅ Producto agregado exitosamente');
      
      setAgregadoAlCarrito(true);
      setTimeout(() => {
        setAgregadoAlCarrito(false);
        setCantidad(1);
      }, 2000);

    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error);
      console.error('Detalles:', error.message);
      alert('No se pudo agregar el producto al carrito. Por favor, intenta de nuevo.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña');
      navigate('/login');
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        product: producto.id,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        productSlug: producto.slug
      });

      setReviewForm({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      alert('¡Reseña enviada exitosamente!');
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      alert('Error al enviar la reseña: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="error-container">
        <p>Producto no encontrado</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="detalle-producto fade-in">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Volver
          </Link>
        </div>

        <div className="detalle-grid">
          <div className="detalle-imagen-container">
            <div className="detalle-imagen">
              {producto.primary_image ? (
                <img 
                  src={`${API_URL}${producto.primary_image}`}
                  alt={producto.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="imagen-placeholder">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                </div>
              )}
            </div>

            {producto.images && producto.images.length > 1 && (
              <div className="imagenes-miniaturas">
                {producto.images.slice(0, 4).map((img, index) => (
                  <div key={index} className="miniatura">
                    <img 
                      src={`${API_URL}${img.image}`}
                      alt={img.alt_text || `Imagen ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detalle-info">
            <div className="producto-categoria-badge">
              {producto.categoria}
            </div>

            <h1 className="detalle-titulo">{producto.nombre}</h1>

            <div className="detalle-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(producto.rating) ? 'star filled' : 'star'}>
                  ★
                </span>
              ))}
              <span className="rating-value">({producto.rating}) - {producto.review_count} reseñas</span>
            </div>

            <div className="detalle-precio">
              ${producto.precio}
            </div>

            <p className="detalle-descripcion">{producto.descripcion}</p>

            {producto.caracteristicas && producto.caracteristicas.length > 0 && (
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
            )}

            <div className="especificaciones">
              {producto.materiales && (
                <div className="especificacion-item">
                  <span className="especificacion-label">Materiales</span>
                  <span className="especificacion-valor">{producto.materiales}</span>
                </div>
              )}
              {producto.dimensiones && (
                <div className="especificacion-item">
                  <span className="especificacion-label">Dimensiones</span>
                  <span className="especificacion-valor">{producto.dimensiones}</span>
                </div>
              )}
            </div>

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

            <button
              className={`btn-agregar-carrito ${agregadoAlCarrito ? 'agregado' : ''}`}
              onClick={handleAgregarAlCarrito}
              disabled={isAddingItem || agregadoAlCarrito}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {isAddingItem ? 'Agregando...' : agregadoAlCarrito ? 'Agregado al Carrito ✓' : `Agregar al Carrito - $${producto.precio * cantidad}`}
            </button>

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

        <section className="reviews-section">
          <div className="reviews-header">
            <div>
              <h2 className="section-title">Reseñas de Clientes</h2>
              <p className="reviews-subtitle">
                {reviews && reviews.length > 0 
                  ? `${reviews.length} ${reviews.length === 1 ? 'reseña' : 'reseñas'}`
                  : 'Sé el primero en opinar sobre este producto'
                }
              </p>
            </div>
            {user && !showReviewForm && (
              <button 
                className="btn-write-review"
                onClick={() => setShowReviewForm(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Escribir Reseña
              </button>
            )}
            {!user && (
              <Link to="/login" className="btn-write-review">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Inicia sesión para opinar
              </Link>
            )}
          </div>

          {showReviewForm && (
            <div className="review-form-container">
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <h3>Comparte tu experiencia</h3>
                
                <div className="form-group">
                  <label>Tu calificación</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star-input ${reviewForm.rating >= star ? 'filled' : ''}`}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      >
                        ★
                      </span>
                    ))}
                    <span className="rating-label">{reviewForm.rating} de 5 estrellas</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Título de tu reseña</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    placeholder="Resume tu experiencia en pocas palabras"
                    maxLength="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cuéntanos más</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="¿Qué te gustó o no te gustó? ¿Para quién es este producto?"
                    rows="5"
                    maxLength="1000"
                    required
                  />
                  <span className="char-count">{reviewForm.comment.length}/1000</span>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit-review" disabled={createReviewMutation.isPending}>
                    {createReviewMutation.isPending ? (
                      <>
                        <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      'Publicar Reseña'
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel-review"
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewForm({ rating: 5, title: '', comment: '' });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="reviews-list">
            {loadingReviews ? (
              <div className="reviews-loading">
                <svg className="spinner" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                <p>Cargando reseñas...</p>
              </div>
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => {
                const userName = typeof review.user === 'string' ? review.user : (review.user?.username || review.user?.email || 'Usuario');
                const userInitial = userName.charAt(0).toUpperCase();
                const isOwnReview = user && user.username === userName;
                
                return (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-user">
                        <div className="user-avatar">
                          {userInitial}
                        </div>
                        <div className="user-info">
                          <h4>{userName}</h4>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="review-meta">
                        <span className="review-date">
                          {new Date(review.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {review.is_verified_purchase && (
                          <span className="verified-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Compra verificada
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="review-title">{review.title}</h3>
                    <p className="review-comment">{review.comment}</p>
                    {isOwnReview && (
                      <div className="review-owner-actions">
                        <Link to="/perfil?tab=reviews" className="btn-edit-review">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          Editar mi reseña
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-reviews">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <h3>Aún no hay reseñas</h3>
                <p>¡Sé el primero en compartir tu opinión sobre este producto!</p>
              </div>
            )}
          </div>
        </section>

        {relacionados.length > 0 && (
          <section className="productos-relacionados">
            <h2 className="section-title">También te puede interesar</h2>
            <div className="relacionados-grid">
              {relacionados.map(p => (
                <Link 
                  key={p.id} 
                  to={`/producto/${p.slug || p.id}`} 
                  className="relacionado-card"
                  onMouseEnter={() => handleProductHover(p.slug)}
                >
                  <div className="relacionado-imagen">
                    {p.primary_image ? (
                      <img 
                        src={`${API_URL}${p.primary_image}`}
                        alt={p.nombre}
                      />
                    ) : (
                      <div className="imagen-placeholder-small">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <path d="M21 15l-5-5L5 21"/>
                        </svg>
                      </div>
                    )}
                    {p.is_new && (
                      <span className="badge-nuevo-small">Nuevo</span>
                    )}
                    {p.discount_percentage && parseFloat(p.discount_percentage) > 0 && (
                      <span className="badge-descuento-small">-{p.discount_percentage}%</span>
                    )}
                  </div>
                  <div className="relacionado-info">
                    <h4>{p.nombre}</h4>
                    <p className="relacionado-precio">${p.precio}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DetalleProducto;