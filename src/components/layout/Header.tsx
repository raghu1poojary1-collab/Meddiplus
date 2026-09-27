import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Bell, 
  User, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Sparkles,
  ChevronDown,
  Presentation
} from 'lucide-react';
import { useMedFlow } from '../../context/MedFlowContext';

export const Header: React.FC = () => {
  const { alerts, startLiveScenario, resetSystem, isScenarioRunning, activeScenarioStep, setActivePage } = useMedFlow();
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [showAlertDropdown, setShowAlertDropdown] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              MedFlow <span className="text-cyan-400 font-mono">AI</span>
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
              Healthcare Supply Intelligence
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            Predict. Connect. Redistribute. Prevent shortages.
          </p>
        </div>
      </div>

      {/* Middle Status Indicator & Demo Trigger */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-400">Live AI Engine Active</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-400">{dateStr} {timeStr}</span>
        </div>

        {/* Live Scenario Quick Action Button */}
        <button
          onClick={startLiveScenario}
          disabled={isScenarioRunning}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          {isScenarioRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Step {activeScenarioStep}/3 Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-white fill-white" />
              <span>Run Prebuilt Demo Scenario</span>
            </>
          )}
        </button>

        {/* Project Presentation Pitch Deck Button */}
        <button
          onClick={() => setActivePage('presentation')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 hover:bg-cyan-950/50 text-cyan-300 text-xs font-semibold shadow-sm transition-all"
        >
          <Presentation className="w-3.5 h-3.5 text-cyan-400" />
          <span>Presentation</span>
        </button>

        {/* Find Hospitals Near Me Header Action */}
        <button
          onClick={() => setActivePage('map')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-700/80 hover:bg-cyan-900/80 text-cyan-200 text-xs font-semibold shadow-sm transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>📍 Find Nearby Hospitals</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Reset System */}
        <button
          onClick={resetSystem}
          title="Reset System Baseline"
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertDropdown(!showAlertDropdown)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {showAlertDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-xl shadow-2xl p-3 z-50 border border-slate-700">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" /> System Alerts ({alerts.length})
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">Real-time Feed</span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No active alerts</p>
                ) : (
                  alerts.slice(0, 5).map(alert => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-lg border text-xs ${
                        alert.type === 'critical'
                          ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                          : alert.type === 'warning'
                          ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                          : alert.type === 'success'
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span>{alert.title}</span>
                        <span className="text-[10px] opacity-70 font-mono">{alert.timestamp}</span>
                      </div>
                      <p className="opacity-90 leading-relaxed text-[11px]">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-300 font-semibold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-slate-200">Dr. Alex Vance</div>
            <div className="text-[10px] text-slate-400 font-mono">Command Ops Leader</div>
          </div>
        </div>
      </div>
    </header>
  );
};
