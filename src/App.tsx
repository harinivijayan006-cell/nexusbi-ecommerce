import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';
import { HomeView } from './components/HomeView.tsx';
import { ProductsView } from './components/ProductsView.tsx';
import { ProductDetailView } from './components/ProductDetailView.tsx';
import { ComparisonView } from './components/ComparisonView.tsx';
import { CartView } from './components/CartView.tsx';
import { CheckoutView } from './components/CheckoutView.tsx';
import { OrdersView } from './components/OrdersView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { AboutView } from './components/AboutView.tsx';
import { NexiButterfly } from './components/NexiButterfly.tsx';
import { NexusAiModal } from './components/NexusAiModal.tsx';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'product-details' && <ProductDetailView />}
        {currentView === 'compare' && <ComparisonView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'admin' && <AdminPortal />}
        {currentView === 'about' && <AboutView />}
      </main>

      <Footer />
      <ToastContainer />
      <NexiButterfly />
      <NexusAiModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
