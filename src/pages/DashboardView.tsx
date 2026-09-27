import React from 'react';
import { KPICards } from '../components/dashboard/KPICards';
import { RecommendationBanner } from '../components/dashboard/RecommendationBanner';
import { SupplyNetworkMap } from '../components/map/SupplyNetworkMap';
import { useMedFlow } from '../context/MedFlowContext';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Bell,
  Sparkles,
  Pill
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardView: React.FC = () => {
  const { facilities, inventory, alerts, setActivePage, setSelectedFacilityId } = useMedFlow();

  // Aggregate daily regional consumption trend chart data
  const trendData = [
    { day: 'Mon', consumption: 480, risk: 22 },
    { day: 'Tue', consumption: 510, risk: 25 },
    { day: 'Wed', consumption: 495, risk: 21 },
    { day: 'Thu', consumption: 540, risk: 28 },
    { day: 'Fri', consumption: 620, risk: 42 },
    { day: 'Sat', consumption: 680, risk: 65 },
    { day: 'Sun', consumption: 710, risk: 78 },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner & KPI Row */}
      <RecommendationBanner />
      <KPICards />

      {/* Main Map & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Map (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              Regional Supply Network Map
            </h2>
            <button
              onClick={() => setActivePage('map')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline"
            >
              Expand Full Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <SupplyNetworkMap height="480px" />
        </div>

        {/* Live Alerts & Risk Trend Side Column */}
        <div className="space-y-4">
          {/* Risk Trend Chart */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Regional Consumption & Risk Index
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">7-Day Projection</span>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                  />
                  <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#riskGrad)" name="Risk Score %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-time Alerts Ticker */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" />
                Live Intelligence Stream
              </h3>
              <button
                onClick={() => setActivePage('alerts')}
                className="text-[10px] text-cyan-400 hover:underline"
              >
                View Log
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {alerts.slice(0, 4).map(alert => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                    alert.type === 'critical'
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                      : alert.type === 'warning'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                      : alert.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{alert.title}</span>
                    <span className="text-[9px] opacity-70 font-mono">{alert.timestamp}</span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-tight">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Overview Quick Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-white">Monitored Facilities Overview</h3>
            <p className="text-xs text-slate-400">Current stockout risk and critical inventory items per facility</p>
          </div>
          <button
            onClick={() => setActivePage('facilities')}
            className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
          >
            View All Facilities <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Facility Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Critical Items</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {facilities.map(fac => (
                <tr key={fac.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    {fac.name}
                  </td>
                  <td className="py-3 px-4">{fac.type}</td>
                  <td className="py-3 px-4 text-slate-400">{fac.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      fac.status === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      fac.status === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {fac.status} ({fac.riskScore}%)
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">
                    {fac.stockoutCount > 0 ? (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {fac.stockoutCount} items
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedFacilityId(fac.id);
                        setActivePage('facilities');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[11px] transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
