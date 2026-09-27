import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  Pill, 
  TrendingUp, 
  Sparkles, 
  Sliders, 
  Bell, 
  Settings,
  ArrowRightLeft,
  Presentation
} from 'lucide-react';
import { useMedFlow } from '../../context/MedFlowContext';
import { ActivePage } from '../../types/medflow';

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, recommendations, alerts } = useMedFlow();

  const pendingRecsCount = recommendations.filter(r => r.status === 'pending').length;
  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Regional Supply Map', icon: Map },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
    { id: 'inventory', label: 'Medicine Inventory', icon: Pill },
    { id: 'analytics', label: 'Prediction Analytics', icon: TrendingUp },
    { 
      id: 'recommendations', 
      label: 'AI Recommendations', 
      icon: Sparkles,
      badge: pendingRecsCount > 0 ? pendingRecsCount : undefined 
    },
    { id: 'simulation', label: 'Simulation Center', icon: Sliders },
    { 
      id: 'alerts', 
      label: 'Alerts & Logs', 
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined 
    },
    { id: 'presentation', label: 'Project Presentation', icon: Presentation, badge: 'Deck' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/90 backdrop-blur-lg flex-shrink-0 flex flex-col justify-between hidden md:flex">
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
          Command Operations
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-700/60 text-cyan-300 shadow-md shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  item.id === 'recommendations' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : item.id === 'presentation'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status Card */}
      <div className="p-3 m-3 rounded-xl glass-card border border-slate-800 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="font-semibold text-slate-200">Redistribution Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Multi-facility surplus optimization running in 100ms sync loops.
        </p>
      </div>
    </aside>
  );
};
