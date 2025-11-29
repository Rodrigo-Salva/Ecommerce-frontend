import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Categorias from './pages/Categorias';
import ProductosPorCategoria from './pages/ProductosPorCategoria';
import BuscarProductos from './pages/BuscarProductos';
import DetalleProducto from './pages/DetalleProducto';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Perfil from './pages/Perfil';
import MisOrdenes from './pages/MisOrdenes';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/categoria/:slug" element={<ProductosPorCategoria />} />
                <Route path="/buscar" element={<BuscarProductos />} />
                <Route path="/producto/:slug" element={<DetalleProducto />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/perfil" 
                  element={
                    <ProtectedRoute>
                      <Perfil />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mis-ordenes" 
                  element={
                    <ProtectedRoute>
                      <MisOrdenes />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;