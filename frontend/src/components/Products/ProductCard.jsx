import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import ActivePercentageBadge from '../UI/ActivePercentageBadge';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`Added ${product.name} to your basket`);
  };

  // Get product image with fallback
  const getProductImage = () => {
    if (product.images && product.images.length > 0 && !imageError) {
      return `/images/products/${product.images[0]}`;
    }
    return '/images/placeholders/product-placeholder.svg';
  };

  return (
    <Link to={`/product/${product.slug}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md card-hover border border-cream-200">
        {/* Image */}
        <div className="relative h-56 bg-cream-100 overflow-hidden">
          <img 
            src={getProductImage()}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
          {/* Overlay Badge */}
          <div className="absolute top-3 right-3 z-10">
            <ActivePercentageBadge percentage={product.activePercentage} />
          </div>
          
          {/* Brand watermark */}
          {product.profile?.maker?.name && (
            <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium opacity-80">
                {product.profile.maker.name}
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.shortDescription || product.description.substring(0, 80) + '...'}
              </p>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs bg-sage-50 text-sage-700 px-2 py-0.5 rounded-full">
                #{tag.name}
              </span>
            ))}
          </div>
          
          {/* Bottom Row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-100">
            <div>
              <span className="text-2xl font-bold text-sage-700">
                ${product.price.toFixed(2)}
              </span>
              {product.averageRating > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span>{product.averageRating.toFixed(1)}</span>
                  <span>({product.reviewCount})</span>
                </div>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-sage-500 hover:bg-sage-600 text-white p-2.5 rounded-xl transition-all duration-300 hover:scale-110 shadow-md"
              aria-label="Add to cart"
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
