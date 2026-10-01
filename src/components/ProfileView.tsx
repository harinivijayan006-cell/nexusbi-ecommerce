import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Package,
  CreditCard,
  BarChart3,
  ArrowRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, demoUsers, switchUser, setCurrentView, logout } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please sign in</h2>
        <button
          onClick={() => {
            const defaultUser = demoUsers[0];
            if (defaultUser) switchUser(defaultUser);
          }}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Sign in as Default Customer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <img
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
          alt={currentUser.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-100 shadow"
        />

        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentUser.name}</h1>
              <p className="text-xs text-slate-500 font-mono">UID: {currentUser.uid}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-center sm:self-auto ${
                currentUser.role === 'admin'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{currentUser.role} Account</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.phone || '+1 (555) 000-0000'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Member since {new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4">
            <button
              onClick={() => setCurrentView('orders')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Order History</span>
            </button>

            {currentUser.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-colors"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Open BI Admin Suite</span>
              </button>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Switch Persona Grid */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Instant Role & Customer Persona Switcher</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Test the app across different accounts seeded in the PostgreSQL database.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {demoUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => switchUser(user)}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                currentUser.id === user.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={user.avatarUrl || ''} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                  user.role === 'admin'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {user.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
