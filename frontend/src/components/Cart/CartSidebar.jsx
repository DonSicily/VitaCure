import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-y-0 right-0 flex max-w-full">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="w-screen max-w-md bg-white shadow-2xl">
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cream-100">
                  <Dialog.Title className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    🛒 Your Basket
                    <span className="text-sm font-normal text-gray-500">({totalItems} items)</span>
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-cream-50 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🌿</div>
                      <h3 className="text-xl font-semibold text-gray-600">Your basket is empty</h3>
                      <p className="text-gray-400 mt-2">Start exploring natural remedies</p>
                      <button
                        onClick={onClose}
                        className="mt-6 btn-primary"
                      >
                        Browse Remedies
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.productId} className="flex gap-4 p-4 bg-cream-50 rounded-xl">
                          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <img
                              src={`/images/products/${item.image || 'product-placeholder.svg'}`}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.target.src = '/images/placeholders/product-placeholder.svg';
                              }}
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                                {item.activePercentage}% Active
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-sage-700">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="p-1 hover:bg-cream-200 rounded-full transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <MinusIcon className="w-4 h-4 text-gray-500" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="p-1 hover:bg-cream-200 rounded-full transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <PlusIcon className="w-4 h-4 text-gray-500" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.productId)}
                                  className="p-1 hover:bg-red-50 rounded-full transition-colors ml-1"
                                  aria-label="Remove item"
                                >
                                  <TrashIcon className="w-4 h-4 text-red-400 hover:text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                  <div className="border-t border-cream-100 p-6 bg-cream-50">
                    <div className="flex justify-between text-lg font-semibold mb-4">
                      <span>Total</span>
                      <span className="text-sage-700">${totalPrice.toFixed(2)}</span>
                    </div>
                    <Link
                      to="/checkout"
                      onClick={onClose}
                      className="w-full btn-primary text-center block"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      onClick={onClose}
                      className="w-full text-center text-gray-500 hover:text-gray-700 text-sm mt-3 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CartSidebar;
