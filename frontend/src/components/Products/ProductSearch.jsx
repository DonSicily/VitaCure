import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getProducts } from '../../utils/api';

const ProductSearch = ({ onResults, onLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [location.search]);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      onResults([]);
      return;
    }

    onLoading(true);
    try {
      const products = await getProducts({ search: searchQuery });
      onResults(products);
    } catch (error) {
      console.error('Search error:', error);
      onResults([]);
    } finally {
      onLoading(false);
    }
  }, [onResults, onLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      performSearch(query.trim());
    }
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 1) {
      try {
        const products = await getProducts({ search: value });
        const suggestions = products.slice(0, 5).map(p => p.name);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    navigate('/search');
    onResults([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search by ailment... e.g., insomnia, joint pain, anxiety"
            className="w-full px-6 py-4 pl-14 pr-24 rounded-2xl border-2 border-cream-200 focus:border-sage-400 focus:outline-none bg-white/95 backdrop-blur-sm shadow-lg text-lg transition-all duration-300"
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-sage-400" />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-24 top-1/2 transform -translate-y-1/2 p-1 hover:bg-cream-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-terracotta-500 hover:bg-terracotta-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-white rounded-2xl shadow-xl border border-cream-200 overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-6 py-3 hover:bg-sage-50 transition-colors flex items-center gap-3 border-b border-cream-50 last:border-0"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
