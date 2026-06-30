import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-cream-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#f4f7f2',
                color: '#2d4026',
                borderRadius: '16px',
                padding: '16px 24px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
              success: {
                icon: '🌿',
              },
              error: {
                icon: '🌱',
              }
            }}
          />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
