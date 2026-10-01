import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { api, Category, getLiveProductUrl, Product } from '../services/api.ts';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Scale,
  Zap,
  Check,
  ArrowRight,
  X,
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const {
    setSelectedProductId,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    toggleWishlist,
    isInWishlist,
    comparisonList,
    toggleCompare,
    isInCompare,
    clearCompare,
    formatPrice,
    currency,
    showToast,
  } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts({
        q: searchQuery,
        category: selectedCategory || '',
        minPrice,
        maxPrice,
        rating: minRating,
        gender,
        inStock: inStockOnly ? 'true' : '',
        sort: sortBy,
        page: currentPage,
        limit: 12,
      });
      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery, minPrice, maxPrice, minRating, gender, inStockOnly, sortBy, currentPage]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setGender('');
    setInStockOnly(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
    setCurrentView('product-details');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {selectedCategory
                ? `${categories.find((c) => c.slug === selectedCategory)?.name || 'Category'} Collection`
                : 'Multi-Store Catalog'}
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Demo Catalog
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Displaying {products.length} of {totalCount} products. Demo records are illustrative and are not merchant offers.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="lg:hidden px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white text-xs font-semibold flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs sm:text-sm font-medium bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="discount">Biggest Price Drop</option>
              <option value="views">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout (Filters Sidebar + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside
          className={`space-y-6 lg:block ${
            showFiltersMobile ? 'block' : 'hidden'
          } bg-white p-5 rounded-2xl border border-slate-200 shadow-sm`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Catalog Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search within catalog */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Search Keywords / Model</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Product name, brand, spec..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Category</label>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === null
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] text-slate-400">{categories.reduce((a, b) => a + b.productCount, 0)}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[11px] text-slate-400">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gender filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label htmlFor="catalog-gender" className="text-xs font-semibold text-slate-700">Audience</label>
            <select
              id="catalog-gender"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">All audiences</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700">Price Range ({currency})</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700">Minimum Rating</label>
            <div className="flex gap-2">
              {['4', '4.5'].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setMinRating(minRating === r ? '' : r);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                    minRating === r
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{r}+</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stock Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No matching products found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your price range, clearing keywords, or selecting a different category.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow hover:bg-indigo-500"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => {
                const productUrl = getLiveProductUrl(product.bestOfferUrl, product.bestOfferUrl ? 'live' : product.dataSource);
                return (
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

                      {/* Best Store Badge */}
                      <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        {product.dataSource === 'live' && product.bestStore ? `Best at ${product.bestStore}` : 'Demo Data'}
                      </span>

                      {/* Wishlist Button */}
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
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>

                      {/* Compare Checkbox Badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(product.id);
                          showToast(
                            isInCompare(product.id)
                              ? 'Removed from comparison'
                              : 'Added to comparison list!',
                            'info'
                          );
                        }}
                        className={`absolute bottom-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-md border transition-all flex items-center gap-1 ${
                          isInCompare(product.id)
                            ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                            : 'bg-white/90 text-slate-700 border-slate-300 hover:bg-white'
                        }`}
                        title="Add to side-by-side comparison"
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isInCompare(product.id) ? 'In Compare' : '+ Compare'}</span>
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5 cursor-pointer" onClick={() => handleProductClick(product.id)}>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                            {product.brand}
                          </span>
                          {product.dataSource === 'live' && product.reviewCount > 0 && <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{product.rating}</span>
                            <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                          </div>}
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-slate-500">{product.categoryName}{product.subcategory ? ` / ${product.subcategory}` : ''}</p>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
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

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleProductClick(product.id)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                            title="View multi-store price breakdown"
                          >
                            Offers
                          </button>

                          {productUrl ? <a
                            href={productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold"
                          >
                            BUY NOW
                          </a> : <button
                            disabled
                            title="A live merchant product URL is not available"
                            className="px-3 py-2 rounded-lg bg-slate-200 text-slate-500 text-[11px] font-extrabold cursor-not-allowed"
                          >
                            BUY NOW
                          </button>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs text-slate-500 font-medium">
                Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
                <span className="font-bold text-slate-900">{totalPages}</span>
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Comparison Tray (Sticky at bottom when items selected) */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-2xl bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-xs">
                {comparisonList.length} Product{comparisonList.length > 1 ? 's' : ''} in Comparison Tray
              </p>
              <p className="text-[10px] text-slate-400">Side-by-side specs, store prices & best values</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setCurrentView('compare')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
