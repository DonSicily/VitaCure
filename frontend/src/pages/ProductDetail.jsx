import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import ProductModal from '../components/Products/ProductModal';
import ActivePercentageBadge from '../components/UI/ActivePercentageBadge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { getProductBySlug } from '../utils/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} × ${product.name} to your basket`);
    }
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0 && val <= product?.stock) {
      setQuantity(val);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product?.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌿</div>
          <h3 className="text-xl font-semibold text-gray-600">Product not found</h3>
          <Link to="/" className="mt-4 btn-primary inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-sage-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/search" className="hover:text-sage-600">Remedies</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-cream-200">
            <div className="relative h-96 lg:h-[500px]">
              <img
                src={`/images/products/${product.images?.[0] || 'product-placeholder.svg'}`}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/images/placeholders/product-placeholder.svg';
                }}
              />
              <div className="absolute top-4 right-4">
                <ActivePercentageBadge percentage={product.activePercentage} />
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`/images/products/${img}`}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-transparent hover:border-sage-400 cursor-pointer transition-all"
                    onError={(e) => {
                      e.target.src = '/images/placeholders/product-placeholder.svg';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(product.averageRating) ? (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <StarOutline key={i} className="w-5 h-5 text-yellow-400" />
                    )
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-sage-600 font-medium">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-sage-700">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? '✅ In Stock' : '❌ Out of Stock'}
              </span>
              {product.stock > 0 && (
                <span className="text-sm text-gray-500">({product.stock} available)</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-cream-200 rounded-xl overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-2 hover:bg-cream-50 transition-colors text-lg font-medium"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 py-2 text-center border-x border-cream-200 focus:outline-none"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-2 hover:bg-cream-50 transition-colors text-lg font-medium"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to Basket
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-500' 
                    : 'border-cream-200 hover:bg-cream-50 text-gray-600'
                }`}
              >
                <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-red-500' : ''}`} />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cream-200 hover:bg-cream-50 text-gray-600 transition-colors">
                <ShareIcon className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Meet the Remedy Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-sage-50 to-cream-50 border-2 border-sage-200 rounded-2xl text-sage-700 font-semibold hover:from-sage-100 hover:to-cream-100 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🌿</span>
              Meet the Remedy
              <span className="text-sm font-normal text-sage-500">→ Profile & Ingredients</span>
            </button>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-cream-100">
              {product.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/search?q=${encodeURIComponent(tag.name)}`}
                  className="px-3 py-1 bg-sage-50 text-sage-600 rounded-full text-sm hover:bg-sage-100 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductDetail;
