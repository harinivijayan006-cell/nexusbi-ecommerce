// Frontend API service for Nexus BI Global Commerce & Price Intelligence
export interface ProductOffer {
  id: number;
  productId: number;
  storeName: string; // 'Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Tata CLiQ', 'Myntra', 'BigBasket', 'Blinkit', 'AgroStar'
  storeLogo?: string | null;
  price: number;
  originalPrice?: number | null;
  currency: string;
  availability: string;
  deliveryTime: string;
  seller: string;
  productUrl?: string | null;
  isBestPrice: boolean;
  rating?: number | null;
  warranty?: string | null;
  lastUpdated: string;
  dataSource?: 'demo' | 'live';
}

export interface PriceHistoryPoint {
  id: number;
  productId: number;
  recordedPrice: number;
  storeName: string;
  recordedDate: string; // 'YYYY-MM-DD'
}

export interface PriceAlert {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  targetPrice: number;
  currentPrice: number;
  status: 'active' | 'triggered';
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  model?: string | null;
  sku?: string | null;
  description: string;
  price: number; // lowest verified price
  originalPrice?: number | null;
  discount: number;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  galleryImages?: string | null;
  isFeatured: boolean;
  viewsCount: number;
  aiScore?: number | null;
  popularityScore?: number | null;
  bestOfferUrl?: string | null;
  country?: string | null;
  shippingInfo?: string | null;
  deliveryEstimate?: string | null;
  lowestPrice?: number | null;
  highestPrice?: number | null;
  bestStore?: string | null;
  currency?: string | null;
  specs?: string | null;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
  subcategory?: string | null;
  gender?: string | null;
  dataSource?: 'demo' | 'live';
  tags?: string | null;
  features?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export function getLiveProductUrl(productUrl?: string | null, dataSource?: 'demo' | 'live') {
  if (!productUrl || dataSource !== 'live') return null;

  try {
    const url = new URL(productUrl);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl: string;
  productCount: number;
  subcategories?: string | null;
}

export interface Store {
  name: string;
  logo?: string | null;
  dataSource: 'demo' | 'live';
  offerCount: number;
  lastUpdated: string | null;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  discount: number;
  stock: number;
  imageUrl: string;
  brand: string;
  bestStore?: string | null;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId?: number | null;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  phone?: string | null;
  subtotal: number;
  discountAmount: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  paymentMethod: string;
  notes?: string | null;
  createdAt: string;
}

export interface User {
  id: number;
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  orderCount?: number;
  totalSpend?: number;
  lastOrderDate?: string;
}

export interface Review {
  id: number;
  userId?: number | null;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardData {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    trackedOffers: number;
    aov: number;
    conversionRate: number;
  };
  insights: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    sentiment: 'positive' | 'warning' | 'neutral';
  }>;
  range: string;
}

let activeToken: string | null = localStorage.getItem('nexus_auth_token');

export const setAuthToken = (token: string | null) => {
  activeToken = token;
  if (token) {
    localStorage.setItem('nexus_auth_token', token);
  } else {
    localStorage.removeItem('nexus_auth_token');
  }
};

export const getAuthToken = () => activeToken;

const apiRequest = async (path: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (activeToken) {
    headers.set('Authorization', `Bearer ${activeToken}`);
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const api = {
  // Auth
  async login(email: string) {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async register(name: string, email: string, phone?: string, role: string = 'customer') {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, role }),
    });
  },

  async getMe() {
    return apiRequest('/api/auth/me');
  },

  async getDemoUsers(): Promise<User[]> {
    const res = await apiRequest('/api/auth/demo-users');
    return res.data;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await apiRequest('/api/categories');
    return res.data;
  },

  async getStores(): Promise<Store[]> {
    const res = await apiRequest('/api/stores');
    return res.data;
  },

  // Products & Search
  async getProducts(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const res = await apiRequest(`/api/products?${query.toString()}`);
    return res.data;
  },

  async searchProducts(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, String(val));
    });
    const res = await apiRequest(`/api/search?${query.toString()}`);
    return res.data;
  },

  async getPriceHistory(productId: number) {
    const res = await apiRequest(`/api/price-history/${productId}`);
    return res.data;
  },

  async getRecommendations(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, String(val));
    });
    const res = await apiRequest(`/api/recommendations?${query.toString()}`);
    return res.data;
  },

  async getProduct(id: number) {
    const res = await apiRequest(`/api/products/${id}`);
    return res.data;
  },

  async compareProducts(productIds: number[]) {
    const res = await apiRequest('/api/products/compare', {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    });
    return res.data;
  },

  async getDeals() {
    const res = await apiRequest('/api/deals');
    return res.data;
  },

  async createProduct(productData: any) {
    return apiRequest('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id: number, productData: any) {
    return apiRequest(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  async deleteProduct(id: number) {
    return apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  async submitReview(productId: number, data: { rating: number; comment: string; userName?: string }) {
    return apiRequest(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Price Alerts
  async getPriceAlerts(email?: string): Promise<PriceAlert[]> {
    const q = email ? `?email=${encodeURIComponent(email)}` : '';
    const res = await apiRequest(`/api/price-alerts${q}`);
    return res.data;
  },

  async createPriceAlert(productId: number, targetPrice: number, email?: string) {
    return apiRequest('/api/price-alerts', {
      method: 'POST',
      body: JSON.stringify({ productId, targetPrice, email }),
    });
  },

  async deletePriceAlert(id: number) {
    return apiRequest(`/api/price-alerts/${id}`, {
      method: 'DELETE',
    });
  },

  // AI Shopping Assistant ("Nexus AI")
  async chatWithAi(
    message: string,
    history: any[] = [],
    currentProductId?: number | null,
    extra?: {
      userEmail?: string;
      userId?: number;
      confirmAction?: string | null;
      actionPayload?: any;
    }
  ) {
    const res = await apiRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        history,
        currentProductId,
        userEmail: extra?.userEmail,
        userId: extra?.userId,
        confirmAction: extra?.confirmAction,
        actionPayload: extra?.actionPayload,
      }),
    });
    return res.data;
  },

  // AI Matching Engine
  async normalizeProduct(rawTitle: string, sourceStore?: string, rawPrice?: number | null) {
    const res = await apiRequest('/api/matching/normalize', {
      method: 'POST',
      body: JSON.stringify({ rawTitle, sourceStore, rawPrice }),
    });
    return res.data;
  },

  async getMatchingFeeds() {
    const res = await apiRequest('/api/matching/feeds');
    return res.data;
  },

  // Cart
  async getCart() {
    const res = await apiRequest('/api/cart');
    return res.data;
  },

  async addToCart(productId: number, quantity: number = 1) {
    return apiRequest('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async updateCartItem(itemId: number, quantity: number) {
    return apiRequest(`/api/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  async removeCartItem(itemId: number) {
    return apiRequest(`/api/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  async clearCart() {
    return apiRequest('/api/cart', {
      method: 'DELETE',
    });
  },

  // Orders
  async getOrders(params: { status?: string; search?: string; page?: number; limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    const res = await apiRequest(`/api/orders?${query.toString()}`);
    return res.data;
  },

  async getOrder(id: number) {
    const res = await apiRequest(`/api/orders/${id}`);
    return res.data;
  },

  async cancelOrder(id: number, reason?: string) {
    const res = await apiRequest(`/api/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return res.data;
  },

  async returnOrder(id: number, reason?: string) {
    const res = await apiRequest(`/api/orders/${id}/return`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return res.data;
  },

  async createOrder(orderData: any) {
    return apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async updateOrderStatus(id: number, orderStatus: string, paymentStatus?: string) {
    return apiRequest(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus, paymentStatus }),
    });
  },

  // Admin Users
  async getUsers(search?: string): Promise<User[]> {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await apiRequest(`/api/users${q}`);
    return res.data;
  },

  // Analytics
  async getDashboardAnalytics(range: string = '30d'): Promise<DashboardData> {
    const res = await apiRequest(`/api/analytics/dashboard?range=${range}`);
    return res.data;
  },

  async getSalesAnalytics(range: string = '30d') {
    const res = await apiRequest(`/api/analytics/sales?range=${range}`);
    return res.data;
  },

  async getCategoryAnalytics() {
    const res = await apiRequest('/api/analytics/categories');
    return res.data;
  },

  async getProductAnalytics() {
    const res = await apiRequest('/api/analytics/products');
    return res.data;
  },

  // CSV Export URLs
  getExportUrl(type: 'sales' | 'customers' | 'orders' | 'products') {
    return `/api/export/${type}`;
  },
};
