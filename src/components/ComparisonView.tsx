import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { api, getLiveProductUrl, Product, ProductOffer } from '../services/api.ts';
import {
  Scale,
  ArrowLeft,
  Trash2,
  Check,
  X,
  Star,
  ExternalLink,
  ShieldCheck,
  Truck,
  Sparkles,
  TrendingDown,
  Layers,
} from 'lucide-react';

interface ComparedItem {
  product: Product;
  offers: ProductOffer[];
}

export const ComparisonView: React.FC = () => {
  const {
    comparisonList,
    toggleCompare,
    clearCompare,
    setCurrentView,
    setSelectedProductId,
    formatPrice,
    showToast,
  } = useApp();

  const [comparedItems, setComparedItems] = useState<ComparedItem[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [valueInsight, setValueInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComparisonData = async () => {
      try {
        setLoading(true);
        if (comparisonList.length > 0) {
          const loaded = await Promise.all(
            comparisonList.map(async (id) => {
              const res = await api.getProduct(id);
              return {
                product: res.product,
                offers: res.offers || [],
              };
            })
          );
          setComparedItems(loaded);
        } else {
          setComparedItems([]);
        }

        // Fetch quick picks to add
        const prodsRes = await api.getProducts({ limit: 6 });
        setRecommended(prodsRes.products || []);
      } catch (err) {
        console.error('Failed to load comparison products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadComparisonData();
  }, [comparisonList]);

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
    setCurrentView('product-details');
  };

  const getStorePrice = (item: ComparedItem, storeName: string) => {
    const match = item.offers.find(
      (o) => o.storeName.toLowerCase() === storeName.toLowerCase()
    );
    if (!match) return null;
    return match.price;
  };

  const storesToCompare = Array.from(new Set(comparedItems.flatMap((item) => item.offers.map((offer) => offer.storeName))));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Comparing catalog specifications and available offers...</p>
      </div>

    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('products')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs"
            title="Back to products"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Multi-Store Comparison Matrix
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {comparedItems.length} of 4 items
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Side-by-side technical specifications, warranties, and multi-store pricing transparency.
            </p>
          </div>
        </div>

        {comparedItems.length > 0 && (
          <button
            onClick={clearCompare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Comparison</span>
          </button>
        )}
      </div>

      {comparedItems.length > 1 && <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h2 className="font-bold text-slate-900">Find the Best Value</h2>
          <p className="text-xs text-slate-600">Compare listed prices alongside product features; the lowest price is not automatically the best fit.</p>
          {valueInsight && <p className="mt-2 text-sm text-slate-800">{valueInsight}</p>}
        </div>
        <button onClick={() => {
          const sorted = [...comparedItems].sort((a, b) => a.product.price - b.product.price);
          const lowest = sorted[0];
          const highest = sorted[sorted.length - 1];
          const difference = highest.product.price - lowest.product.price;
          const demoOnly = comparedItems.some((item) => item.product.dataSource !== 'live');
          setValueInsight(`Lowest listed price: ${lowest.product.name} at ${formatPrice(lowest.product.price)}. The listed-price spread is ${formatPrice(difference)}.${demoOnly ? ' These are illustrative demo prices, not current offers.' : ''}`);
        }} className="shrink-0 px-4 py-2 rounded-lg bg-slate-900 text-amber-300 text-xs font-bold">Find the Best Value</button>
      </section>}

      {comparedItems.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Your comparison tray is empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select up to 4 products from our catalog or recommendations below to compare specifications, warranties, and prices across Amazon, Flipkart, Croma, and Reliance Digital.
          </p>
          <button
            onClick={() => setCurrentView('products')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow hover:bg-indigo-700 transition-colors"
          >
            Browse Catalog
          </button>

          {/* Quick Suggestions to Add */}
          <div className="pt-6 border-t border-slate-100 text-left">
            <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Suggested Products for Side-by-Side Analysis:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommended.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 hover:bg-indigo-50/50 transition-colors"
                >
                  <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[11px] font-extrabold text-indigo-600">{formatPrice(p.price)}</p>
                  </div>
                  <button
                    onClick={() => {
                      toggleCompare(p.id);
                      showToast(`Added ${p.name.slice(0, 20)} to comparison!`, 'success');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-[11px] font-bold text-indigo-600 shadow-2xs"
                  >
                    + Compare
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl bg-white border border-slate-200 shadow-md">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Table Header: Product Cards */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-4 w-48 text-xs font-extrabold uppercase tracking-wider text-slate-500 align-top">
                  Product Overview
                </th>
                {comparedItems.map((item) => (
                  <th key={item.product.id} className="p-4 w-64 align-top">
                    <div className="space-y-3">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 group">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => toggleCompare(item.product.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-500 hover:text-rose-600 shadow-sm transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {item.product.brand}
                        </span>
                        <h4
                          onClick={() => handleProductClick(item.product.id)}
                          className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
                        >
                          {item.product.name}
                        </h4>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-slate-900">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {item.product.dataSource === 'live' && item.product.bestStore ? `Best at ${item.product.bestStore}` : 'Demo Data'}
                        </span>
                      </div>

                      {getLiveProductUrl(item.product.bestOfferUrl, item.product.bestOfferUrl ? 'live' : item.product.dataSource) ? (
                        <a href={getLiveProductUrl(item.product.bestOfferUrl, 'live') || undefined} target="_blank" rel="noopener noreferrer" className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-xs transition-colors flex items-center justify-center gap-1.5">
                          <span>BUY NOW</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : <button disabled className="w-full py-2 px-3 rounded-xl bg-slate-200 text-slate-500 text-xs font-extrabold cursor-not-allowed">BUY NOW</button>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Category / Model */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Model & Category</td>
                {comparedItems.map((item) => (
                  <td key={item.product.id} className="p-4 text-slate-800">
                    <p className="font-semibold">{item.product.model || 'Standard'}</p>
                    <p className="text-[11px] text-slate-500">{item.product.categoryName}</p>
                  </td>
                ))}
              </tr>

              {/* Customer Rating */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Rating & Reviews</td>
                {comparedItems.map((item) => (
                  <td key={item.product.id} className="p-4 text-slate-800">
                    {item.product.dataSource === 'live' && item.product.reviewCount > 0 ? <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.product.rating}</span>
                      <span className="text-slate-400 font-normal">({item.product.reviewCount} reviews)</span>
                    </div> : <span className="text-slate-500">Rating data unavailable for demo record</span>}
                  </td>
                ))}
              </tr>

              {/* Multi-Store Comparison Section Header */}
              <tr className="bg-indigo-50/60 font-bold text-indigo-900 border-y border-indigo-100">
                <td colSpan={comparedItems.length + 1} className="p-3 text-xs uppercase tracking-wider">
                  {comparedItems.some((item) => item.product.dataSource !== 'live') ? 'Demo Store Price Grid' : 'Merchant Price Grid'}
                </td>
              </tr>

              {storesToCompare.map((store) => (
                <tr key={store} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{store}</span>
                  </td>
                  {comparedItems.map((item) => {
                    const price = getStorePrice(item, store);
                    const isLowest = price !== null && price === item.product.price;
                    return (
                      <td key={item.product.id} className="p-4">
                        {price !== null ? (
                          <div className="space-y-0.5">
                            <span className={`font-extrabold ${isLowest ? 'text-emerald-600' : 'text-slate-900'}`}>
                              {formatPrice(price)}
                            </span>
                            {isLowest && (
                              <span className="block text-[10px] font-bold text-emerald-700">
                                ✓ Lowest Price
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Price unavailable</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Technical Specifications Section Header */}
              <tr className="bg-indigo-50/60 font-bold text-indigo-900 border-y border-indigo-100">
                <td colSpan={comparedItems.length + 1} className="p-3 text-xs uppercase tracking-wider">
                  Hardware Specifications & Attributes
                </td>
              </tr>

              {/* Key Specs Breakdown */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Specifications</td>
                {comparedItems.map((item) => {
                  let parsedSpecs: Record<string, string> = {};
                  try {
                    if (item.product.specs) parsedSpecs = JSON.parse(item.product.specs);
                  } catch {
                    parsedSpecs = {};
                  }
                  return (
                    <td key={item.product.id} className="p-4 align-top space-y-1.5">
                      {Object.keys(parsedSpecs).length > 0 ? (
                        Object.entries(parsedSpecs).map(([key, val]) => (
                          <div key={key} className="text-[11px] leading-tight">
                            <span className="font-bold text-slate-500 capitalize">{key}: </span>
                            <span className="text-slate-900 font-medium">{String(val)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-xs">{item.product.description.slice(0, 100)}...</p>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Warranty & Delivery */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-600 bg-slate-50/50">Warranty & Fulfilment</td>
                {comparedItems.map((item) => (
                  <td key={item.product.id} className="p-4 text-slate-800 space-y-1 text-xs">
                    <p className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>1 Year Brand Warranty</span>
                    </p>
                    <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Free Delivery (2-3 Business Days)</span>
                    </p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
