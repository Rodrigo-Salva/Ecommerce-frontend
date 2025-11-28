import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { orderAPI } from '../services/api';
import './StripePaymentForm.css';

const StripePaymentForm = ({ amount, onSuccess, onError, isProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // MODO SIMULACIÓN para testing sin Stripe configurado
      // En producción, esto debería usar Stripe real
      
      console.log('🧪 Modo Simulación - Procesando pago de $' + amount);

      // Simular validación de tarjeta
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Elemento de tarjeta no encontrado');
      }

      // Simular procesamiento de pago (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar un ID de pago simulado
      const fakePaymentIntentId = `sim_${Date.now()}`;
      
      console.log('✅ Pago simulado exitoso:', fakePaymentIntentId);
      
      // Llamar success con el ID simulado
      onSuccess(fakePaymentIntentId);

    } catch (err) {
      const errorMsg = err.message || 'Error procesando el pago';
      setErrorMessage(errorMsg);
      onError(errorMsg);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="test-mode-badge">
        🧪 Modo Test - Pago Simulado (para demostración)
      </div>

      <div className="card-element-wrapper">
        <label>Tarjeta de Crédito/Débito</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424242',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#fa755a',
              },
            },
          }}
        />
        <small style={{marginTop: '8px', color: '#666', display: 'block'}}>
          Para testing: Usa 4242 4242 4242 4242
        </small>
      </div>

      {errorMessage && (
        <div className="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || isProcessing}
        className="btn btn-primary btn-pay"
      >
        {loading ? 'Procesando pago...' : `Pagar $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripePaymentForm;

