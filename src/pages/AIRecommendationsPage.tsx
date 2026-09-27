import React from 'react';
import { useMedFlow } from '../context/MedFlowContext';
import { 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Clock, 
  PackageCheck, 
  CheckCircle2, 
  ShieldAlert,
  MapPin,
  TrendingDown
} from 'lucide-react';

export const AIRecommendationsPage: React.FC = () => {
  const { recommendations, approveTransfer, setActivePage } = useMedFlow();

  const pendingRecs = recommendations.filter(r => r.status === 'pending');
  const completedRecs = recommendations.filter(r => r.status === 'completed');

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Intelligent Redistribution Engine ({pendingRecs.length} Pending Actions)
          </h2>
          <p className="text-xs text-slate-400">
            AI donor selection system matching nearby surplus to at-risk facilities while preserving donor safety buffers.
          </p>
        </div>
      </div>

      {/* Pending Transfers Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
          Pending Recommended Interventions
        </h3>

        {pendingRecs.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center space-y-3 border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-base">All Regional Inventory Levels Balanced</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No emergency transfers are currently required. The AI engine is continuously monitoring facility consumption rates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingRecs.map(rec => (
              <div
                key={rec.id}
                className="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 shadow-2xl space-y-4"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Alert Header */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> High Impact Recommendation
                      </span>
                      <span className="text-xs font-mono text-rose-400 font-bold">
                        Stockout Risk: {rec.recipientPreTransferRisk}% Critical
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-white tracking-tight">
                      Transfer <span className="text-cyan-400 font-mono">{rec.recommendedTransferUnits} units</span> of {rec.medicineName}
                    </h3>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => approveTransfer(rec.id)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                  >
                    <PackageCheck className="w-5 h-5 text-slate-950" />
                    <span>Approve Transfer Now</span>
                  </button>
                </div>

                {/* Donor & Recipient Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Donor Facility Card */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" /> Donor Facility (Surplus Provider)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {rec.donorAvailableSurplus} Surplus Units
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{rec.donorFacilityName}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      Distance: {rec.donorDistanceKm} km | Transit Time: {rec.donorTravelTimeHours} hrs
                    </div>
                  </div>

                  {/* Recipient Facility Card */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" /> Recipient Facility (At Risk)
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                        Stockout in {rec.recipientPreTransferDays} days
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{rec.recipientFacilityName}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      Post-Transfer Stockout: <strong className="text-emerald-400">{rec.recipientPostTransferDays} days</strong>
                    </div>
                  </div>
                </div>

                {/* Risk Score Delta Bar */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-sans">Regional Shortage Risk Impact:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-rose-400 font-bold text-sm">{rec.recipientPreTransferRisk}%</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-extrabold text-base">{rec.recipientPostTransferRisk}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Transfers History */}
      {completedRecs.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider">
            Completed Transfer Audit Log ({completedRecs.length})
          </h3>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Medicine</th>
                  <th className="py-3 px-4">Donor</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Transferred Units</th>
                  <th className="py-3 px-4">Risk Reduction</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {completedRecs.map(c => (
                  <tr key={c.id} className="hover:bg-slate-900/50 font-mono">
                    <td className="py-3 px-4 font-sans font-semibold text-white">{c.medicineName}</td>
                    <td className="py-3 px-4 text-emerald-400">{c.donorFacilityName}</td>
                    <td className="py-3 px-4 text-cyan-300">{c.recipientFacilityName}</td>
                    <td className="py-3 px-4 font-bold text-white">{c.recommendedTransferUnits} units</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      {c.recipientPreTransferRisk}% → {c.recipientPostTransferRisk}%
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
