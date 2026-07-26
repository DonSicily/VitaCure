import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { getOrder } from '../utils/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌿</div>
          <h3 className="text-xl font-semibold text-gray-600">We couldn't find that order</h3>
          <Link to="/" className="mt-4 btn-primary inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-md border border-cream-200 p-8 text-center">
        <CheckCircleIcon className="w-16 h-16 text-sage-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order confirmed</h1>
        <p className="text-gray-600 mb-6">
          Thank you! Your order is being prepared. A confirmation has been sent to{' '}
          <span className="font-medium">{order.guestEmail}</span>.
        </p>

        <div className="text-left bg-cream-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono text-gray-700">{order._id}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Status</span>
            <span className="font-medium text-sage-700 capitalize">{order.orderStatus}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-semibold text-gray-800">
              ${order.total?.toFixed(2)} {order.currency}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {order.items?.map((item) => (
            <div key={item._id || item.product} className="flex justify-between text-sm py-2 border-b border-cream-100 last:border-0">
              <span className="text-gray-700">{item.name} × {item.quantity}</span>
              <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Link to="/" className="btn-primary inline-block mt-8">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
