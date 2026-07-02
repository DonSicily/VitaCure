import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/Products/ProductCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { getProducts } from '../utils/api';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
    fetchProducts(q);
  }, [location.search]);

  const fetchProducts = async (q) => {
    setLoading(true);
    try {
      const data = await getProducts({ 
        search: q,
        sort: sortBy === 'relevance' ? undefined : sortBy
      });
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    const params = new URLSearchParams(location.search);
    params.set('sort', newSort);
    navigate(`/search?${params.toString()}`);
    fetchProducts(searchQuery);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span>🔍</span>
          Search Results
          {searchQuery && (
            <span className="text-lg font-normal text-gray-500">
              for "{searchQuery}"
            </span>
          )}
        </h1>
        <p className="text-gray-600 mt-2">
          {products.length} natural remedies found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-white rounded-2xl shadow-sm border border-cream-200">
        <div className="flex items-center gap-3">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 rounded-xl border border-cream-200 focus:border-sage-400 focus:outline-none bg-cream-50/50 text-sm"
          >
            <option value="relevance">Relevance (Active %)</option>
            <option value="active-desc">Highest Active %</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        
        <button
          onClick={() => fetchProducts(searchQuery)}
          className="flex items-center gap-2 text-sage-600 hover:text-sage-700 transition-colors text-sm font-medium"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Refresh Results
        </button>
      </div>

      {/* Results Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌿</div>
          <h3 className="text-xl font-semibold text-gray-600">No remedies found</h3>
          <p className="text-gray-400 mt-2">
            Try searching for different ailments or browse our categories
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 btn-primary inline-block"
          >
            Browse All Remedies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
