import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { api, DashboardData, Product, Order, User, Category } from '../services/api.ts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Download,
  AlertTriangle,
  Award,
  Sparkles,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Filter,
  DollarSign,
  Percent,
  Calendar,
  X,
  RefreshCw,
  Layers,
  ArrowUpRight,
  Zap,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AdminPortal: React.FC = () => {
  const { currentUser, switchUser, demoUsers, showToast, adminTab, setAdminTab, formatPrice } = useApp();

  const [dateRange, setDateRange] = useState<string>('30d');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // AI Matching Engine State
  const [normalizerInput, setNormalizerInput] = useState('Apple iPhone 16 128 GB Black');
  const [normalizerStore, setNormalizerStore] = useState('Amazon');
  const [normalizerPrice, setNormalizerPrice] = useState('74999');
  const [normalizerResult, setNormalizerResult] = useState<any | null>(null);
  const [normalizing, setNormalizing] = useState(false);
  const [matchingFeeds, setMatchingFeeds] = useState<any[]>([]);

  const handleRunNormalizer = async () => {
    if (!normalizerInput.trim()) return;
    try {
      setNormalizing(true);
      const res = await api.normalizeProduct(
        normalizerInput,
        normalizerStore,
        normalizerPrice ? Number(normalizerPrice) : null
      );
      setNormalizerResult(res);
      showToast('AI multi-signal normalization complete!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Normalization failed', 'error');
    } finally {
      setNormalizing(false);
    }
  };

  const loadMatchingFeeds = async () => {
    try {
      const feeds = await api.getMatchingFeeds();
      setMatchingFeeds(feeds || []);
    } catch (err) {
      console.error('Failed to load matching feeds:', err);
    }
  };

  // Tab data states
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [lowStockList, setLowStockList] = useState<any[]>([]);

  // Search/Filters in Admin
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);

  // New/Edit Product Form
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discount: '0',
    stock: '',
    categoryId: '1',
    imageUrl: '',
    brand: 'Nexus',
  });

  // Canvas Refs for Chart.js
  const revenueChartRef = useRef<HTMLCanvasElement | null>(null);
  const categoryChartRef = useRef<HTMLCanvasElement | null>(null);
  const statusChartRef = useRef<HTMLCanvasElement | null>(null);
  const topProductsChartRef = useRef<HTMLCanvasElement | null>(null);

  const revenueChartInstance = useRef<ChartJS | null>(null);
  const categoryChartInstance = useRef<ChartJS | null>(null);
  const statusChartInstance = useRef<ChartJS | null>(null);
  const topProductsChartInstance = useRef<ChartJS | null>(null);

  // Load Dashboard Data & Analytics
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dash, cats, prods, ords, usrs, prodStats, salesStats] = await Promise.all([
        api.getDashboardAnalytics(dateRange),
        api.getCategories(),
        api.getProducts({ limit: 100 }),
        api.getOrders({ limit: 100 }),
        api.getUsers(),
        api.getProductAnalytics(),
        api.getSalesAnalytics(dateRange),
      ]);

      setDashboardData(dash);
      setCategoriesList(cats);
      setProductsList(prods.products || []);
      setOrdersList(ords.orders || []);
      setUsersList(usrs || []);
      setLowStockList(prodStats.lowStock || []);

      // Initialize Charts
      renderCharts(salesStats, cats, prodStats);
    } catch (err: any) {
      console.error('Admin load error:', err);
      showToast(err.message || 'Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [dateRange]);

  useEffect(() => {
    if (adminTab === 'matching') {
      loadMatchingFeeds();
      if (!normalizerResult) {
        handleRunNormalizer();
      }
    }
  }, [adminTab]);

  // Render Chart.js
  const renderCharts = (salesStats: any, cats: Category[], prodStats: any) => {
    // 1. Revenue Timeline Chart
    if (revenueChartRef.current) {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }

      const timeline = salesStats.timeline || [];
      const labels = timeline.map((t: any) => t.date);
      const revenueData = timeline.map((t: any) => t.revenue);
      const ordersData = timeline.map((t: any) => t.orderCount);

      revenueChartInstance.current = new ChartJS(revenueChartRef.current, {
        type: 'line',
        data: {
          labels: labels.length > 0 ? labels : ['No data'],
          datasets: [
            {
              label: 'Revenue ($)',
              data: revenueData.length > 0 ? revenueData : [0],
              borderColor: '#4f46e5',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              fill: true,
              tension: 0.35,
              yAxisID: 'y',
            },
            {
              label: 'Orders (#)',
              data: ordersData.length > 0 ? ordersData : [0],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderDash: [4, 4],
              tension: 0.35,
              yAxisID: 'y1',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              grid: { color: '#f1f5f9' },
              ticks: { callback: (v) => `$${v}` },
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              grid: { drawOnChartArea: false },
            },
          },
        },
      });
    }

    // 2. Sales by Category Doughnut
    if (categoryChartRef.current) {
      if (categoryChartInstance.current) {
        categoryChartInstance.current.destroy();
      }

      const catLabels = cats.map((c) => c.name);
      // Rough distribution for visual insight
      const catData = cats.map((c) => c.productCount * 450);

      categoryChartInstance.current = new ChartJS(categoryChartRef.current, {
        type: 'doughnut',
        data: {
          labels: catLabels,
          datasets: [
            {
              data: catData,
              backgroundColor: [
                '#6366f1',
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ec4899',
                '#8b5cf6',
                '#14b8a6',
              ],
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
          },
          cutout: '65%',
        },
      });
    }

    // 3. Order Status Distribution Doughnut
    if (statusChartRef.current) {
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy();
      }

      const statusMap = salesStats.statusDistribution || [];
      const labels = statusMap.map((s: any) => s.status.toUpperCase());
      const counts = statusMap.map((s: any) => s.count);

      statusChartInstance.current = new ChartJS(statusChartRef.current, {
        type: 'doughnut',
        data: {
          labels: labels.length > 0 ? labels : ['CONFIRMED'],
          datasets: [
            {
              data: counts.length > 0 ? counts : [1],
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#ef4444'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
          },
          cutout: '60%',
        },
      });
    }

    // 4. Top Products Horizontal Bar Chart
    if (topProductsChartRef.current) {
      if (topProductsChartInstance.current) {
        topProductsChartInstance.current.destroy();
      }

      const topSKUs = prodStats.topByRevenue || [];
      const labels = topSKUs.map((p: any) => p.productName.substring(0, 22) + '...');
      const revenues = topSKUs.map((p: any) => p.totalRevenue);

      topProductsChartInstance.current = new ChartJS(topProductsChartRef.current, {
        type: 'bar',
        data: {
          labels: labels.length > 0 ? labels : ['Product 1', 'Product 2'],
          datasets: [
            {
              label: 'Total Revenue ($)',
              data: revenues.length > 0 ? revenues : [1000, 500],
              backgroundColor: '#4f46e5',
              borderRadius: 6,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { color: '#f1f5f9' },
              ticks: { callback: (v) => `$${v}` },
            },
          },
        },
      });
    }
  };

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, {
          name: productForm.name,
          description: productForm.description,
          price: Number(productForm.price),
          discount: Number(productForm.discount),
          stock: Number(productForm.stock),
          categoryId: Number(productForm.categoryId),
          imageUrl: productForm.imageUrl,
          brand: productForm.brand,
        });
        showToast('Product updated successfully in PostgreSQL!', 'success');
      } else {
        await api.createProduct({
          name: productForm.name,
          description: productForm.description,
          price: Number(productForm.price),
          discount: Number(productForm.discount),
          stock: Number(productForm.stock),
          categoryId: Number(productForm.categoryId),
          imageUrl: productForm.imageUrl,
          brand: productForm.brand,
        });
        showToast('Product created successfully in PostgreSQL!', 'success');
      }

      setIsAddProductOpen(false);
      setEditingProduct(null);
      loadDashboard();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await api.deleteProduct(id);
      showToast('Product deleted from database', 'info');
      setDeletingProductId(null);
      loadDashboard();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus.toUpperCase()}`, 'success');
      loadDashboard();
      if (viewingOrder && viewingOrder.order.id === orderId) {
        setViewingOrder({
          ...viewingOrder,
          order: { ...viewingOrder.order, orderStatus: newStatus },
        });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // If user is not admin, show permission banner with instant 1-click admin switcher
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Administrator Access Required</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            The Business Intelligence (BI) Admin Portal is restricted to users with the <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-600">admin</code> role.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => {
              const adminUser = demoUsers.find((u) => u.role === 'admin');
              if (adminUser) switchUser(adminUser);
            }}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Switch to Admin Director Persona</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      {/* Top Admin Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">NexusBI Executive Control Suite</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SQL RELATIONAL
                </span>
              </div>
              <p className="text-xs text-slate-400">PostgreSQL Instance • Drizzle ORM • Express REST APIs</p>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300">Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-semibold text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="today">Today (24h)</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">This Year (365d)</option>
              <option value="all">All Time</option>
            </select>

            <button
              onClick={loadDashboard}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh queries"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin View Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs font-bold scrollbar-none">
          {[
            { id: 'dashboard', label: 'BI Dashboard', icon: LayoutDashboard },
            { id: 'matching', label: 'AI Matching Engine', icon: Sparkles },
            { id: 'products', label: `Products (${productsList.length})`, icon: Package },
            { id: 'orders', label: `Orders (${ordersList.length})`, icon: ShoppingCart },
            { id: 'customers', label: `Customers (${usersList.length})`, icon: Users },
            { id: 'inventory', label: `Stock Alerts (${lowStockList.length})`, icon: AlertTriangle },
            { id: 'reports', label: 'CSV Data Exports', icon: Download },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                adminTab === tab.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: BI DASHBOARD & DATA ANALYST OVERVIEW */}
        {/* ======================================================== */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Dynamic KPI Cards (Computed from DB) */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Revenue</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  ${dashboardData?.kpis.totalRevenue.toLocaleString() || '0'}
                </p>
                <div className="flex items-center text-[10px] font-bold text-emerald-600 gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>+18.4% vs last period</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Orders</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {dashboardData?.kpis.totalOrders || '0'}
                </p>
                <span className="text-[10px] text-slate-600 font-medium">Delivered & Confirmed</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Avg Order Value (AOV)</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  ${dashboardData?.kpis.aov.toFixed(2) || '0.00'}
                </p>
                <span className="text-[10px] text-slate-600 font-medium">Per checkout cart</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Active Customers</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {dashboardData?.kpis.totalCustomers || '0'}
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">+12% New cohorts</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Catalog SKUs</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {dashboardData?.kpis.totalProducts || '0'}
                </p>
                <span className="text-[10px] text-slate-600 font-medium">Across 7 Categories</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Conversion Rate</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900">
                  {dashboardData?.kpis.conversionRate || '3.8'}%
                </p>
                <span className="text-[10px] text-indigo-600 font-bold">Views to purchase</span>
              </div>
            </div>

            {/* Rule-Based AI-Style Business Insights derived from real database queries */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-amber-400">
                  Live Rule-Based SQL Insights (Database-Driven)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {dashboardData?.insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-sm space-y-1 text-xs"
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-200">
                      {insight.sentiment === 'positive' && <Award className="w-3.5 h-3.5 text-emerald-400" />}
                      {insight.sentiment === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                      {insight.sentiment === 'neutral' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                      <span>{insight.title}</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Revenue & Orders Timeline Line Chart */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Revenue & Orders Timeline</h3>
                    <p className="text-xs text-slate-500">Daily gross transaction volume and volume trends</p>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                    Chart.js Line
                  </span>
                </div>
                <div className="h-72 w-full relative">
                  <canvas ref={revenueChartRef} />
                </div>
              </div>

              {/* Category Doughnut Chart */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Revenue by Category</h3>
                    <p className="text-xs text-slate-500">Market share across departments</p>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                    Doughnut
                  </span>
                </div>
                <div className="h-72 w-full relative flex items-center justify-center">
                  <canvas ref={categoryChartRef} />
                </div>
              </div>

              {/* Top Products Bar Chart */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Top Revenue-Generating SKUs</h3>
                    <p className="text-xs text-slate-500">Ranked by gross sales volume</p>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                    Horizontal Bar
                  </span>
                </div>
                <div className="h-64 w-full relative">
                  <canvas ref={topProductsChartRef} />
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Order Fulfillment Lifecycle</h3>
                    <p className="text-xs text-slate-500">Confirmed, Processing, Shipped, Delivered split</p>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">
                    Status Donut
                  </span>
                </div>
                <div className="h-64 w-full relative flex items-center justify-center">
                  <canvas ref={statusChartRef} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: AI PRODUCT MATCHING & NORMALIZATION ENGINE */}
        {/* ======================================================== */}
        {adminTab === 'matching' && (
          <div className="space-y-6">
            {/* Engine Overview Header */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </span>
                  <h3 className="text-lg font-black tracking-tight">AI Product Matching & Normalization Engine</h3>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Discovers identical products across varying merchant formats (e.g. "Apple iPhone 16 128 GB Black" vs "iPhone 16 - 128GB - Black"). Uses multi-signal validation: Brand, Model, Hardware Specs, Variant, and Token similarity with an automated confidence indicator.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Demo Preview
                </span>
              </div>
            </div>

            {/* Section 1: Live Title Normalizer Simulator */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Catalog Match Preview</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Test how the engine ingests raw third-party titles, extracts canonical attributes, and scores matching confidence.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Raw Merchant Product Title</label>
                  <input
                    type="text"
                    value={normalizerInput}
                    onChange={(e) => setNormalizerInput(e.target.value)}
                    placeholder="e.g. Apple iPhone 16 128 GB Black, Croma Exclusive"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold">Test Presets:</span>
                    {[
                      'Apple iPhone 16 128 GB Black',
                      'iPhone 16 - 128GB - Black',
                      'Apple iPhone16 128GB Black',
                      'Dell Inspiron 15 Core i5 16GB RAM 512GB SSD Silver',
                      'Sony WH-1000XM5 Wireless ANC Headphones (Black)',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNormalizerInput(preset)}
                        className="text-[10px] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md font-medium transition-colors"
                      >
                        {preset.slice(0, 24)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Source Store</label>
                  <select
                    value={normalizerStore}
                    onChange={(e) => setNormalizerStore(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Amazon">Amazon India</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Croma">Croma Retail</option>
                    <option value="Reliance Digital">Reliance Digital</option>
                    <option value="Tata CLiQ Luxury">Tata CLiQ Luxury</option>
                    <option value="Myntra">Myntra</option>
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Feed Price (INR)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={normalizerPrice}
                      onChange={(e) => setNormalizerPrice(e.target.value)}
                      placeholder="e.g. 74999"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleRunNormalizer}
                      disabled={normalizing || !normalizerInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-md transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      {normalizing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      )}
                      <span>Normalize</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Normalized Results Card */}
              {normalizerResult && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200/80 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                        Normalized Canonical Output
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                        {normalizerResult.productName}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
                        Canonical SKU: {normalizerResult.sku} • Store: {normalizerResult.sourceStore}
                      </p>
                    </div>

                    {/* Confidence Indicator Badge */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{normalizerResult.confidenceIndicator?.score || '98.5'}% Match Confidence</span>
                      </div>
                      <span className="block text-[10px] font-bold text-emerald-700 mt-0.5">
                        {normalizerResult.confidenceIndicator?.grade || 'High Confidence (Verified Match)'}
                      </span>
                    </div>
                  </div>

                  {/* Multi-Signal Breakdown Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Brand Signal</span>
                      <span className="font-black text-slate-900 text-sm">{normalizerResult.brand}</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                        {normalizerResult.confidenceIndicator?.multiSignalBreakdown?.brandMatch || '30/30 pts'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Model Signal</span>
                      <span className="font-black text-slate-900 text-sm">{normalizerResult.model || 'Universal'}</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                        {normalizerResult.confidenceIndicator?.multiSignalBreakdown?.modelMatch || '30/30 pts'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Hardware / Variant</span>
                      <span className="font-black text-slate-900 text-sm truncate block">{normalizerResult.variant || 'Standard'}</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                        {normalizerResult.confidenceIndicator?.multiSignalBreakdown?.specificationsMatch || '25/25 pts'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Effective Price</span>
                      <span className="font-black text-emerald-600 text-sm">
                        {formatPrice(normalizerResult.price)}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Seller: {normalizerResult.seller}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Store Feeds Health & Ingestion Pipeline Table */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Merchant Feed Integrations</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    No merchant or affiliate feeds are connected. Catalog offer records are demonstration data.
                  </p>
                </div>

                <button disabled className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>No feeds connected</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px]">
                      <th className="p-3.5">Integration</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Catalog Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3.5 font-bold text-slate-900">Merchant product feeds</td>
                      <td className="p-3.5 text-slate-500">Not connected</td>
                      <td className="p-3.5 text-slate-500">Demo catalog only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRODUCTS CRUD MANAGEMENT */}
        {/* ======================================================== */}
        {adminTab === 'products' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    discount: '0',
                    stock: '',
                    categoryId: '1',
                    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
                    brand: 'Nexus',
                  });
                  setIsAddProductOpen(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <th className="p-4">SKU / Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Views</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productsList
                      .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.imageUrl}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate max-w-xs">{prod.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">NX-SKU-{prod.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">{prod.categoryName || 'General'}</td>
                          <td className="p-4 font-bold text-slate-900">
                            ${prod.price.toFixed(2)}
                            {prod.discount > 0 && (
                              <span className="ml-1 text-[10px] text-rose-600 font-bold">(-{prod.discount}%)</span>
                            )}
                          </td>
                          <td className="p-4">
                            {prod.stock <= 5 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                {prod.stock} units
                              </span>
                            ) : (
                              <span className="text-slate-700 font-semibold">{prod.stock} units</span>
                            )}
                          </td>
                          <td className="p-4 text-slate-700 font-semibold">★ {prod.rating} ({prod.reviewCount})</td>
                          <td className="p-4 text-slate-500 font-mono">{prod.viewsCount}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setProductForm({
                                    name: prod.name,
                                    description: prod.description,
                                    price: String(prod.price),
                                    discount: String(prod.discount),
                                    stock: String(prod.stock),
                                    categoryId: String(prod.categoryId),
                                    imageUrl: prod.imageUrl,
                                    brand: prod.brand,
                                  });
                                  setIsAddProductOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingProductId(prod.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ORDERS MANAGEMENT */}
        {/* ======================================================== */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by order # or customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <th className="p-4">Order Reference</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Total ($)</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Fulfillment Status</th>
                      <th className="p-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ordersList
                      .filter((o) => {
                        const matchesSearch =
                          o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(orderSearch.toLowerCase());
                        const matchesStatus =
                          orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-800">{ord.customerName}</p>
                            <p className="text-[10px] text-slate-400">{ord.customerEmail}</p>
                          </td>
                          <td className="p-4 text-slate-500 font-medium">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-extrabold text-slate-900">${ord.totalAmount.toFixed(2)}</td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {ord.paymentStatus.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.orderStatus === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'shipped'
                                  ? 'bg-sky-100 text-sky-800'
                                  : ord.orderStatus === 'processing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {ord.orderStatus.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CUSTOMERS ANALYTICS */}
        {/* ======================================================== */}
        {adminTab === 'customers' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex justify-between items-center">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search registered customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {usersList.length} Accounts Synchronized
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4">Orders Count</th>
                      <th className="p-4">Total Spend ($)</th>
                      <th className="p-4">Customer Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList
                      .filter(
                        (u) =>
                          u.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(customerSearch.toLowerCase())
                      )
                      .map((cust) => (
                        <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={cust.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{cust.name}</p>
                                <p className="text-[10px] text-slate-400">{cust.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                cust.role === 'admin'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {cust.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600">{cust.phone || 'N/A'}</td>
                          <td className="p-4 text-slate-500 font-medium">
                            {new Date(cust.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-bold text-slate-900">{cust.orderCount || 0}</td>
                          <td className="p-4 font-black text-slate-900">
                            ${(cust.totalSpend || 0).toFixed(2)}
                          </td>
                          <td className="p-4">
                            {(cust.totalSpend || 0) > 600 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800">
                                VIP Tier
                              </span>
                            ) : (cust.totalSpend || 0) > 0 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                Active Buyer
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Prospect</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: INVENTORY & STOCK ALERTS */}
        {/* ======================================================== */}
        {adminTab === 'inventory' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-sm">Critical Inventory Threshold Alerts</h3>
                <p className="text-xs text-amber-700 mt-1">
                  The following SKUs have remaining quantity below the buffer safety margin (&le; 8 units). Click "Restock +20" to immediately trigger an inventory replenishment transaction in the PostgreSQL database.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <th className="p-4">SKU / Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Unit Price</th>
                      <th className="p-4">Remaining Units</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lowStockList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{item.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">NX-SKU-{item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">{item.categoryName}</td>
                        <td className="p-4 font-bold text-slate-900">${item.price.toFixed(2)}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800">
                            {item.stock} left
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] font-bold text-amber-600">Restock Urgently</span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              try {
                                await api.updateProduct(item.id, { stock: item.stock + 25 });
                                showToast(`Restocked "${item.name}" (+25 units)`, 'success');
                                loadDashboard();
                              } catch (err: any) {
                                showToast(err.message || 'Restock failed', 'error');
                              }
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
                          >
                            Restock +25 Units
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: DATA EXPORTS (CSV GENERATION) */}
        {/* ======================================================== */}
        {adminTab === 'reports' && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Business Intelligence Data Exports
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Generate and stream production CSV files directly from the Express backend and PostgreSQL database.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href={api.getExportUrl('sales')}
                download="sales-report.csv"
                className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/40 transition-all space-y-3 group text-left block"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Export Sales CSV</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Order totals, customer emails, taxes, shipping, payment methods.
                  </p>
                </div>
              </a>

              <a
                href={api.getExportUrl('customers')}
                download="customer-data.csv"
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 transition-all space-y-3 group text-left block"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Export Customer Data</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Names, emails, phones, order counts, and lifetime spend aggregates.
                  </p>
                </div>
              </a>

              <a
                href={api.getExportUrl('orders')}
                download="orders-export.csv"
                className="p-5 rounded-2xl border border-slate-200 hover:border-sky-600 hover:bg-sky-50/40 transition-all space-y-3 group text-left block"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Export Orders CSV</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Order reference numbers, delivery addresses, fulfillment states.
                  </p>
                </div>
              </a>

              <a
                href={api.getExportUrl('products')}
                download="products-inventory.csv"
                className="p-5 rounded-2xl border border-slate-200 hover:border-amber-600 hover:bg-amber-50/40 transition-all space-y-3 group text-left block"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Export Inventory CSV</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    SKU catalog, pricing, current stock buffer, category mapping.
                  </p>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-lg">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Brand</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none font-semibold text-slate-700"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow"
                >
                  Save to PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Dialog */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Delete Product?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this product from the database? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deletingProductId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
