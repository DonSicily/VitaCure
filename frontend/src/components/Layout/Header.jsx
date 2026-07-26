import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import CartSidebar from '../Cart/CartSidebar';

const Header = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/logos/vitacure-logo.svg"
                alt="VitaCure"
                className="h-9 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <span class="text-3xl">🌿</span>
                    <span class="text-2xl font-bold text-sage-800">VitaCure</span>
                  `;
                }}
              />
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
              <Link to="/search" className="text-gray-600 hover:text-sage-600 font-medium transition-colors">
                Browse All
              </Link>
              <Link to="/search?q=sleep" className="text-gray-600 hover:text-sage-600 font-medium transition-colors">
                Sleep
              </Link>
              <Link to="/search?q=stress%20relief" className="text-gray-600 hover:text-sage-600 font-medium transition-colors">
                Stress Relief
              </Link>
            </nav>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ailment..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 focus:border-sage-400 focus:outline-none bg-cream-50/60 text-sm transition-all duration-300"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
              </div>
            </form>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl hover:bg-cream-100 transition-colors flex-shrink-0"
              aria-label="Open basket"
            >
              <ShoppingBagIcon className="w-6 h-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
