import React, { useState } from 'react';
import { useMedFlow } from '../context/MedFlowContext';
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Check
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead } = useMedFlow();
  const [filter, setFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.type === filter;
  });

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            System Intelligence Log & Alerts ({alerts.length})
          </h2>
          <p className="text-xs text-slate-400">
            Audit feed of critical stockout alerts, supplier delay reports, and completed transfer dispatches.
          </p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Alert Types</option>
          <option value="critical">🔴 Critical</option>
          <option value="warning">🟠 Warning / Delays</option>
          <option value="success">🟢 Transfers Executed</option>
          <option value="info">🔵 System Info</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-xs text-slate-500">
            No alerts match the selected filter.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`glass-panel p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                alert.type === 'critical'
                  ? 'border-rose-800/60 bg-rose-950/20 text-rose-200'
                  : alert.type === 'warning'
                  ? 'border-amber-800/60 bg-amber-950/20 text-amber-200'
                  : alert.type === 'success'
                  ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-200'
                  : 'border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  alert.type === 'critical' ? 'bg-rose-950 text-rose-400' :
                  alert.type === 'warning' ? 'bg-amber-950 text-amber-400' :
                  alert.type === 'success' ? 'bg-emerald-950 text-emerald-400' :
                  'bg-slate-900 text-cyan-400'
                }`}>
                  {alert.type === 'critical' ? <ShieldAlert className="w-5 h-5" /> :
                   alert.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                   alert.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                   <Info className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{alert.title}</h4>
                    <span className="text-[10px] opacity-70 font-mono">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs opacity-90">{alert.message}</p>
                </div>
              </div>

              {!alert.read && (
                <button
                  onClick={() => markAlertAsRead(alert.id)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
