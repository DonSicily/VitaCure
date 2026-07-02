import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-sage-900 text-white/90">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logos/vitacure-logo-white.svg" 
                alt="VitaCure" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <span class="text-3xl">🌿</span>
                    <span class="text-2xl font-bold text-white">VitaCure</span>
                  `;
                }}
              />
            </div>
            <p className="text-cream-200 text-sm max-w-sm">
              Returning to nature, one remedy at a time. Discover 100% natural medication 
              ranked by active potency.
            </p>
            <div className="flex gap-4 mt-4">
              <span className="text-cream-300 text-xs">🌱 Health is Wealth</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="text-cream-200 hover:text-white transition-colors">Browse All</Link></li>
              <li><Link to="/search?q=stress%20relief" className="text-cream-200 hover:text-white transition-colors">Stress Relief</Link></li>
              <li><Link to="/search?q=sleep" className="text-cream-200 hover:text-white transition-colors">Sleep</Link></li>
              <li><Link to="/search?q=immunity" className="text-cream-200 hover:text-white transition-colors">Immunity</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-cream-200">🌍 Global Delivery</li>
              <li className="text-cream-200">📦 Free Shipping Over $50</li>
              <li className="text-cream-200">🔒 Secure Checkout</li>
              <li className="text-cream-200">♻️ Sustainable Packaging</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream-300">
          <p>© 2024 VitaCure. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Made with <HeartIcon className="w-4 h-4 inline text-terracotta-400" /> for nature</span>
            <span className="w-px h-4 bg-white/20"></span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
