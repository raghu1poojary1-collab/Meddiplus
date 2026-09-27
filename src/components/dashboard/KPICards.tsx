import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Pill, 
  TrendingDown, 
  Truck, 
  ArrowRightLeft 
} from 'lucide-react';
import { useMedFlow } from '../../context/MedFlowContext';

export const KPICards: React.FC = () => {
  const { systemKPIs, setActivePage } = useMedFlow();

  const cards = [
    {
      title: 'Total Facilities',
      value: systemKPIs.totalFacilities,
      subtext: 'Monitored Healthcare Hubs',
      icon: Building2,
      color: 'text-cyan-400',
      border: 'border-cyan-500/20',
      bg: 'from-cyan-950/30 to-slate-900/40',
      action: () => setActivePage('facilities')
    },
    {
      title: 'Healthy Facilities',
      value: systemKPIs.healthyFacilities,
      subtext: 'Optimal Stock Level',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      border: 'border-emerald-500/20',
      bg: 'from-emerald-950/30 to-slate-900/40',
      action: () => setActivePage('facilities')
    },
    {
      title: 'At-Risk Facilities',
      value: systemKPIs.atRiskFacilities,
      subtext: 'Stockout < 10 Days',
      icon: AlertTriangle,
      color: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'from-amber-950/30 to-slate-900/40',
      action: () => setActivePage('facilities')
    },
    {
      title: 'Critical Facilities',
      value: systemKPIs.criticalFacilities,
      subtext: 'Immediate Action Required',
      icon: ShieldAlert,
      color: 'text-rose-400',
      border: 'border-rose-500/20',
      bg: 'from-rose-950/40 to-slate-900/40',
      badge: systemKPIs.criticalFacilities > 0 ? 'CRITICAL' : null,
      action: () => setActivePage('facilities')
    },
    {
      title: 'Medicines Monitored',
      value: systemKPIs.medicinesMonitored,
      subtext: 'Essential Drug Catalog',
      icon: Pill,
      color: 'text-teal-400',
      border: 'border-teal-500/20',
      bg: 'from-teal-950/30 to-slate-900/40',
      action: () => setActivePage('inventory')
    },
    {
      title: 'Regional Risk Index',
      value: `${systemKPIs.regionalShortageRisk}%`,
      subtext: 'Average Shortage Probability',
      icon: TrendingDown,
      color: systemKPIs.regionalShortageRisk > 60 ? 'text-rose-400' : 'text-cyan-400',
      border: 'border-blue-500/20',
      bg: 'from-blue-950/30 to-slate-900/40',
      action: () => setActivePage('analytics')
    },
    {
      title: 'Active Supplier Delays',
      value: systemKPIs.activeSupplierDelays,
      subtext: 'Delayed Supply Routes',
      icon: Truck,
      color: systemKPIs.activeSupplierDelays > 0 ? 'text-amber-400' : 'text-slate-400',
      border: 'border-indigo-500/20',
      bg: 'from-indigo-950/30 to-slate-900/40',
      action: () => setActivePage('simulation')
    },
    {
      title: 'Recommended Transfers',
      value: systemKPIs.recommendedTransfersCount,
      subtext: 'AI Redistribution Plans',
      icon: ArrowRightLeft,
      color: 'text-purple-400',
      border: 'border-purple-500/20',
      bg: 'from-purple-950/30 to-slate-900/40',
      badge: systemKPIs.recommendedTransfersCount > 0 ? 'ACTION' : null,
      action: () => setActivePage('recommendations')
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.action}
            className={`glass-card p-4 rounded-xl border ${card.border} bg-gradient-to-br ${card.bg} cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg bg-slate-950/60 border border-slate-800 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-extrabold text-white tracking-tight font-mono">
                {card.value}
              </div>
              {card.badge && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  {card.badge}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
