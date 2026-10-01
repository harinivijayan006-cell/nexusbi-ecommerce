import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    clearCart,
    setCurrentView,
    setSelectedProductId,
    showToast,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'NEXUS10' || promoCode.toUpperCase() === 'SAVE10') {
      setPromoDiscount(10);
      showToast('10% Promo Code applied!', 'success');
    } else if (promoCode.toUpperCase() === 'WELCOME20') {
      setPromoDiscount(20);
      showToast('20% VIP Code applied!', 'success');
    } else {
      showToast('Invalid promo code. Try "NEXUS10" or "WELCOME20"', 'error');
    }
  };

  const rawSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const discountAmount = Math.round(rawSubtotal * (promoDiscount / 100) * 100) / 100;
  const netSubtotal = rawSubtotal - discountAmount;
  const shippingFee = netSubtotal > 150 || netSubtotal === 0 ? 0.0 : 15.0;
  const tax = Math.round(netSubtotal * 0.08 * 100) / 100;
  const total = Math.round((netSubtotal + shippingFee + tax) * 100) / 100;

  const freeShippingThreshold = 150;
  const freeShippingProgress = Math.min(100, Math.round((netSubtotal / freeShippingThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Explore our collection of fine electronics, luxury apparel, and homeware to add items.
        </p>
        <div>
          <button
            onClick={() => setCurrentView('products')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-md transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Shipping Progress */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-indigo-900 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-indigo-600" />
            {netSubtotal >= freeShippingThreshold ? (
              <span>Unlocked Free Express Shipping!</span>
            ) : (
              <span>Add ${(freeShippingThreshold - netSubtotal).toFixed(2)} more for Free Shipping</span>
            )}
          </span>
          <span className="text-indigo-700">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => {
              const effectivePrice =
                item.discount > 0
                  ? Math.round(item.price * (1 - item.discount / 100) * 100) / 100
                  : item.price;
              const lineTotal = Math.round(effectivePrice * item.quantity * 100) / 100;

              return (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
                    onClick={() => {
                      setSelectedProductId(item.productId);
                      setCurrentView('product-details');
                    }}
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                    <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                      {item.brand}
                    </p>
                    <h4
                      className="font-bold text-slate-900 text-sm truncate cursor-pointer hover:text-indigo-600"
                      onClick={() => {
                        setSelectedProductId(item.productId);
                        setCurrentView('product-details');
                      }}
                    >
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs">
                      <span className="font-bold text-slate-900">${effectivePrice.toFixed(2)}</span>
                      {item.discount > 0 && (
                        <span className="text-slate-400 line-through text-[11px]">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-900 min-w-7 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right sm:min-w-20">
                    <p className="text-sm font-extrabold text-slate-900">${lineTotal.toFixed(2)}</p>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentView('products')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base">Order Summary</h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code (e.g. NEXUS10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 uppercase focus:bg-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Apply
              </button>
            </form>

            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${rawSubtotal.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount ({promoDiscount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Estimated Total</span>
              <span className="text-2xl font-extrabold text-slate-900">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setCurrentView('checkout')}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted Relational Transaction Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
