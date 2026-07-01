import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ClockIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const ProductModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cream-100">
                  <Dialog.Title className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="text-3xl">🌿</span>
                    Meet the Remedy
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-cream-50 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {/* Brand/Maker */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-sage-50 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                      {product.profile?.maker?.name && (
                        <img 
                          src={`/images/brands/${product.profile.maker.name.toLowerCase().replace(/\s+/g, '-')}-logo.svg`}
                          alt={product.profile.maker.name}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<span class="text-2xl">🏛️</span>`;
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{product.profile?.maker?.name || 'Artisan Apothecary'}</h3>
                      <p className="text-sm text-gray-600">{product.profile?.maker?.bio || 'Crafted with care'}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <MapPinIcon className="w-3 h-3" />
                        <span>{product.profile?.maker?.location || 'Global'}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <ClockIcon className="w-3 h-3" />
                        <span>Since {product.profile?.maker?.foundedYear || '2020'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Origin Story */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span>📖</span> Origin Story
                    </h4>
                    <p className="text-gray-600 leading-relaxed bg-cream-50 p-4 rounded-xl">
                      {product.profile?.originStory || 'A time-honored natural remedy, crafted with traditional wisdom and modern care.'}
                    </p>
                  </div>

                  {/* Harvest Cycle */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span>🌱</span> Harvest Cycle
                    </h4>
                    <div className="flex items-center gap-3 bg-white border border-cream-200 p-4 rounded-xl">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                        🌾
                      </div>
                      <div>
                        <p className="text-gray-600">
                          {product.profile?.harvestCycle || 'Harvested at peak potency for maximum active compounds.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* All Ingredients */}
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span>🧪</span> All Ingredients
                    </h4>
                    <div className="space-y-2">
                      {product.ingredients && product.ingredients.length > 0 ? (
                        product.ingredients.map((ingredient, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white border border-cream-100 rounded-xl hover:border-sage-200 transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-lg">
                                {ingredient.source === 'Organic' ? '🌿' : 
                                 ingredient.source === 'Wildcrafted' ? '🌲' : '🌱'}
                              </span>
                              <div>
                                <p className="font-medium text-gray-800">{ingredient.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className={`px-2 py-0.5 rounded-full ${
                                    ingredient.source === 'Organic' ? 'bg-green-100 text-green-700' :
                                    ingredient.source === 'Wildcrafted' ? 'bg-amber-100 text-amber-700' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {ingredient.source}
                                  </span>
                                  {ingredient.benefits && ingredient.benefits.length > 0 && (
                                    <span className="text-gray-400">•</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {ingredient.percentage && (
                              <div className="text-right">
                                <span className="text-sm font-bold text-sage-600">
                                  {ingredient.percentage}%
                                </span>
                                <div className="w-16 h-1 bg-cream-200 rounded-full mt-1">
                                  <div 
                                    className="h-full bg-sage-400 rounded-full"
                                    style={{ width: `${ingredient.percentage}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          Full ingredient list coming soon
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-cream-100 bg-cream-50">
                  <button
                    onClick={onClose}
                    className="w-full btn-primary"
                  >
                    Close Profile
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductModal;
