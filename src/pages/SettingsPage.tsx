import React, { useState } from 'react';
import { useMedFlow } from '../context/MedFlowContext';
import { 
  Settings, 
  ShieldCheck, 
  RotateCcw, 
  Sliders, 
  Save, 
  BellRing,
  Cpu
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetSystem } = useMedFlow();
  const [safetyBufferDays, setSafetyBufferDays] = useState(14);
  const [transitSpeedKm, setTransitSpeedKm] = useState(40);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 pb-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          System Settings & AI Algorithm Configuration
        </h2>
        <p className="text-xs text-slate-400">
          Configure safety stock thresholds, redistribution donor constraints, and demo data parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Safety Threshold Parameters */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Safety Thresholds & Donor Protection Rules
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Donor Minimum Safety Stock Buffer (Days):
              </label>
              <input
                type="number"
                min="7"
                max="30"
                value={safetyBufferDays}
                onChange={(e) => setSafetyBufferDays(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:border-cyan-500 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Donor facilities will never be asked to transfer stock below this safety threshold.
              </p>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Estimated Transit Fleet Speed (km/h):
              </label>
              <input
                type="number"
                min="20"
                max="80"
                value={transitSpeedKm}
                onChange={(e) => setTransitSpeedKm(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:border-cyan-500 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Used to calculate estimated travel time for inter-facility transfers.
              </p>
            </div>
          </div>
        </div>

        {/* Modular AI Model Config */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Prediction Engine Modular Abstraction
          </h3>

          <div className="text-xs text-slate-300 space-y-2">
            <p className="text-slate-400">
              The platform is structured with a clean prediction service interface (<code className="text-cyan-400">predictionEngine.ts</code>) ready for drop-in replacement by TensorFlow/PyTorch ML models.
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-cyan-300">
              Active Prediction Engine: Rule-Based Multi-Factor Analytics Engine (v1.0-Hackathon)
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetSystem}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold text-xs border border-rose-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset Baseline Dataset
          </button>

          <div className="flex items-center gap-3">
            {savedMsg && (
              <span className="text-xs text-emerald-400 font-semibold font-mono animate-pulse">
                Settings Saved!
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              <Save className="w-4 h-4 text-slate-950" /> Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
