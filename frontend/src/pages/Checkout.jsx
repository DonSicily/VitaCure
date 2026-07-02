import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    phone: '',
    shippingMethod: 'standard'
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
      toast.error('Your basket is empty');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        guestEmail: formData.email,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          addressLine1: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        shippingMethod: formData.shippingMethod,
        currency: 'USD'
      };

      const order = await createOrder(orderData);
      
      // Clear cart
      clearCart();
      
      toast.success('Order placed successfully!');
      navigate(`/order/${order.data._id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = formData.shippingMethod === 'express' ? 25 : 
                       formData.shippingMethod === 'priority' ? 15 : 10;
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + shippingCost + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-cream-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="john@example.com"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="10001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Shipping Method</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-cream-200 rounded-xl hover:bg-cream-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleChange}
                    className="text-sage-500"
                  />
                  <div>
                    <span className="font-medium">Standard Shipping</span>
                    <span className="text-sm text-gray-500 block">5-7 business days</span>
                  </div>
                  <span className="ml-auto font-semibold">$10.00</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-cream-200 rounded-xl hover:bg-cream-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="priority"
                    checked={formData.shippingMethod === 'priority'}
                    onChange={handleChange}
                    className="text-sage-500"
                  />
                  <div>
                    <span className="font-medium">Priority Shipping</span>
                    <span className="text-sm text-gray-500 block">3-4 business days</span>
                  </div>
                  <span className="ml-auto font-semibold">$15.00</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-cream-200 rounded-xl hover:bg-cream-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={handleChange}
                    className="text-sage-500"
                  />
                  <div>
                    <span className="font-medium">Express Shipping</span>
                    <span className="text-sm text-gray-500 block">1-2 business days</span>
                  </div>
                  <span className="ml-auto font-semibold">$25.00</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  Processing...
                </>
              ) : (
                `Place Order • $${grandTotal.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md border border-cream-200 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-3 pb-3 border-b border-cream-100">
                  <div className="w-16 h-16 bg-cream-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={`/images/products/${item.image || 'product-placeholder.svg'}`}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/images/placeholders/product-placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                      <span className="font-semibold text-sage-600 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 pt-4 border-t border-cream-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-cream-200">
                <span>Total</span>
                <span className="text-sage-700">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-cream-50 p-3 rounded-xl">
              <span className="text-2xl">🔒</span>
              <span>Secure checkout. Your information is encrypted.</span>
            </div>

            <Link
              to="/"
              className="block text-center text-gray-500 hover:text-gray-700 text-sm mt-4 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
