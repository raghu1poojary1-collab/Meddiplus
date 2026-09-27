import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  MapPin, 
  Sliders, 
  CheckCircle2, 
  Github, 
  ExternalLink, 
  Zap, 
  BarChart3, 
  Layers, 
  Activity,
  Presentation as PresentationIcon,
  ArrowRight
} from 'lucide-react';
import { useMedFlow } from '../context/MedFlowContext';

interface PresentationSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export const PresentationPage: React.FC = () => {
  const { setActivePage, systemKPIs } = useMedFlow();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const slides: PresentationSlide[] = [
    {
      id: 1,
      badge: 'Executive Summary',
      title: 'MedFlow AI Platform',
      subtitle: 'Next-Generation Healthcare Supply Chain Intelligence & Autonomous Stockout Mitigation',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-1">Predictive AI</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                7-day & 30-day stockout prediction algorithm with 94.2% historical accuracy across regional health networks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-1">Surplus Optimization</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous multi-facility redistribution engine balancing surplus stock to critical shortage points instantly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-1">Crisis Simulation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time stress-testing suite simulating regional epidemic spikes, logistics delays, and supply disruptions.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Facilities Monitored</span>
                <p className="text-2xl font-extrabold text-cyan-400">{systemKPIs.totalFacilities} Nodes</p>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Shortage Reduction</span>
                <p className="text-2xl font-extrabold text-emerald-400">-78.4%</p>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Sync Interval</span>
                <p className="text-2xl font-extrabold text-purple-400">100 ms</p>
              </div>
            </div>

            <button 
              onClick={() => setActivePage('dashboard')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )
    },
    {
      id: 2,
      badge: 'Problem Statement',
      title: 'The Healthcare Supply Crisis',
      subtitle: 'Why Conventional Inventory Management Fails During Regional Health Surges',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-rose-200 text-sm mb-1">Silent Stockouts Kill</h5>
                <p className="text-slate-400">
                  Over 35% of rural clinics face sudden inventory stockouts of life-saving medicines (Insulin, Epinephrine, Antibiotics) due to static reorder point models.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/40 flex items-start gap-3">
              <Activity className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-amber-200 text-sm mb-1">Surplus Silos & Expiration Waste</h5>
                <p className="text-slate-400">
                  While one hospital suffers a critical shortage, a regional facility just 15 km away holds excess stock that expires unused due to lack of visibility.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <Layers className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-200 text-sm mb-1">Supplier Latency & Volatility</h5>
                <p className="text-slate-400">
                  Unpredictable supplier lead times (3 to 14 days) are often undetected until safety thresholds are breached.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="text-xs font-mono text-cyan-400 mb-1">INDUSTRY BENCHMARK VS MEDFLOW</div>
              <h4 className="text-base font-bold text-slate-100">Stockout Response Time</h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Traditional Manual Orders</span>
                  <span className="text-rose-400 font-mono font-bold">48 - 72 Hours</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-semibold text-cyan-300">MedFlow Autonomous Sync</span>
                  <span className="text-cyan-400 font-mono font-bold">Real-time (&lt; 1 sec)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-cyan-400 h-2 rounded-full w-12 shadow-lg shadow-cyan-400/50"></div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-300">
              ✨ MedFlow dynamically predicts depletion before it occurs and triggers auto-transfers across neighboring health hubs.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      badge: 'Core Technology',
      title: 'AI Stockout Prediction Engine',
      subtitle: 'Dynamic Moving Average & Confidence Scoring Algorithm',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Depletion Forecasting Equation</h4>
                <p className="text-[11px] text-slate-400">Considers burn rate, lead time, and safety buffers</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 space-y-2">
              <div className="text-slate-500">// Days Until Depletion Calculation</div>
              <div>
                <span className="text-purple-400">Days_Remaining</span> = <span className="text-emerald-400">Stock_Current</span> / (<span className="text-amber-400">Daily_Burn</span> * <span className="text-cyan-400">Outbreak_Multiplier</span>)
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-purple-400">Risk_Score</span> = Math.min(100, Math.round((1 - Days_Remaining / Safety_Threshold) * 100))
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Considers historical 7-day trailing consumption rates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Factored supplier lead times + active delay penalties</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Confidence index (85% to 98%) calculated dynamically</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/20">
              <h4 className="text-xs uppercase font-mono text-cyan-400 tracking-wider mb-2">Live Risk Spectrum</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                  <div className="text-emerald-400 font-bold text-lg">Healthy</div>
                  <div className="text-[10px] text-slate-400 mt-1">&gt; 14 Days Stock</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
                  <div className="text-amber-400 font-bold text-lg">Warning</div>
                  <div className="text-[10px] text-slate-400 mt-1">7 - 14 Days Stock</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center">
                  <div className="text-rose-400 font-bold text-lg">Critical</div>
                  <div className="text-[10px] text-slate-400 mt-1">&lt; 7 Days Stock</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Simulate Analytics View</span>
                <p className="text-sm font-bold text-slate-200">Prediction Analytics Center</p>
              </div>
              <button 
                onClick={() => setActivePage('analytics')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 text-xs font-semibold hover:bg-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>View Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      badge: 'Logistics Optimization',
      title: 'Autonomous Multi-Facility Redistribution',
      subtitle: 'Zero-Waste Inter-Hospital Inventory Balancing Matrix',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-mono text-[10px] uppercase">Step 1</div>
              <h5 className="font-bold text-slate-200">Surplus Discovery</h5>
              <p className="text-slate-400 text-[11px]">
                Identifies facilities holding stock exceeding 30+ days of buffer (e.g. St. Jude Regional Hub).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-mono text-[10px] uppercase">Step 2</div>
              <h5 className="font-bold text-slate-200">Distance & ETA Matrix</h5>
              <p className="text-slate-400 text-[11px]">
                Calculates transit distance, travel time, and transit temperature compliance between donor and recipient.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-mono text-[10px] uppercase">Step 3</div>
              <h5 className="font-bold text-slate-200">One-Click Dispatch</h5>
              <p className="text-slate-400 text-[11px]">
                Generates instant transfer orders with pre/post regional risk delta calculation.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-purple-950/50 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-cyan-400 uppercase">Live Impact Example</span>
              <h4 className="text-sm font-bold text-slate-100">Transfer 200 Units Epinephrine from Metro Central to Rural Hope Clinic</h4>
              <p className="text-xs text-slate-400">Recipient risk drops from 88% (Critical) to 12% (Healthy) in 1.5 hours transit.</p>
            </div>

            <button 
              onClick={() => setActivePage('recommendations')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>View AI Recommendations</span>
            </button>
          </div>
        </div>
      )
    },
    {
      id: 5,
      badge: 'Geospatial Intelligence',
      title: 'Regional Supply Map & Routing',
      subtitle: 'Live Interactive Geospatial Map Powered by Leaflet & GIS Pipelines',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-200 text-sm">Geospatial Regional Monitoring</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Renders interactive maps showing hospital locations, risk color-coded markers (Healthy / Warning / Critical), and regional supply corridors.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-500 text-[10px] block">GPS Precision</span>
                <span className="text-cyan-300 font-bold">Sub-meter Coordinates</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-500 text-[10px] block">Cluster Grouping</span>
                <span className="text-emerald-300 font-bold">Regional Health Hubs</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/30 text-center space-y-3 overflow-hidden">
            <img 
              src={`${import.meta.env.BASE_URL}screenshots/regional-map.jpg`} 
              alt="Regional Supply Map Interface" 
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
              className="w-full h-44 object-cover rounded-xl border border-slate-800 shadow-md"
            />
            <div className="flex items-center justify-between pt-1 px-2">
              <span className="text-xs text-slate-300 font-semibold">Interactive Geospatial GIS Map</span>
              <button 
                onClick={() => setActivePage('map')}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-extrabold text-xs hover:bg-cyan-400 transition-all inline-flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <span>Launch Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      badge: 'Stress Testing',
      title: 'Crisis & Epidemic Simulation Center',
      subtitle: 'Simulating Epidemic Spikes, Logistics Delays, and Supply Disruptions',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-900 border border-rose-900/30 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                1
              </div>
              <h5 className="font-bold text-slate-100 text-sm">Outbreak Surge (+300%)</h5>
              <p className="text-slate-400 text-[11px]">
                Simulate sudden viral flu or epidemic outbreaks spiking medication consumption overnight.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-900/30 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <h5 className="font-bold text-slate-100 text-sm">Supplier Supply Shock</h5>
              <p className="text-slate-400 text-[11px]">
                Inject supplier delays up to +14 days to stress-test regional buffer resiliency.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-900/30 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                3
              </div>
              <h5 className="font-bold text-slate-100 text-sm">Automated Recovery</h5>
              <p className="text-slate-400 text-[11px]">
                Watch the AI engine instantly generate emergency re-balancing recommendations.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-400 block">Interactive Scenario Testing</span>
              <span className="text-slate-200 font-bold">Launch the Simulation Center to test custom parameters</span>
            </div>

            <button 
              onClick={() => setActivePage('simulation')}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <Sliders className="w-4 h-4" />
              <span>Open Simulation Center</span>
            </button>
          </div>
        </div>
      )
    },
    {
      id: 7,
      badge: 'Architecture',
      title: 'Full Stack Tech & Architecture',
      subtitle: 'Modern TypeScript, React 18, Vite 6, Tailwind CSS, & Express Pipeline',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Frontend Architecture</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-mono text-[10px] block">UI CORE</span>
                <span className="text-slate-200 font-semibold">React 18 + TS</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-mono text-[10px] block">BUNDLER</span>
                <span className="text-slate-200 font-semibold">Vite 6</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-mono text-[10px] block">STYLES</span>
                <span className="text-slate-200 font-semibold">Tailwind CSS</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-mono text-[10px] block">MAPS & CHARTS</span>
                <span className="text-slate-200 font-semibold">Leaflet + Recharts</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Backend & Deployment Pipeline</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-mono text-[10px] block">API SERVER</span>
                <span className="text-slate-200 font-semibold">Express + TSX</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-mono text-[10px] block">STATE MANAGEMENT</span>
                <span className="text-slate-200 font-semibold">React Context API</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-mono text-[10px] block">HOSTING</span>
                <span className="text-slate-200 font-semibold">GitHub Pages</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-emerald-400 font-mono text-[10px] block">CI / CD</span>
                <span className="text-slate-200 font-semibold">GitHub Actions</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      badge: 'Summary & Links',
      title: 'MedFlow Repository Presentation',
      subtitle: 'Experience MedFlow AI Live or Explore the GitHub Repository',
      content: (
        <div className="space-y-6 text-center py-4">
          <div className="max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Source Healthcare AI Solution</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-100">Ready to Transform Regional Medical Supply?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore our live interactive dashboard, stress-test crisis scenarios, or inspect our GitHub codebase.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a 
              href="https://github.com/shrex88/MedFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs hover:bg-slate-700 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/50"
            >
              <Github className="w-4 h-4" />
              <span>View GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            <button 
              onClick={() => setActivePage('dashboard')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-xl shadow-cyan-500/20"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Full Command Dashboard</span>
            </button>
          </div>
        </div>
      )
    }
  ];

  // Auto-play slideshow timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  // Keyboard navigation support
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    } else if (e.key === 'ArrowLeft') {
      setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const activeSlide = slides[currentSlide];

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
            <PresentationIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <span>MedFlow Project Presentation Deck</span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono">
                Interactive
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive presentation deck for stakeholders, code review, and pitch demonstrations.
            </p>
          </div>
        </div>

        {/* Deck Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPlaying 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Auto' : 'Play Auto'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <a 
            href="https://github.com/shrex88/MedFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repo</span>
          </a>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="relative min-h-[460px] rounded-3xl bg-slate-900/90 border border-slate-800 p-6 md:p-10 flex flex-col justify-between shadow-2xl shadow-cyan-950/20">
        {/* Slide Header */}
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              {activeSlide.badge}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
            {activeSlide.title}
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-medium">
            {activeSlide.subtitle}
          </p>
        </div>

        {/* Slide Main Content */}
        <div className="py-6 flex-1 flex flex-col justify-center">
          {activeSlide.content}
        </div>

        {/* Slide Footer Navigation */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx 
                    ? 'w-6 bg-cyan-400 shadow-md shadow-cyan-400/50' 
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
