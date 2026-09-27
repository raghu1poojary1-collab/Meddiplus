import React, { useState } from 'react';
import { useMedFlow } from '../context/MedFlowContext';
import { 
  Pill, 
  Search, 
  Download, 
  Filter, 
  ArrowUpDown, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Truck,
  X
} from 'lucide-react';
import { FacilityInventoryItem } from '../types/medflow';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const MedicineInventoryPage: React.FC = () => {
  const { inventory, facilities, setSelectedMedicineId } = useMedFlow();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'risk' | 'stock' | 'days'>('risk');
  const [inspectItem, setInspectItem] = useState<FacilityInventoryItem | null>(null);

  const categories = Array.from(new Set(inventory.map(i => i.category)));

  const filtered = inventory.filter(item => {
    const fac = facilities.find(f => f.id === item.facilityId);
    const matchesSearch = item.medicineName.toLowerCase().includes(search.toLowerCase()) ||
                          (fac && fac.name.toLowerCase().includes(search.toLowerCase())) ||
                          item.supplierName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStat = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStat;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    if (sortBy === 'stock') return a.currentStock - b.currentStock;
    if (sortBy === 'days') return a.daysUntilStockout - b.daysUntilStockout;
    return 0;
  });

  // Export CSV feature
  const exportToCSV = () => {
    const headers = ['Facility,Medicine,Category,Current Stock,Daily Consumption,Days Remaining,Supplier ETA,Supplier Delay,Risk Score,Status'];
    const rows = filtered.map(i => {
      const fac = facilities.find(f => f.id === i.facilityId);
      return `"${fac?.name || i.facilityId}","${i.medicineName}","${i.category}",${i.currentStock},${i.dailyConsumption},${i.daysUntilStockout},${i.supplierEtaDays},${i.supplierDelayDays},${i.riskScore}%,${i.status}`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medflow_inventory_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-400" />
            Regional Medicine Inventory ({filtered.length} items)
          </h2>
          <p className="text-xs text-slate-400">
            Real-time stock levels, consumption rates, days remaining, supplier ETAs, and AI risk scores.
          </p>
        </div>

        {/* Filter / Sort / Export controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search medicine / hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">🔴 Critical</option>
            <option value="warning">🟠 At Risk</option>
            <option value="healthy">🟢 Healthy</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <button
              onClick={() => setSortBy('risk')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${sortBy === 'risk' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              Risk
            </button>
            <button
              onClick={() => setSortBy('stock')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${sortBy === 'stock' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              Stock
            </button>
            <button
              onClick={() => setSortBy('days')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${sortBy === 'days' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'}`}
            >
              Days
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Medicine & Category</th>
                <th className="py-3.5 px-4">Facility</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Daily Consumption</th>
                <th className="py-3.5 px-4">Days Remaining</th>
                <th className="py-3.5 px-4">Supplier & ETA</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4 text-right">Analytics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(item => {
                const fac = facilities.find(f => f.id === item.facilityId);
                return (
                  <tr
                    key={`${item.facilityId}-${item.medicineId}`}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                    onClick={() => setInspectItem(item)}
                  >
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-cyan-400" />
                        <div>
                          <div>{item.medicineName}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{fac?.name || item.facilityId}</td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">{item.currentStock}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{item.dailyConsumption}/day</td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`font-bold ${
                        item.daysUntilStockout <= 7 ? 'text-rose-400' :
                        item.daysUntilStockout <= 14 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {item.daysUntilStockout} days
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      <div>{item.supplierName}</div>
                      <div className="text-[10px]">
                        ETA: {item.supplierEtaDays}d
                        {item.supplierDelayDays > 0 && (
                          <span className="text-amber-400 ml-1 font-bold">(+{item.supplierDelayDays}d delay)</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        item.status === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' :
                        item.status === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {item.riskScore}% ({item.status})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectItem(item);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Analytics Modal */}
      {inspectItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/30 p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Pill className="w-5 h-5 text-cyan-400" />
                  {inspectItem.medicineName} – Analytics
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Facility: {facilities.find(f => f.id === inspectItem.facilityId)?.name}
                </p>
              </div>
              <button
                onClick={() => setInspectItem(null)}
                className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Row */}
            <div className="grid grid-cols-4 gap-3 text-center font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Current Stock</span>
                <span className="text-cyan-400 font-bold text-base">{inspectItem.currentStock}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Daily Consumption</span>
                <span className="text-white font-bold text-base">{inspectItem.dailyConsumption}/day</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Predicted Stockout</span>
                <span className="text-amber-400 font-bold text-base">{inspectItem.daysUntilStockout} days</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Risk Score</span>
                <span className="text-rose-400 font-bold text-base">{inspectItem.riskScore}%</span>
              </div>
            </div>

            {/* Historical Consumption Trend Chart */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">7-Day Consumption History (Units/Day)</span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inspectItem.historicalConsumption.map((val, idx) => ({ day: `Day ${idx + 1}`, units: val }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="units" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} name="Consumption" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
