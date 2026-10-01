import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { api, getLiveProductUrl, Product } from '../services/api.ts';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Scale,
  RotateCcw,
  Star,
  ChevronRight,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Heart,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  MapPin,
  ArrowRight,
  RefreshCw,
  PhoneCall,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  matchedProducts?: Product[];
  matchedOrders?: any[];
  action?: {
    type: 'CANCEL_ORDER' | 'RETURN_ORDER';
    orderId: number;
    orderNumber: string;
    totalAmount: number;
    prompt: string;
  } | null;
  timestamp: string;
  quickButtons?: string[];
}

const WELCOME_QUICK_BUTTONS = [
  'Find a Product',
  'Compare Products',
  'Track My Order',
  'My Orders',
  'Product Details',
  'Best Deals',
  'Ask Anything',
];

export const NexusAiModal: React.FC = () => {
  const {
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    setSelectedProductId,
    setCurrentView,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    formatPrice,
    showToast,
    currentUser,
    selectedProductId,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm NEXUS AI 🦋\n\nI can help you with products, prices, orders, delivery, comparisons and more.\n\nWhat would you like to know?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickButtons: WELCOME_QUICK_BUTTONS,
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiAssistantOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isAiAssistantOpen, messages, loading]);

  const handleSendMessage = async (
    customText?: string,
    confirmAction?: string,
    actionPayload?: any
  ) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await api.chatWithAi(textToSend, history, selectedProductId, {
        userEmail: currentUser?.email,
        userId: currentUser?.id,
        confirmAction: confirmAction || null,
        actionPayload: actionPayload || null,
      });

      const assistantMsg: ChatMessage = {
        id: 'assistant_' + Date.now(),
        sender: 'assistant',
        text: res.message || "I've checked the database for your request.",
        matchedProducts: res.matchedProducts || [],
        matchedOrders: res.matchedOrders || [],
        action: res.action || null,
        quickButtons: res.quickButtons || WELCOME_QUICK_BUTTONS,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'assistant',
        text: "I couldn't find that information in your account.",
        quickButtons: WELCOME_QUICK_BUTTONS,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancelOrder = async (orderId: number, orderNumber: string) => {
    setCancellingOrderId(orderId);
    try {
      await handleSendMessage(
        `Yes, please cancel order #${orderNumber}`,
        'CANCEL_ORDER',
        { orderId }
      );
      showToast(`Order #${orderNumber} cancellation confirmed.`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel order', 'error');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleConfirmReturnOrder = async (orderId: number, orderNumber: string) => {
    try {
      await handleSendMessage(
        `Yes, initiate return for order #${orderNumber}`,
        'RETURN_ORDER',
        { orderId, reason: 'Customer requested return via NEXUS AI' }
      );
      showToast(`Return request submitted for Order #${orderNumber}`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to request return', 'error');
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text: "Hi! I'm NEXUS AI 🦋\n\nI can help you with products, prices, orders, delivery, comparisons and more.\n\nWhat would you like to know?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickButtons: WELCOME_QUICK_BUTTONS,
      },
    ]);
  };

  const handleViewProduct = (productId: number) => {
    setSelectedProductId(productId);
    setCurrentView('product-details');
    setIsAiAssistantOpen(false);
  };

  const handleQuickAction = (actionText: string) => {
    switch (actionText) {
      case 'Find a Product':
        handleSendMessage('Help me find a product in electronics');
        break;
      case 'Compare Products':
        handleSendMessage('Compare top smartphones and laptops');
        break;
      case 'Track My Order':
        handleSendMessage('Where is my order? Show my latest order tracking status');
        break;
      case 'My Orders':
        handleSendMessage('Show my previous orders');
        break;
      case 'Product Details':
        handleSendMessage('What are the specifications of the featured products?');
        break;
      case 'Best Deals':
        handleSendMessage('Show me the best deals and price drops today');
        break;
      case 'Ask Anything':
        handleSendMessage('What is your delivery policy and shipping zones?');
        break;
      default:
        handleSendMessage(actionText);
        break;
    }
  };

  // Helper for Order Status timeline
  const renderOrderTimeline = (orderStatus: string, trackingStatus: string) => {
    const isCancelled = orderStatus.toLowerCase() === 'cancelled';
    if (isCancelled) {
      return (
        <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>This order has been cancelled and refund has been initiated.</span>
        </div>
      );
    }

    const steps = [
      { id: 'placed', label: 'Order Placed', done: true },
      { id: 'confirmed', label: 'Payment Confirmed', done: true },
      { id: 'packed', label: 'Packed', done: ['processing', 'shipped', 'delivered'].includes(orderStatus.toLowerCase()) || trackingStatus === 'In Transit' || trackingStatus === 'Out for Delivery' },
      { id: 'shipped', label: 'Shipped', done: ['shipped', 'delivered'].includes(orderStatus.toLowerCase()) || trackingStatus === 'Out for Delivery' },
      { id: 'out', label: 'Out for Delivery', done: trackingStatus === 'Out for Delivery' || orderStatus.toLowerCase() === 'delivered', current: trackingStatus === 'Out for Delivery' && orderStatus.toLowerCase() !== 'delivered' },
      { id: 'delivered', label: 'Delivered', done: orderStatus.toLowerCase() === 'delivered' },
    ];

    return (
      <div className="py-2.5 px-3 bg-black/60 rounded-xl border border-amber-500/20 text-[11px] space-y-1.5 font-mono">
        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center justify-between">
          <span>Order Status Timeline</span>
          <span className="text-zinc-400">Live GPS Sync</span>
        </div>
        <div className="space-y-1">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2 text-zinc-300">
              <span className="w-4 text-center">
                {step.done ? (
                  <span className="text-emerald-400 font-bold">✓</span>
                ) : step.current ? (
                  <span className="text-amber-400 animate-pulse font-bold">●</span>
                ) : (
                  <span className="text-zinc-600">○</span>
                )}
              </span>
              <span className={step.done ? 'text-zinc-200' : step.current ? 'text-amber-300 font-bold' : 'text-zinc-500'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. FLOATING AI BUTTON THROUGHOUT WEBSITE (BLACK + GOLD) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-black text-white shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-amber-400/80 cursor-pointer"
          title="Open NEXUS AI Shopping & Order Assistant"
        >
          {/* Subtle glowing halo */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 opacity-40 blur-xs group-hover:opacity-75 transition duration-300 pointer-events-none" />

          {/* Butterfly Mascot NEXI */}
          <span className="relative flex items-center justify-center text-xl filter drop-shadow-[0_0_8px_rgba(245,197,66,0.8)]">
            🦋
          </span>

          <div className="relative flex flex-col items-start leading-tight">
            <span className="font-extrabold text-xs tracking-widest text-amber-300 group-hover:text-amber-200 transition-colors uppercase">
              NEXUS AI
            </span>
            <span className="text-[9px] font-semibold text-zinc-400 tracking-wider">
              Smart Assistant
            </span>
          </div>

          <span className="relative ml-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
        </button>
      </div>

      {/* 2. CHAT PANEL (Desktop: Right-side floating panel, Mobile: Full-screen) */}
      {isAiAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end pointer-events-none">
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs pointer-events-auto sm:hidden"
            onClick={() => setIsAiAssistantOpen(false)}
          />

          {/* Chat Container (BLACK + GOLD Visual Identity) */}
          <div className="pointer-events-auto w-full sm:w-[500px] h-full sm:h-[720px] sm:max-h-[92vh] sm:mr-6 bg-zinc-950 text-white sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.25)] border-t sm:border border-amber-500/40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-250">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-black via-zinc-900 to-black text-white flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,197,66,0.5)] border border-amber-300/40 shrink-0">
                  <span className="text-xl">🦋</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm tracking-wide text-amber-300">
                      NEXUS AI
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium tracking-wide">
                    YOUR SMART SHOPPING &amp; ORDER ASSISTANT
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetChat}
                  className="p-2 rounded-xl text-zinc-400 hover:text-amber-300 hover:bg-zinc-900 transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAiAssistantOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-amber-300 hover:bg-zinc-900 transition-colors"
                  title="Close assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-header status bar */}
            <div className="px-4 py-1.5 bg-black/90 border-b border-amber-500/20 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Connected to NEXUS BI Verified Database &amp; APIs</span>
              </span>
              <span className="text-amber-400/90 font-semibold uppercase tracking-wider">
                Authoritative Ground Truth
              </span>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/95 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
                >
                  {/* Sender identity pill */}
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 px-1">
                    {msg.sender === 'assistant' ? (
                      <>
                        <span className="text-amber-400 font-bold">NEXUS AI 🦋</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <span>{msg.timestamp}</span>
                        <span>•</span>
                        <span className="text-zinc-400 font-medium">You</span>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[92%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-br-xs shadow-[0_0_15px_rgba(245,197,66,0.2)]'
                        : 'bg-zinc-900/90 border border-amber-500/30 text-zinc-100 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line text-zinc-100 leading-relaxed font-normal">
                      {msg.text}
                    </p>

                    {/* Pending Action Confirmation Dialog (e.g. Cancel Order / Return Order) */}
                    {msg.action && (
                      <div className="mt-3 pt-3 border-t border-amber-500/30 bg-black/60 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Confirmation Required</span>
                        </div>
                        <p className="text-[11px] text-zinc-300">
                          {msg.action.prompt}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          {msg.action.type === 'CANCEL_ORDER' ? (
                            <>
                              <button
                                onClick={() =>
                                  handleConfirmCancelOrder(
                                    msg.action!.orderId,
                                    msg.action!.orderNumber
                                  )
                                }
                                disabled={cancellingOrderId === msg.action.orderId}
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              >
                                {cancellingOrderId === msg.action.orderId ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <X className="w-3.5 h-3.5" />
                                )}
                                <span>Cancel Order</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleSendMessage(
                                    `Please keep my order #${msg.action!.orderNumber}`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] transition-colors cursor-pointer"
                              >
                                Keep Order
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  handleConfirmReturnOrder(
                                    msg.action!.orderId,
                                    msg.action!.orderNumber
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Start Return
                              </button>
                              <button
                                onClick={() =>
                                  handleSendMessage(
                                    `Keep order #${msg.action!.orderNumber}`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] transition-colors cursor-pointer"
                              >
                                Keep Order
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Render Grounded Orders with Progress Timeline */}
                  {msg.matchedOrders && msg.matchedOrders.length > 0 && (
                    <div className="w-full space-y-3 mt-1">
                      {msg.matchedOrders.slice(0, 2).map((order) => (
                        <div
                          key={order.id}
                          className="p-3.5 rounded-2xl bg-zinc-900 border border-amber-500/30 text-white space-y-3 shadow-md"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                            <div>
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-amber-400" />
                                <span className="font-extrabold text-xs text-amber-300">
                                  ORDER #{order.orderNumber}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400">
                                {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 1} product(s)
                              </span>
                            </div>

                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                order.orderStatus.toLowerCase() === 'delivered'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : order.orderStatus.toLowerCase() === 'cancelled'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>

                          {/* Order Details Grid */}
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="bg-black/50 p-2 rounded-xl border border-zinc-800/80">
                              <span className="text-[10px] text-zinc-400 block">Total Amount</span>
                              <span className="font-extrabold text-amber-300 text-xs">
                                ₹{order.totalAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-black/50 p-2 rounded-xl border border-zinc-800/80">
                              <span className="text-[10px] text-zinc-400 block">Courier</span>
                              <span className="font-semibold text-zinc-200 truncate block">
                                {order.courierName || 'BlueDart Express'}
                              </span>
                            </div>
                            <div className="bg-black/50 p-2 rounded-xl border border-zinc-800/80">
                              <span className="text-[10px] text-zinc-400 block">Tracking ID</span>
                              <span className="font-mono text-zinc-300 truncate block">
                                {order.trackingNumber || 'Available upon dispatch'}
                              </span>
                            </div>
                            <div className="bg-black/50 p-2 rounded-xl border border-zinc-800/80">
                              <span className="text-[10px] text-zinc-400 block">Estimated Delivery</span>
                              <span className="font-medium text-emerald-400 truncate block">
                                {order.estimatedDelivery || '2-3 Business Days'}
                              </span>
                            </div>
                          </div>

                          {/* Visual Progress Timeline */}
                          {renderOrderTimeline(order.orderStatus, order.trackingStatus || 'In Transit')}

                          {/* Action Buttons: [Track Order] [View Order] [Contact Support] */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => {
                                handleSendMessage(
                                  `Where is order #${order.orderNumber}? Show live tracking details`
                                );
                              }}
                              className="flex-1 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track Order</span>
                            </button>
                            <button
                              onClick={() => {
                                setCurrentView('orders');
                                setIsAiAssistantOpen(false);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              View Order
                            </button>
                            <button
                              onClick={() => {
                                handleSendMessage(
                                  `I need help with order #${order.orderNumber}`
                                );
                              }}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <PhoneCall className="w-3 h-3 text-amber-400" />
                              <span>Support</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render catalog matches with provenance and external-store actions. */}
                  {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                    <div className="w-full space-y-2.5 mt-1">
                      <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold px-1">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Matched Products ({msg.matchedProducts.length})</span>
                        </span>
                        <span className="text-[10px] text-zinc-500 font-normal">
                          Demo data unless marked merchant-fed
                        </span>
                      </div>

                      <div className="space-y-2">
                        {msg.matchedProducts.slice(0, 3).map((prod) => (
                          <div
                            key={prod.id}
                            className="p-3 rounded-2xl bg-zinc-900 border border-amber-500/25 hover:border-amber-400/60 transition-all shadow-md flex flex-col gap-2.5 group"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={prod.imageUrl}
                                alt={prod.name}
                                className="w-14 h-14 rounded-xl object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                                    {prod.brand}
                                  </span>
                                  <span className="text-[9px] font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/30">
                                    {prod.dataSource === 'live' && prod.bestStore ? `Best at ${prod.bestStore}` : 'Demo Data'}
                                  </span>
                                </div>

                                <p className="font-bold text-xs text-white truncate group-hover:text-amber-300 transition-colors">
                                  {prod.name}
                                </p>

                                <div className="flex items-center gap-2 mt-1">
                                  <span className="font-extrabold text-sm text-amber-300">
                                    {formatPrice(prod.price)}
                                  </span>
                                  {prod.discount > 0 && (
                                    <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1 rounded">
                                      -{prod.discount}%
                                    </span>
                                  )}
                                  <span className="text-[10px] text-amber-400 flex items-center gap-0.5 ml-auto">
                                    <Star className="w-3 h-3 fill-current text-amber-400" />
                                    {prod.dataSource === 'live' && prod.reviewCount > 0 ? prod.rating : 'No rating'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Structured Specs & Seller details */}
                            <div className="bg-black/40 rounded-xl p-2 text-[10px] text-zinc-300 space-y-1 border border-zinc-800/80">
                              <div className="flex justify-between">
                                <span className="text-zinc-500">Seller:</span>
                                <span className="font-medium text-zinc-200">{prod.dataSource === 'live' ? prod.bestStore || 'Seller unavailable' : 'Unavailable in demo data'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">Specs:</span>
                                <span className="font-medium text-zinc-200 truncate max-w-[200px]">
                                  {prod.specs || 'Specifications not supplied'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">Warranty &amp; Delivery:</span>
                                <span className="font-medium text-zinc-300">{prod.dataSource === 'live' ? prod.deliveryEstimate || 'Not supplied' : 'Unavailable in demo data'}</span>
                              </div>
                            </div>

                            {/* Comparison, external purchase, wishlist, and product-detail actions. */}
                            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                              <button
                                onClick={() => {
                                  toggleCompare(prod.id);
                                  showToast(
                                    isInCompare(prod.id)
                                      ? 'Removed from comparison'
                                      : 'Added to side-by-side comparison tray!',
                                    'info'
                                  );
                                }}
                                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                                  isInCompare(prod.id)
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                                }`}
                              >
                                <Scale className="w-3 h-3" />
                                <span>{isInCompare(prod.id) ? 'Compared' : 'Compare'}</span>
                              </button>

                              {getLiveProductUrl(prod.bestOfferUrl, prod.bestOfferUrl ? 'live' : prod.dataSource) ? (
                                <a href={getLiveProductUrl(prod.bestOfferUrl, 'live') || undefined} target="_blank" rel="noopener noreferrer" className="py-1.5 px-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] transition-colors flex items-center justify-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  <span>BUY NOW</span>
                                </a>
                              ) : <button disabled title="No live merchant product URL is available" className="py-1.5 px-1 rounded-xl bg-zinc-700 text-zinc-400 font-extrabold text-[10px] flex items-center justify-center gap-1 cursor-not-allowed">
                                <ExternalLink className="w-3 h-3" />
                                <span>BUY NOW</span>
                              </button>}

                              <button
                                onClick={() => toggleWishlist(prod.id)}
                                className={`py-1.5 px-1 rounded-xl text-[10px] font-medium border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                                  isInWishlist(prod.id)
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                                }`}
                              >
                                <Heart className={`w-3 h-3 ${isInWishlist(prod.id) ? 'fill-current text-rose-400' : ''}`} />
                                <span>Wishlist</span>
                              </button>

                              <button
                                onClick={() => handleViewProduct(prod.id)}
                                className="py-1.5 px-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>View</span>
                                <ChevronRight className="w-3 h-3 text-amber-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-center gap-3 p-3.5 bg-zinc-900 rounded-2xl border border-amber-500/30 w-fit text-xs text-amber-300 shadow-md animate-pulse">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-300">
                    NEXUS AI is searching catalog records...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Carousel */}
            <div className="p-2.5 bg-zinc-900 border-t border-amber-500/20 overflow-x-auto flex gap-1.5 scrollbar-none">
              {(messages[messages.length - 1]?.quickButtons || WELCOME_QUICK_BUTTONS).map(
                (btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(btn)}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-full bg-black hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-400 border border-zinc-800 text-zinc-300 text-[11px] font-semibold whitespace-nowrap transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {btn}
                  </button>
                )
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3.5 bg-black border-t border-zinc-900 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about products, orders, delivery, prices..."
                className="flex-1 px-4 py-3 text-xs bg-zinc-900 border border-zinc-800 focus:border-amber-400 focus:bg-zinc-950 rounded-2xl outline-hidden transition-all text-white placeholder:text-zinc-500 shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 disabled:from-zinc-800 disabled:to-zinc-800 text-black disabled:text-zinc-600 shadow-[0_0_15px_rgba(245,197,66,0.3)] transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
