import React from 'react';
import { useMedFlow } from '../context/MedFlowContext';
import { 
  TrendingUp, 
  BrainCircuit, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  BarChart2, 
  CheckCircle2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell,
  LineChart,
  Line
} from 'recharts';

export const PredictionAnalyticsPage: React.FC = () => {
  const { inventory, facilities } = useMedFlow();

  const sortedByRisk = [...inventory].sort((a, b) => b.riskScore - a.riskScore);

  const forecastData = sortedByRisk.map(item => {
    const fac = facilities.find(f => f.id === item.facilityId);
    return {
      name: `${fac?.name.split(' ')[0]} - ${item.medicineName.split(' ')[0]}`,
      daysLeft: item.daysUntilStockout,
      risk: item.riskScore,
      confidence: item.confidenceScore,
    };
  });

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-cyan-400" />
          AI Shortage Prediction Engine
        </h2>
        <p className="text-xs text-slate-400">
          Predictive model evaluating inventory-to-consumption ratio, supplier ETA bottlenecks, and demand spikes.
        </p>
      </div>

      {/* Algorithm Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Prediction Methodology & Risk Formula</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="font-bold text-cyan-300 block mb-1 font-mono">1. Stockout Horizon</span>
            <code className="text-[11px] text-slate-300 bg-slate-950 px-2 py-1 rounded block">
              days_until_stockout = stock / daily_consumption
            </code>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="font-bold text-amber-300 block mb-1 font-mono">2. Replenishment Risk Score</span>
            <p className="text-slate-400 text-[11px]">
              Factors supplier delay penalties, seasonal spikes, and safety buffer thresholds into 0–100% risk index.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="font-bold text-emerald-300 block mb-1 font-mono">3. Confidence Assessment</span>
            <p className="text-slate-400 text-[11px]">
              Evaluates variance in historical 7-day consumption to output confidence rating (82%–98%).
            </p>
          </div>
        </div>
      </div>

      {/* Stockout Timeline Bar Chart */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            Predicted Days Remaining Until Stockout Across Facilities
          </h3>
          <span className="text-xs text-slate-400 font-mono">Ranked by Stockout Urgency</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'Days Left', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="daysLeft" name="Days Remaining" radius={[6, 6, 0, 0]}>
                {forecastData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.daysLeft <= 6 ? '#ef4444' : entry.daysLeft <= 12 ? '#f59e0b' : '#10b981'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Prediction Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-sm text-slate-200">
          Facility Medicine Risk & Prediction Confidence Summary
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Facility & Medicine</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Daily Cons.</th>
                <th className="py-3 px-4">Predicted Stockout</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {inventory.map(item => {
                const fac = facilities.find(f => f.id === item.facilityId);
                return (
                  <tr key={`${item.facilityId}-${item.medicineId}`} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-sans font-semibold text-white">
                      {fac?.name} – {item.medicineName}
                    </td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{item.currentStock} units</td>
                    <td className="py-3 px-4">{item.dailyConsumption}/day</td>
                    <td className={`py-3 px-4 font-bold ${
                      item.daysUntilStockout <= 7 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {item.daysUntilStockout} days
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        item.status === 'critical' ? 'bg-rose-950 text-rose-300' :
                        item.status === 'warning' ? 'bg-amber-950 text-amber-300' :
                        'bg-emerald-950 text-emerald-300'
                      }`}>
                        {item.riskScore}% ({item.status})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      {item.confidenceScore}% Confidence
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
