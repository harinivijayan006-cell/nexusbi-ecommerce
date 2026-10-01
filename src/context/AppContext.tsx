import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, User, CartItem, Product } from '../services/api.ts';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number; prefix: boolean }> = {
  INR: { symbol: '₹', rate: 1, prefix: true },
  USD: { symbol: '$', rate: 0.012, prefix: true },
  EUR: { symbol: '€', rate: 0.011, prefix: true },
  GBP: { symbol: '£', rate: 0.0095, prefix: true },
  AED: { symbol: 'AED ', rate: 0.044, prefix: true },
};

interface AppContextType {
  currentUser: User | null;
  demoUsers: User[];
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProductId: number | null;
  setSelectedProductId: (id: number | null) => void;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  comparisonList: number[];
  toggleCompare: (productId: number) => void;
  isInCompare: (productId: number) => boolean;
  clearCompare: () => void;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartQty: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  switchUser: (user: User) => Promise<void>;
  logout: () => void;
  selectedCategory: string | null;
  setSelectedCategory: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  adminTab: string;
  setAdminTab: (tab: string) => void;
  checkoutSuccessOrder: any | null;
  setCheckoutSuccessOrder: (order: any | null) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (amountInInr: number) => string;
  // Butterfly Mascot controls
  butterflyEnabled: boolean;
  setButterflyEnabled: (val: boolean) => void;
  reduceButterflyMotion: boolean;
  setReduceButterflyMotion: (val: boolean) => void;
  nexiSpeechMessage: string | null;
  setNexiSpeechMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [demoUsers, setDemoUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nexus_wishlist') || '[]');
    } catch {
      return [];
    }
  });
  const [comparisonList, setComparisonList] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nexus_comparison') || '[]');
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<any | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // Butterfly mascot settings
  const [butterflyEnabled, setButterflyEnabled] = useState<boolean>(() => {
    return localStorage.getItem('nexi_enabled') !== 'false';
  });
  const [reduceButterflyMotion, setReduceButterflyMotion] = useState<boolean>(() => {
    return localStorage.getItem('nexi_reduce_motion') === 'true';
  });
  const [nexiSpeechMessage, setNexiSpeechMessage] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      let updated;
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
        showToast('Removed from wishlist', 'info');
      } else {
        updated = [...prev, productId];
        showToast('Saved to wishlist!', 'success');
      }
      localStorage.setItem('nexus_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  const toggleCompare = (productId: number) => {
    setComparisonList((prev) => {
      let updated;
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
        showToast('Removed from comparison list', 'info');
      } else {
        if (prev.length >= 4) {
          showToast('You can compare a maximum of 4 products at once', 'error');
          return prev;
        }
        updated = [...prev, productId];
        showToast('Added to product comparison!', 'success');
      }
      localStorage.setItem('nexus_comparison', JSON.stringify(updated));
      return updated;
    });
  };

  const isInCompare = (productId: number) => comparisonList.includes(productId);

  const clearCompare = () => {
    setComparisonList([]);
    localStorage.removeItem('nexus_comparison');
    showToast('Comparison cleared', 'info');
  };

  const formatPrice = (amountInInr: number) => {
    const config = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
    const converted = amountInInr * config.rate;

    if (currency === 'INR') {
      return `${config.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${config.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const refreshCart = async () => {
    try {
      const data = await api.getCart();
      setCart(data.items || []);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      await api.addToCart(productId, quantity);
      await refreshCart();
      showToast('Added to shopping cart!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add item', 'error');
    }
  };

  const updateCartQty = async (itemId: number, quantity: number) => {
    try {
      await api.updateCartItem(itemId, quantity);
      await refreshCart();
    } catch (err: any) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await api.removeCartItem(itemId);
      await refreshCart();
      showToast('Item removed from cart', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      setCart([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const switchUser = async (user: User) => {
    try {
      const token = `session_${user.uid}`;
      setAuthToken(token);
      setCurrentUser(user);
      await refreshCart();
      showToast(`Switched active persona to ${user.name} (${user.role.toUpperCase()})`, 'success');
      if (user.role === 'admin' && currentView === 'profile') {
        setCurrentView('admin');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to switch user', 'error');
    }
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
    if (currentView === 'admin' || currentView === 'profile') {
      setCurrentView('home');
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const users = await api.getDemoUsers();
        setDemoUsers(users);

        const meRes = await api.getMe();
        if (meRes.data?.user) {
          setCurrentUser(meRes.data.user);
        } else if (users.length > 0) {
          const defaultUser = users.find(u => u.role === 'customer') || users[0];
          setAuthToken(`session_${defaultUser.uid}`);
          setCurrentUser(defaultUser);
        }

        await refreshCart();
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    init();
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        demoUsers,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        cart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        comparisonList,
        toggleCompare,
        isInCompare,
        clearCompare,
        refreshCart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toasts,
        showToast,
        switchUser,
        logout,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        adminTab,
        setAdminTab,
        checkoutSuccessOrder,
        setCheckoutSuccessOrder,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        currency,
        setCurrency,
        formatPrice,
        butterflyEnabled,
        setButterflyEnabled,
        reduceButterflyMotion,
        setReduceButterflyMotion,
        nexiSpeechMessage,
        setNexiSpeechMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
