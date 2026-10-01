import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Package,
  Clock,
  Truck,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    clearCart,
    currentUser,
    setCurrentView,
    showToast,
    checkoutSuccessOrder,
    setCheckoutSuccessOrder,
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.name || 'Sarah Connor');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'sarah.connor@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 123-4567');
  const [streetAddress, setStreetAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Seattle');
  const [state, setState] = useState('WA');
  const [zip, setZip] = useState('98101');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'apple_pay' | 'paypal'>('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const rawSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const shippingFee = rawSubtotal > 150 || rawSubtotal === 0 ? 0.0 : 15.0;
  const tax = Math.round(rawSubtotal * 0.08 * 100) / 100;
  const total = Math.round((rawSubtotal + shippingFee + tax) * 100) / 100;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      const fullAddress = `${streetAddress}, ${city}, ${state} ${zip}`;

      const res = await api.createOrder({
        customerName,
        customerEmail,
        shippingAddress: fullAddress,
        phone,
        paymentMethod,
        notes,
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      setCheckoutSuccessOrder(res.data);
      await clearCart();
      showToast(`Order ${res.data.order.orderNumber} placed successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // If order was just placed, display the success tracking screen
  if (checkoutSuccessOrder) {
    const { order, items, payment } = checkoutSuccessOrder;
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Order Confirmed!</h1>
          <p className="text-sm text-slate-500">
            Thank you, <strong className="text-slate-800">{order.customerName}</strong>. Your payment was processed via {order.paymentMethod.replace('_', ' ').toUpperCase()}.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold">
            Order Reference: {order.orderNumber}
          </div>
        </div>

        {/* Order Tracking Stepper */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-sm">Fulfillment Status</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="font-bold text-slate-900">Placed</p>
              <p className="text-[10px] text-slate-400">Database Confirmed</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow">
                <Clock className="w-4 h-4" />
              </div>
              <p className="font-bold text-slate-900">Processing</p>
              <p className="text-[10px] text-slate-400">Warehouse Prep</p>
            </div>
            <div className="space-y-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                <Truck className="w-4 h-4" />
              </div>
              <p className="font-medium text-slate-600">Shipped</p>
              <p className="text-[10px] text-slate-400">Courier Assigned</p>
            </div>
            <div className="space-y-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                <Package className="w-4 h-4" />
              </div>
              <p className="font-medium text-slate-600">Delivered</p>
              <p className="text-[10px] text-slate-400">Signature Required</p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm">Receipt Summary</h4>
            <span className="text-xs text-slate-400 font-mono">Txn: {payment?.transactionId || 'txn_live'}</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {items?.map((item: any, idx: number) => (
              <div key={idx} className="py-2.5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{item.productName}</p>
                  <p className="text-slate-400">Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                </div>
                <span className="font-bold text-slate-900">${item.totalPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span className="font-bold text-slate-900">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-slate-900">
                {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            <strong>Shipping to:</strong> {order.shippingAddress}
          </div>
        </div>

        {/* Next Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => {
              setCheckoutSuccessOrder(null);
              setCurrentView('orders');
            }}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow"
          >
            View in Order History
          </button>
          <button
            onClick={() => {
              setCheckoutSuccessOrder(null);
              setCurrentView('products');
            }}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your delivery details and test the secure transactional flow.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer & Address Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer Information */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Customer Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-3">
                <label className="font-semibold text-slate-700">Street Address</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">State / Region</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">ZIP Code</label>
                <input
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Payment Details</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                { id: 'apple_pay', label: 'Apple Pay', icon: Lock },
                { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === p.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p.icon className="w-5 h-5 text-indigo-600" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {paymentMethod === 'credit_card' && (
              <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-slate-700">Card Number (Mock Sandbox)</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Expiry</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">CVV</label>
                  <input
                    type="text"
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 sticky top-24">
            <h3 className="font-extrabold text-slate-900 text-base">Items in Order ({cart.length})</h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs pr-1">
              {cart.map((item) => {
                const effectivePrice =
                  item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
                return (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-slate-400 text-[10px]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      ${(effectivePrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${rawSubtotal.toFixed(2)}</span>
              </div>
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

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Amount</span>
              <span className="text-2xl font-extrabold text-slate-900">${total.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isProcessing ? 'Processing Transaction...' : `Confirm & Pay $${total.toFixed(2)}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
