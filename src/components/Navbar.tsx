import React, { useEffect, useState } from 'react';
import { useApp, CurrencyCode } from '../context/AppContext.tsx';
import { api, Category } from '../services/api.ts';
import {
  Heart,
  Search,
  User as UserIcon,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Package,
  Sparkles,
  Scale,
  Bot,
  Zap,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    demoUsers,
    switchUser,
    currentView,
    setCurrentView,
    wishlist,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    comparisonList,
    setIsAiAssistantOpen,
    currency,
    setCurrency,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch((error) => console.error('Failed to load categories:', error));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'products') {
      setCurrentView('products');
    }
  };

  const navigateTo = (view: string, category: string | null = null) => {
    setSelectedCategory(category);
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Demo Catalog
            </span>
            <span>Merchant feeds are not connected. Demo prices and offers are illustrative.</span>
          </div>

          {/* Quick Persona & Currency Switcher in Header */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 hidden sm:inline">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-1.5 py-0.5 text-xs font-semibold focus:outline-none"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="AED">AED</option>
              </select>
            </div>

            {/* Persona Switcher */}
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${currentUser?.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span>{currentUser ? `${currentUser.name} (${currentUser.role})` : 'Select User'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-xl border border-slate-200 py-1 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">1-Click Role Switcher</p>
                    <p className="text-xs text-slate-600">Instantly test customer vs admin permissions</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {demoUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          switchUser(user);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                          currentUser?.id === user.id ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="truncate max-w-[130px] font-medium">{user.name}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{user.email}</p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                            user.role === 'admin'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {user.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-indigo-900 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800">
                  NEXUS<span className="text-indigo-600">BI</span>
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-indigo-600 -mt-1">
                  Price Intelligence
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => navigateTo('home')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'home'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Storefront
              </button>
              <button
                onClick={() => navigateTo('products')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'products'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Catalog
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen((open) => !open)}
                  aria-expanded={isCategoriesOpen}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1"
                >
                  All Categories
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {isCategoriesOpen && <div className="absolute left-0 top-full z-50 mt-2 w-[min(80vw,900px)] max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                    {categories.map((category) => {
                      let subcategories: string[] = [];
                      try {
                        subcategories = JSON.parse(category.subcategories || '[]');
                      } catch {
                        subcategories = [];
                      }
                      return <section key={category.id}>
                        <button onClick={() => { navigateTo('products', category.slug); setIsCategoriesOpen(false); }} className="text-left text-sm font-bold text-slate-900 hover:text-amber-700">
                          {category.name}
                        </button>
                        <div className="mt-2 flex flex-col items-start gap-1">
                          {subcategories.slice(0, 6).map((subcategory) => <button key={subcategory} onClick={() => { setSelectedCategory(category.slug); setSearchQuery(subcategory); setCurrentView('products'); setIsCategoriesOpen(false); }} className="text-left text-xs text-slate-500 hover:text-slate-900">
                            {subcategory}
                          </button>)}
                        </div>
                      </section>;
                    })}
                  </div>
                </div>}
              </div>
              <button
                onClick={() => navigateTo('compare')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                  currentView === 'compare'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>Compare</span>
                {comparisonList.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {comparisonList.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigateTo('orders')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'orders'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Track Orders
              </button>
              <button
                onClick={() => navigateTo('about')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'about'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Architecture
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search across Amazon, Croma, Flipkart..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100 border border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Ask AI Button */}
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-all shadow-2xs"
              title="Open Nexus AI Shopping Assistant"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">Nexus AI</span>
            </button>

            {/* Admin BI Dashboard Button */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
              title="Access Business Intelligence Admin Portal"
            >
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">BI Admin</span>
              {currentUser?.role === 'admin' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('products')}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('products')}
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all hover:shadow"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </button>

            {/* User Profile */}
            <button
              onClick={() => setCurrentView('profile')}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="User Profile"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, brands, and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100 border border-slate-200 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => navigateTo('home')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-800"
            >
              Storefront
            </button>
            <button
              onClick={() => navigateTo('products')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-800"
            >
              All Products
            </button>
            <button
              onClick={() => navigateTo('compare')}
              className="p-3 text-left rounded-xl bg-purple-50 hover:bg-purple-100 text-sm font-medium text-purple-700"
            >
              Comparison Matrix ({comparisonList.length})
            </button>
            <button
              onClick={() => navigateTo('orders')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-800"
            >
              My Orders
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className="p-3 text-left rounded-xl bg-indigo-50 hover:bg-indigo-100 text-sm font-medium text-indigo-700"
            >
              BI Admin Portal
            </button>
            <button
              onClick={() => {
                setIsAiAssistantOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-3 text-left rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold"
            >
              Open Nexus AI
            </button>
          </div>
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 mb-2">All Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => <button key={category.id} onClick={() => navigateTo('products', category.slug)} className="px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-700">
                {category.name}
              </button>)}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
