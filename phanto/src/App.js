import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Categorias from './pages/Categorias';
import ProductosPorCategoria from './pages/ProductosPorCategoria';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import MisOrdenes from './pages/MisOrdenes';

// Inicializar Stripe (reemplaza con tu clave pública real)
// Para testing, usa la clave pública de test de Stripe
const stripePromise = loadStripe('pk_test_51QnLLjJvWs3Hs2lLEp9RkZCPqKU8DRVqQ5E5Yz8nXmK0X9Z3K8Y7Y9Z0Z1Z2Z3Z4Z5Z6Z7Z8Z9Z0Z1Z2Z3Z4Z5Z6Z7Z8Z9');

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:slugOrId" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/categoria/:slug" element={<ProductosPorCategoria />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/mis-ordenes" element={<MisOrdenes />} />
          </Routes>
        </Elements>
      </div>
    </Router>
  );
}

export default App;