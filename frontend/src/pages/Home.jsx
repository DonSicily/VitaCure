import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, SparklesIcon, GlobeAltIcon, HeartIcon } from '@heroicons/react/24/outline';
import ProductCard from '../components/Products/ProductCard';
import { getProducts } from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingTags, setTrendingTags] = useState([
    'stress relief', 'anxiety', 'sleep', 'immunity', 
    'joint pain', 'digestion', 'energy', 'skin health'
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ sort: 'active-desc', limit: 6 });
        setFeaturedProducts(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sage-500 to-sage-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-6">
            <span className="text-sm font-semibold">🌿 Return to Nature</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Health is <span className="text-cream-300">Wealth</span>
          </h1>
          <p className="text-xl md:text-2xl text-cream-100 max-w-2xl mx-auto mb-8 opacity-90">
            Discover 100% natural medication, ranked by active potency
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ailment... e.g., insomnia, joint pain, anxiety"
                className="w-full px-6 py-4 pl-14 rounded-2xl text-gray-800 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-terracotta-300 shadow-xl text-lg"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-sage-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-terracotta-500 hover:bg-terracotta-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Trending Tags */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-sm opacity-75 mr-2">Trending:</span>
            {trendingTags.slice(0, 6).map((tag) => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-all duration-300 backdrop-blur-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-cream-50 rounded-t-[100px]"></div>
      </section>

      {/* Features Banner */}
      <section className="py-12 px-4 bg-white/50 backdrop-blur-sm border-b border-cream-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-sage-100 p-3 rounded-full">
              <SparklesIcon className="w-8 h-8 text-sage-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Active Percentage™</h3>
              <p className="text-sm text-gray-600">Filter by potency, not just reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-sage-100 p-3 rounded-full">
              <GlobeAltIcon className="w-8 h-8 text-sage-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Global Delivery</h3>
              <p className="text-sm text-gray-600">Worldwide shipping from source</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-sage-100 p-3 rounded-full">
              <HeartIcon className="w-8 h-8 text-sage-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">100% Natural</h3>
              <p className="text-sm text-gray-600">No synthetic additives, ever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">🌿 Featured Remedies</h2>
            <p className="text-gray-600 mt-1">Highest active percentage, naturally</p>
          </div>
          <Link to="/search" className="text-sage-600 font-semibold hover:text-sage-700 transition-colors">
            View All →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 h-80">
                <div className="bg-cream-200 h-40 rounded-xl mb-4"></div>
                <div className="bg-cream-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-cream-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
