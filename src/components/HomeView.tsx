import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { api, Category, getLiveProductUrl, Product } from '../services/api.ts';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  Heart,
  BarChart2,
  Database,
  Layers,
  Search,
  Scale,
  Zap,
  Bell,
  CheckCircle2,
  Bot,
  ExternalLink,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    setCurrentView,
    setSelectedProductId,
    setSelectedCategory,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    formatPrice,
    setSearchQuery,
    setIsAiAssistantOpen,
    showToast,
  } = useApp();

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [heroSearch, setHeroSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [cats, prodsRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ featured: true, limit: 8 }),
        ]);
        setCategories(cats);
        setFeaturedProducts(prodsRes.products || []);
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentView('products');
  };

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
    setCurrentView('product-details');
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch.trim());
      setCurrentView('products');
    }
  };

  const quickSearchPills = [
    'iPhone 16',
    'MacBook Air M3',
    'Sony WH-1000XM5',
    'Laptops under ₹60,000',
    'Samsung Galaxy S24',
    'Amul Pure Ghee',
  ];

  const supportedStores = [
    { name: 'Merchant product feeds', color: 'from-slate-500 to-slate-700', verified: 'Not connected' },
    { name: 'Affiliate product links', color: 'from-slate-500 to-slate-700', verified: 'Not connected' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white mt-4 mx-4 sm:mx-6 lg:mx-8 shadow-2xl border border-indigo-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:py-28 space-y-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI-Powered Multi-Store Commerce Intelligence 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Search Once. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300">
                Compare Everywhere.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Search a paginated product catalog, compare available offer records, and continue to a merchant only when a live product link is connected. Current catalog values are labeled demo data.
            </p>

            {/* Instant Multi-Store Search Bar */}
            <form onSubmit={handleHeroSearchSubmit} className="relative max-w-2xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search products across all stores (e.g. 'iPhone 16 128GB', 'Laptop for coding under ₹60,000')..."
                  className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white/15 transition-all shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Compare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="text-slate-400 font-medium">Trending Queries:</span>
              {quickSearchPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => {
                    setSearchQuery(pill);
                    setCurrentView('products');
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] text-indigo-200 transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentView('products');
                }}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-2 group"
              >
                <span>Browse Multi-Store Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsAiAssistantOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/60 text-purple-200 border border-purple-500/40 font-semibold text-sm backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-purple-300" />
                <span>Ask Nexus AI Shopping Assistant</span>
              </button>

              <button
                onClick={() => setCurrentView('admin')}
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold text-sm backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>BI Dashboard</span>
              </button>
            </div>
          </div>

          {/* Supported Stores Row */}
          <div className="pt-6 border-t border-slate-800/80 space-y-3">
            <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Merchant Feed Integrations
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {supportedStores.map((store) => (
                <div
                  key={store.name}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col justify-between"
                >
                  <p className="font-bold text-xs text-white">{store.name}</p>
                  <span className="text-[10px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {store.verified}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Nexus Price Intelligence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI Product Matching</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Normalizes different merchant titles like "iPhone 16 128GB Black" and "Apple iPhone 16 (128 GB) - Black" using multi-signal GTIN, brand, and hardware spec matching.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Multi-Store Price Transparency</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare the offer records available in the catalog. Current prices are demonstration values; no merchant feed is connected.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Price History & Drop Alerts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              View price trends only when history records exist. Products without enough history are clearly marked as insufficient data.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Nexus AI Shopping Assistant</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Describe what you need and review matching catalog records. Recommendations use only details present in the record and identify demo data.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Price Drops & Best Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Demo Catalog Showcase
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                Illustrative Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Generated product records for browsing and search; prices and offers are not live merchant quotes.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('products');
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div
                  className="relative aspect-square overflow-hidden bg-white cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {product.dataSource === 'live' && product.bestStore ? `Best at ${product.bestStore}` : 'Demo Data'}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isInWishlist(product.id)
                        ? 'bg-rose-50 text-rose-600 shadow'
                        : 'bg-white/80 text-slate-600 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(product.id);
                      showToast(
                        isInCompare(product.id)
                          ? 'Removed from comparison'
                          : 'Added to side-by-side comparison!',
                        'info'
                      );
                    }}
                    className={`absolute bottom-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-md border transition-all flex items-center gap-1 ${
                      isInCompare(product.id)
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-white/90 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Scale className="w-3 h-3" />
                    <span>{isInCompare(product.id) ? 'In Compare' : '+ Compare'}</span>
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1 cursor-pointer" onClick={() => handleProductClick(product.id)}>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                        {product.brand}
                      </span>
                      {product.dataSource === 'live' && product.reviewCount > 0 && <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{product.rating}</span>
                      </div>}
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-slate-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <span className="text-[10px] text-rose-600 font-bold block">
                          Save {product.discount}%
                        </span>
                      )}
                    </div>

                    {getLiveProductUrl(product.bestOfferUrl, product.bestOfferUrl ? 'live' : product.dataSource) ? (
                      <a
                        href={getLiveProductUrl(product.bestOfferUrl, 'live') || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-extrabold"
                      >BUY NOW</a>
                    ) : <button disabled title="No live merchant product URL is available" className="px-3 py-2 rounded-lg bg-slate-200 text-slate-500 text-[11px] font-extrabold cursor-not-allowed">BUY NOW</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Category Explorer Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Explore Categories</h2>
          <p className="text-xs text-slate-500">
            Compare store catalogs across computing, mobile devices, audio-video, fashion, and groceries.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-400 cursor-pointer text-center space-y-2 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center mx-auto transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </p>
                <p className="text-[10px] text-slate-400">{cat.productCount} SKUs</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
