import React from 'react';
import { MedFlowProvider, useMedFlow } from './context/MedFlowContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './pages/DashboardView';
import { RegionalMapPage } from './pages/RegionalMapPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { MedicineInventoryPage } from './pages/MedicineInventoryPage';
import { PredictionAnalyticsPage } from './pages/PredictionAnalyticsPage';
import { AIRecommendationsPage } from './pages/AIRecommendationsPage';
import { SimulationCenterPage } from './pages/SimulationCenterPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PresentationPage } from './pages/PresentationPage';
import { ActivePage } from './types/medflow';
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  Pill, 
  Sparkles, 
  Sliders,
  Presentation
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activePage, setActivePage, recommendations } = useMedFlow();

  const pendingRecsCount = recommendations.filter(r => r.status === 'pending').length;

  const renderView = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardView />;
      case 'map': return <RegionalMapPage />;
      case 'facilities': return <FacilitiesPage />;
      case 'inventory': return <MedicineInventoryPage />;
      case 'analytics': return <PredictionAnalyticsPage />;
      case 'recommendations': return <AIRecommendationsPage />;
      case 'simulation': return <SimulationCenterPage />;
      case 'alerts': return <AlertsPage />;
      case 'settings': return <SettingsPage />;
      case 'presentation': return <PresentationPage />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden sticky bottom-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md px-2 py-2 flex items-center justify-around">
        {[
          { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
          { id: 'map' as ActivePage, label: 'Map', icon: Map },
          { id: 'facilities' as ActivePage, label: 'Facilities', icon: Building2 },
          { id: 'inventory' as ActivePage, label: 'Inventory', icon: Pill },
          { id: 'recommendations' as ActivePage, label: 'AI Recs', icon: Sparkles, badge: pendingRecsCount },
          { id: 'simulation' as ActivePage, label: 'Simulate', icon: Sliders },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePage(tab.id)}
              className={`flex flex-col items-center gap-1 p-1 rounded-lg text-[10px] font-semibold relative ${
                isActive ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export function App() {
  return (
    <MedFlowProvider>
      <MainContent />
    </MedFlowProvider>
  );
}

export default App;
