import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Database,
  Server,
  Layers,
  BarChart3,
  ShieldCheck,
  Code2,
  Terminal,
  Cpu,
  ArrowRight,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Architecture & System Design
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Data-Driven E-Commerce & BI Platform (2026)
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Production-grade full-stack architecture coupling a responsive customer-facing storefront with an integrated relational Business Intelligence (BI) engine.
        </p>
      </div>

      {/* Layer Architecture Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">1. Modern Frontend</h3>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>Tailwind CSS v4 Design Constitution</li>
            <li>Chart.js Interactive Data Visualizations</li>
            <li>Multi-Facet Filter & Real-Time Search</li>
            <li>Dynamic Persona Switching (Admin & Customer)</li>
            <li>Mobile-First Responsive Layouts</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">2. Node & Express Backend</h3>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>RESTful APIs (/api/products, /api/orders, /api/analytics)</li>
            <li>Role-Based Access Control (RBAC) Middleware</li>
            <li>Real-time SQL aggregations for KPIs</li>
            <li>Backend CSV stream generation</li>
            <li>Transactional stock updates</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">3. PostgreSQL & Drizzle</h3>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>Relational schema (9 interconnected tables)</li>
            <li>Primary & Foreign Keys with ON DELETE constraints</li>
            <li>Indexes on categories, orders, created_at</li>
            <li>Connection pooling via pg.Pool object method</li>
            <li>Type-safe schema migration via Drizzle ORM</li>
          </ul>
        </div>
      </div>

      {/* Database Schema Reference */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Relational Database Tables in Production</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Connected & Seeded
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px] text-slate-400">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <p className="font-bold text-indigo-400">users</p>
            <p>id, uid, name, email, role, phone, created_at</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <p className="font-bold text-indigo-400">categories</p>
            <p>id, name, slug, description, icon, image_url</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <p className="font-bold text-indigo-400">products</p>
            <p>id, category_id, name, price, discount, stock, rating</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <p className="font-bold text-indigo-400">orders</p>
            <p>id, order_number, user_id, total_amount, order_status</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <p className="font-bold text-indigo-400">order_items</p>
            <p>id, order_id, product_id, quantity, unit_price</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <p className="font-bold text-indigo-400">payments & reviews</p>
            <p>transaction_id, amount, rating, comment</p>
          </div>
        </div>
      </div>

      {/* CTA to test BI */}
      <div className="text-center pt-4">
        <button
          onClick={() => setCurrentView('admin')}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all inline-flex items-center gap-2"
        >
          <span>Explore Live Business Intelligence Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
