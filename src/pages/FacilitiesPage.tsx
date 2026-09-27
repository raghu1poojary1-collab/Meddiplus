import React, { useState } from 'react';
import { useMedFlow } from '../context/MedFlowContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Bed, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Search, 
  Pill,
  ChevronRight,
  X
} from 'lucide-react';
import { Facility } from '../types/medflow';

export const FacilitiesPage: React.FC = () => {
  const { facilities, inventory, selectedFacilityId, setSelectedFacilityId } = useMedFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredFacilities = facilities.filter(fac => {
    const matchesSearch = fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fac.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || fac.status === filterType;
    return matchesSearch && matchesType;
  });

  const selectedFacility = facilities.find(f => f.id === selectedFacilityId);
  const selectedInv = selectedFacility ? inventory.filter(i => i.facilityId === selectedFacility.id) : [];

  return (
    <div className="space-y-6 pb-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-400" />
            Regional Healthcare Facilities ({facilities.length})
          </h2>
          <p className="text-xs text-slate-400">
            Monitor inventory status, stockout risk level, and supplier connection across hospitals and clinics.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search facilities or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">🟢 Healthy</option>
            <option value="warning">🟠 At Risk</option>
            <option value="critical">🔴 Critical</option>
          </select>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFacilities.map(fac => {
          const facInv = inventory.filter(i => i.facilityId === fac.id);
          const criticalCount = facInv.filter(i => i.status === 'critical').length;
          const warningCount = facInv.filter(i => i.status === 'warning').length;

          return (
            <div
              key={fac.id}
              onClick={() => setSelectedFacilityId(fac.id)}
              className={`glass-card p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                fac.status === 'critical' ? 'border-rose-800/60 bg-rose-950/20 hover:border-rose-600' :
                fac.status === 'warning' ? 'border-amber-800/60 bg-amber-950/20 hover:border-amber-600' :
                'border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      fac.status === 'critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      fac.status === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{fac.name}</h3>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" /> {fac.location}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    fac.status === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse' :
                    fac.status === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  }`}>
                    {fac.status} ({fac.riskScore}%)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Monitored Items</span>
                    <span className="text-white font-bold">{facInv.length} medicines</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Stockout Risk</span>
                    <span className={criticalCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {criticalCount} critical / {warningCount} warning
                    </span>
                  </div>
                </div>

                {/* Items Preview List */}
                <div className="space-y-1.5 pt-1">
                  {facInv.slice(0, 3).map(item => (
                    <div key={item.medicineId} className="flex justify-between items-center text-[11px] py-1 px-2 rounded bg-slate-900/50">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Pill className="w-3 h-3 text-cyan-400" /> {item.medicineName}
                      </span>
                      <span className={`font-mono font-semibold ${
                        item.daysUntilStockout <= 7 ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {item.currentStock} units ({item.daysUntilStockout}d left)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>View Full Facility Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Facility Detail Drawer Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-3xl rounded-2xl border border-cyan-500/30 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedFacility.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {selectedFacility.location}
                    <span>•</span>
                    <Phone className="w-3.5 h-3.5 text-cyan-400" /> {selectedFacility.contactPhone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFacilityId(null)}
                className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inventory Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">
                Current Medicine Inventory & Stockout Predictions
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Medicine</th>
                      <th className="py-2.5 px-3">Current Stock</th>
                      <th className="py-2.5 px-3">Daily Cons.</th>
                      <th className="py-2.5 px-3">Days Left</th>
                      <th className="py-2.5 px-3">Supplier ETA</th>
                      <th className="py-2.5 px-3">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedInv.map(item => (
                      <tr key={item.medicineId} className="hover:bg-slate-900/60">
                        <td className="py-2.5 px-3 font-semibold text-white">{item.medicineName}</td>
                        <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold">{item.currentStock}</td>
                        <td className="py-2.5 px-3 font-mono">{item.dailyConsumption}/day</td>
                        <td className={`py-2.5 px-3 font-mono font-bold ${
                          item.daysUntilStockout <= 7 ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {item.daysUntilStockout} days
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">
                          {item.supplierEtaDays}d {item.supplierDelayDays > 0 && <span className="text-amber-400 font-bold">(+{item.supplierDelayDays}d delay)</span>}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'critical' ? 'bg-rose-950 text-rose-300' :
                            item.status === 'warning' ? 'bg-amber-950 text-amber-300' :
                            'bg-emerald-950 text-emerald-300'
                          }`}>
                            {item.riskScore}% ({item.status})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
