import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sparkles,
  Database,
  Server,
  Layers,
  BarChart3,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, showToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing to NexusBI executive updates!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Nexus<span className="text-indigo-400 font-extrabold">BI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Global commerce discovery demo built with PostgreSQL, paginated Express APIs, and price-comparison interfaces. Merchant feeds are not connected; catalog values are illustrative.
            </p>
            <div className="flex items-center gap-3 text-slate-300 text-[11px]">
              <span className="inline-flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-indigo-400" /> PostgreSQL
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-emerald-400" /> Express REST
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" /> Chart.js BI
              </span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Catalog</h4>
            <ul className="space-y-2">
              {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.toLowerCase().replace(/[^a-z]/g, '-'));
                      setCurrentView('products');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Storefront
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Product Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                >
                  BI Admin Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Architecture & Schema
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Executive Digest</h4>
            <p className="text-xs text-slate-400">
              Receive weekly inventory turnover insights and curated product drops.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="executive@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <p>© 2026 NexusBI Platform. Production E-Commerce & BI Engine.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ACID Compliant PostgreSQL
            </span>
            <span>•</span>
            <span>REST API Level 3</span>
            <span>•</span>
            <span>Stateless JWT Auth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
