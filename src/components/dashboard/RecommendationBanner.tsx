import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingDown, 
  Building2,
  PackageCheck
} from 'lucide-react';
import { useMedFlow } from '../../context/MedFlowContext';

export const RecommendationBanner: React.FC = () => {
  const { recommendations, approveTransfer } = useMedFlow();

  const pendingRecs = recommendations.filter(r => r.status === 'pending');

  if (pendingRecs.length === 0) {
    return (
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-emerald-300">Regional Supply Network Balanced</h4>
            <p className="text-xs text-slate-400">All facilities maintaining safe medicine inventory buffers. No emergency redistribution transfers needed.</p>
          </div>
        </div>
      </div>
    );
  }

  const primaryRec = pendingRecs[0];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 shadow-2xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AI Recommended Intervention
            </span>
            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {primaryRec.recipientFacilityName} approaching stockout
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-white tracking-tight">
            Transfer <span className="text-cyan-400 font-mono">{primaryRec.recommendedTransferUnits} units</span> of {primaryRec.medicineName}
          </h3>

          {/* Route Details */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>From: <strong className="text-white">{primaryRec.donorFacilityName}</strong></span>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 hidden sm:block" />
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Building2 className="w-3.5 h-3.5 text-rose-400" />
              <span>To: <strong className="text-white">{primaryRec.recipientFacilityName}</strong></span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Est. Transit: {primaryRec.donorTravelTimeHours} hrs</span>
            </div>
          </div>
        </div>

        {/* Risk Impact & Approve Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          {/* Risk reduction box */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center min-w-[170px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Regional Risk Impact</span>
            <div className="flex items-center justify-center gap-2 font-mono">
              <span className="text-rose-400 font-bold text-base line-through opacity-80">{primaryRec.recipientPreTransferRisk}%</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-extrabold text-xl">{primaryRec.recipientPostTransferRisk}%</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              Stockout pushed to {primaryRec.recipientPostTransferDays} days
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={() => approveTransfer(primaryRec.id)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <PackageCheck className="w-5 h-5 text-slate-950" />
            <span>Approve Transfer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
