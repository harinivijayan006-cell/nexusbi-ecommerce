import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { api, getLiveProductUrl, Product, Review, ProductOffer, PriceHistoryPoint } from '../services/api.ts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  Star,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Check,
  Sparkles,
  MessageSquare,
  Send,
  Scale,
  ExternalLink,
  Bell,
  TrendingDown,
  Clock,
  Layers,
  Zap,
  Info,
  X,
  BadgeAlert,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductId,
    setCurrentView,
    setSelectedProductId,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    formatPrice,
    currentUser,
    showToast,
  } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [offers, setOffers] = useState<ProductOffer[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [aiPriceInsight, setAiPriceInsight] = useState<string>('');
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'offers' | 'history' | 'specs' | 'reviews'>('offers');
  const [historyTimeRange, setHistoryTimeRange] = useState<'30d' | '90d' | 'all'>('90d');

  // Price Drop Alert Modal
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [submittingAlert, setSubmittingAlert] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Chart Canvas Ref
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!selectedProductId) return;

    const loadProductData = async () => {
      try {
        setLoading(true);
        const data = await api.getProduct(selectedProductId);
        setProduct(data.product);
        setOffers(data.offers || []);
        setPriceHistory(data.priceHistory || []);
        setMetrics(data.metrics || null);
        setAiPriceInsight(data.aiPriceInsight || '');
        setRelated(data.related || []);
        setReviews(data.reviews || []);

        if (data.product) {
          // Default alert target price at 10% below current price
          setAlertTargetPrice(String(Math.round(data.product.price * 0.9)));
          setAlertEmail(currentUser?.email || '');
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [selectedProductId, currentUser]);

  // Render Price History Chart
  useEffect(() => {
    if (!chartRef.current || priceHistory.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    let filteredHistory = [...priceHistory];
    if (historyTimeRange === '30d') {
      filteredHistory = filteredHistory.slice(-10);
    } else if (historyTimeRange === '90d') {
      filteredHistory = filteredHistory.slice(-25);
    }

    const labels = filteredHistory.map((p) => p.recordedDate);
    const dataPoints = filteredHistory.map((p) => p.recordedPrice);

    chartInstance.current = new ChartJS(chartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Recorded Price (INR)',
            data: dataPoints,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#4f46e5',
            pointBorderColor: '#ffffff',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Price: ₹${Number(context.raw).toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 }, color: '#64748b' },
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 10 },
              color: '#64748b',
              callback: (val) => `₹${Number(val).toLocaleString()}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [priceHistory, historyTimeRange, activeTab]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewComment.trim()) return;

    try {
      setSubmittingReview(true);
      const res = await api.submitReview(product.id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
        userName: currentUser?.name || 'Verified Shopper',
      });
      setReviews((prev) => [res.data, ...prev]);
      setReviewComment('');
      showToast('Thank you! Your verified review has been recorded.', 'success');
      const data = await api.getProduct(product.id);
      setProduct(data.product);
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCreatePriceAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !alertTargetPrice || !alertEmail) return;

    try {
      setSubmittingAlert(true);
      await api.createPriceAlert(product.id, Number(alertTargetPrice), alertEmail);
      setIsAlertModalOpen(false);
      showToast(
        `Price alert set! We will notify ${alertEmail} when ${product.name.slice(0, 20)} drops to ${formatPrice(Number(alertTargetPrice))}`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to create price alert', 'error');
    } finally {
      setSubmittingAlert(false);
    }
  };

  const handleBuyNow = () => {
    const preferredOffer = offers.find((offer) => offer.isBestPrice) || offers[0];
    const productUrl = getLiveProductUrl(preferredOffer?.productUrl, preferredOffer?.dataSource);

    if (!productUrl) {
      showToast('This is demo data; no live merchant product URL is available.', 'info');
      return;
    }

    window.open(productUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Querying multi-store feeds & price history...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <button
          onClick={() => setCurrentView('products')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  // Parse specifications
  let parsedSpecs: Record<string, string> = {};
  try {
    if (product.specs) parsedSpecs = JSON.parse(product.specs);
  } catch {
    parsedSpecs = {};
  }

  // Calculate price history summary stats
  const historyPrices = priceHistory.map((p) => p.recordedPrice);
  const lowestHistoryPrice = historyPrices.length > 0 ? Math.min(...historyPrices) : product.price;
  const highestHistoryPrice = historyPrices.length > 0 ? Math.max(...historyPrices) : (product.originalPrice || product.price);
  const avgHistoryPrice = historyPrices.length > 0
    ? Math.round(historyPrices.reduce((a, b) => a + b, 0) / historyPrices.length)
    : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('products')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toggleCompare(product.id);
              showToast(
                isInCompare(product.id)
                  ? 'Removed from comparison'
                  : 'Added to side-by-side comparison matrix!',
                'info'
              );
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isInCompare(product.id)
                ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isInCompare(product.id) ? 'In Compare Matrix' : '+ Compare'}</span>
          </button>

          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-xs"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Price Drop Alert</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Image & Badges */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-sm">
                SAVE {product.discount}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                isInWishlist(product.id)
                  ? 'bg-rose-50 text-rose-600 shadow-md'
                  : 'bg-white/80 text-slate-700 hover:text-rose-600'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Multi-Store Trust Badge */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold">{product.dataSource === 'live' ? 'Merchant Product Record' : 'Demonstration Product Record'}</p>
                <p className="text-[11px] text-indigo-700">
                  {product.dataSource === 'live' ? 'Merchant feed data' : 'Illustrative data, not verified by a merchant'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-1 rounded-md bg-white border border-indigo-200 text-indigo-800">
              {product.dataSource === 'live' ? 'Merchant Data' : 'Demo Data'}
            </span>
          </div>
        </div>

        {/* Right: Product Details, Multi-Store Best Price, CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-bold uppercase tracking-wider">
              <span>{product.brand}</span>
              <span>•</span>
              <span>{product.categoryName}</span>
              {product.model && (
                <>
                  <span>•</span>
                  <span className="text-slate-500 font-mono text-[11px]">Model: {product.model}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars & Views */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(product.rating) ? 'fill-current' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              {product.dataSource === 'live' && product.reviewCount > 0 ? (
                <>
                  <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                  <span className="text-xs text-slate-500">({product.reviewCount} reviews)</span>
                </>
              ) : <span className="text-xs text-slate-500">Ratings unavailable for demo data</span>}
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">{product.viewsCount} shoppers viewed</span>
            </div>
          </div>

          {/* Multi-Store Best Price Highlight Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {product.dataSource === 'live' ? 'Lowest Available Merchant Price' : 'Illustrative Demo Price'}
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {product.dataSource === 'live' ? `Best at ${product.bestStore || 'Store'}` : 'Demo estimate'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    Save {formatPrice(product.originalPrice - product.price)} ({product.discount}%)
                  </span>
                </>
              )}
            </div>

            {/* AI Price Insight banner */}
            {aiPriceInsight && (
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs text-slate-200 leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">AI Price Intelligence: </strong>
                  {aiPriceInsight}
                </p>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

          {/* Stock & Delivery summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700 font-medium">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{product.dataSource === 'live' ? product.deliveryEstimate || 'Check merchant for delivery estimate' : 'Delivery information unavailable'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{product.dataSource === 'live' ? 'See merchant for warranty details' : 'Warranty information unavailable'}</span>
            </div>
          </div>

          {/* Purchase CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>BUY NOW</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-slate-500">
              {offers.some((offer) => getLiveProductUrl(offer.productUrl, offer.dataSource))
                ? 'Opens the selected merchant product page in a new tab.'
                : 'Demo data: no live merchant product link is available.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section: Multi-Store Comparison, Price History, Specs, Reviews */}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 scrollbar-none">
          {[
            { id: 'offers', label: `Multi-Store Comparison (${offers.length})`, icon: Layers },
            { id: 'history', label: 'Price History & Analytics', icon: TrendingDown },
            { id: 'specs', label: 'Hardware Specifications', icon: ShieldCheck },
            { id: 'reviews', label: `Customer Reviews (${reviews.length})`, icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: MULTI-STORE OFFERS TABLE */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-100 p-4 rounded-2xl">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {product.dataSource === 'live' ? 'Merchant Offers & Availability' : 'Demo Store Comparison'}
                </h3>
                <p className="text-xs text-slate-600">
                  {product.dataSource === 'live' ? 'Offer details supplied by the merchant source.' : 'Demo data only. Prices, sellers, and availability are not real merchant offers.'}
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                {product.dataSource === 'live' ? 'Merchant feed' : 'Demo Data'}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                    <th className="p-3.5">Store</th>
                    <th className="p-3.5">{product.dataSource === 'live' ? 'Price' : 'Demo Price'}</th>
                    <th className="p-3.5">Discount</th>
                    <th className="p-3.5">Availability</th>
                    <th className="p-3.5">Seller & Delivery</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {offers.map((offer) => {
                    const productUrl = getLiveProductUrl(offer.productUrl, offer.dataSource);
                    return (
                    <tr
                      key={offer.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        offer.isBestPrice ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              offer.isBestPrice ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                          <span className="text-sm font-extrabold">{offer.storeName}</span>
                          {offer.isBestPrice && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              Best Price
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className="text-sm font-extrabold text-slate-900">
                            {formatPrice(offer.price)}
                          </span>
                          {offer.originalPrice && offer.originalPrice > offer.price && (
                            <span className="text-[11px] text-slate-400 line-through block">
                              {formatPrice(offer.originalPrice)}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        {offer.originalPrice && offer.originalPrice > offer.price ? (
                          <span className="text-xs font-bold text-rose-600">
                            {Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100)}% OFF
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3" />
                          {offer.availability || 'In Stock'}
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-600">
                        <p className="font-semibold text-slate-800">{offer.seller || 'Official Retailer'}</p>
                        <p className="text-[11px] text-slate-500">{offer.deliveryTime}</p>
                      </td>

                      <td className="p-3.5 text-right">
                        {productUrl ? <a
                          href={productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 ${
                            offer.isBestPrice
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-slate-900 hover:bg-indigo-600 text-white'
                          }`}
                        >
                          <span>Visit Store</span>
                          <ExternalLink className="w-3 h-3" />
                        </a> : <span className="text-[11px] text-slate-400">Demo data</span>}
                      </td>
                    </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRICE HISTORY & ANALYTICS */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Historical Price Movement</h3>
                <p className="text-xs text-slate-500">Track price drops, sales peaks, and optimal buy windows.</p>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(['30d', '90d', 'all'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setHistoryTimeRange(r)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      historyTimeRange === r ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>

            {priceHistory.length < 2 ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                Not enough price-history data to make this comparison.
              </p>
            ) : <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lowest Recorded</span>
                <p className="text-xl font-black text-emerald-600 mt-0.5">{formatPrice(lowestHistoryPrice)}</p>
                <p className="text-[10px] text-slate-400 mt-1">All-time best price across stores</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Price</span>
                <p className="text-xl font-black text-slate-800 mt-0.5">{formatPrice(avgHistoryPrice)}</p>
                <p className="text-[10px] text-slate-400 mt-1">90-day baseline benchmark</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Highest Recorded</span>
                <p className="text-xl font-black text-slate-800 mt-0.5">{formatPrice(highestHistoryPrice)}</p>
                <p className="text-[10px] text-slate-400 mt-1">Maximum launch or MSRP</p>
              </div>
            </div>

            {/* Chart Canvas */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm h-72">
              <canvas ref={chartRef} />
            </div>
            </>}
          </div>
        )}

        {/* TAB 3: SPECIFICATIONS */}
        {activeTab === 'specs' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Technical Specifications & Hardware Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-500 block">Brand & Manufacturer</span>
                <span className="font-semibold text-slate-900 text-sm">{product.brand}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-500 block">Model Number</span>
                <span className="font-semibold text-slate-900 text-sm">{product.model || 'Standard Edition'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-500 block">Universal SKU / MPN</span>
                <span className="font-mono text-slate-900">{product.sku || 'NEXUS-SKU-001'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-500 block">Category</span>
                <span className="font-semibold text-slate-900">{product.categoryName}</span>
              </div>

              {/* Dynamic specs from JSON */}
              {Object.entries(parsedSpecs).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-500 capitalize block">{key}</span>
                  <span className="font-semibold text-slate-900 text-sm">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Share Product Feedback</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Your Rating:</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${s <= reviewRating ? 'fill-current' : 'text-slate-200'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Your Feedback:</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience regarding product quality, multi-store pricing, and delivery speed..."
                    className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview || !reviewComment.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </form>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{r.userName}</span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Price Alert Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Set Price Drop Alert</h3>
              </div>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              This demo can save a target price for <strong>{product.name}</strong>, but live merchant monitoring and email notifications are not connected.
            </p>

            <form onSubmit={handleCreatePriceAlert} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Price (INR):
                </label>
                <input
                  type="number"
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-bold"
                  placeholder="e.g. 45000"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Current Lowest Price: {formatPrice(product.price)}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Notification Email:
                </label>
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                  placeholder="your.email@domain.com"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAlert || !alertTargetPrice || !alertEmail}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs shadow transition-colors"
                >
                  {submittingAlert ? 'Activating...' : 'Activate Price Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
