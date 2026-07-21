'use client';

import React from 'react';
import { 
  Fuel, 
  MapPin, 
  Navigation, 
  BarChart3, 
  Sparkles, 
  Car, 
  DollarSign, 
  Globe, 
  Zap,
  TrendingDown,
  Sliders,
  Activity,
  Database
} from 'lucide-react';
import { UserPreferences, Vehicle } from '../types';
import { useSimulator } from '../context/SimulatorContext';

export type ActiveTab = 'finder' | 'route' | 'logbook' | 'ai' | 'live' | 'audit' | 'garage';

interface NavbarProps {
  activeTab?: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  preferences?: UserPreferences;
  setPreferences?: React.Dispatch<React.SetStateAction<UserPreferences>>;
  vehicles?: Vehicle[];
  selectedVehicle?: Vehicle;
  isConnected?: boolean;
  isSimulatorOpen?: boolean;
  onToggleSimulator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'finder',
  setActiveTab = () => {},
  preferences = { currencySymbol: '₦', distanceUnit: 'km', volumeUnit: 'liters', efficiencyUnit: 'km/L', selectedFuelGrade: 'regular' },
  setPreferences = () => {},
  vehicles = [],
  selectedVehicle,
  isConnected,
  isSimulatorOpen,
  onToggleSimulator,
}) => {
  const simulatorCtx = useSimulator();
  const effectiveIsSimulatorOpen = isSimulatorOpen ?? simulatorCtx?.isSimulatorOpen ?? false;
  const effectiveOnToggleSimulator = onToggleSimulator ?? simulatorCtx?.toggleSimulator;

  const toggleCurrency = () => {
    setPreferences(prev => ({
      ...prev,
      currencySymbol: prev.currencySymbol === '₦' ? '$' : prev.currencySymbol === '$' ? '€' : prev.currencySymbol === '€' ? '£' : '₦',
    }));
  };

  const toggleUnits = () => {
    setPreferences(prev => ({
      ...prev,
      distanceUnit: prev.distanceUnit === 'km' ? 'miles' : 'km',
      volumeUnit: prev.volumeUnit === 'liters' ? 'gallons' : 'liters',
      efficiencyUnit: prev.efficiencyUnit === 'km/L' ? 'MPG' : 'km/L',
    }));
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      {/* Top Ticker Bar */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/10 px-4 py-1.5 text-xs flex flex-wrap justify-between items-center text-slate-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <TrendingDown className="w-3.5 h-3.5" />
            Cheapest in Ilorin: <strong className="text-white">{preferences?.currencySymbol || '₦'}{preferences?.currencySymbol === '₦' ? '850' : '0.55'}</strong>/{preferences?.volumeUnit === 'gallons' ? 'gal' : 'L'} at Bovas (Tanke)
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-sky-400">
            <Zap className="w-3.5 h-3.5" />
            Live CNG Station: <strong className="text-white">{preferences?.currencySymbol || '₦'}230</strong>/SMC (NNPC Fate Rd)
          </span>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          {effectiveOnToggleSimulator && (
            <button
              onClick={effectiveOnToggleSimulator}
              className={`flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-medium transition-all ${
                effectiveIsSimulatorOpen
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700"
              }`}
            >
              <Sliders className="h-3 w-3" />
              <span>Hardware Sim</span>
            </button>
          )}

          <button 
            onClick={toggleCurrency}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60"
            title="Switch Currency"
          >
            <DollarSign className="w-3 h-3 text-emerald-400" />
            <span>Currency: <strong>{preferences?.currencySymbol || '₦'}</strong></span>
          </button>

          <button 
            onClick={toggleUnits}
            className="hover:text-sky-400 transition-colors flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60"
            title="Toggle Units (Metric / Imperial)"
          >
            <Globe className="w-3 h-3 text-sky-400" />
            <span>Units: <strong>{(preferences?.distanceUnit || 'km').toUpperCase()}</strong></span>
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('finder')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Fuel className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">SMART</span>
                <span className="font-bold text-xl text-emerald-400">FUEL</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-black tracking-widest ml-1">ILORIN</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium -mt-1">
                Ilorin Fuel Intelligence & Route Planner
              </p>
            </div>
          </div>

          {/* Nav Links Tabs */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('finder')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                activeTab === 'finder' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Station Finder</span>
            </button>

            <button
              onClick={() => setActiveTab('route')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                activeTab === 'route' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Route Optimizer</span>
            </button>

            <button
              onClick={() => setActiveTab('logbook')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                activeTab === 'logbook' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Fuel Log</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                activeTab === 'ai' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-semibold' 
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                activeTab === 'live' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>IoT Dispenser</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                activeTab === 'audit' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-semibold' 
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>All Transactions</span>
            </button>
          </nav>

          {/* Vehicle Garage Profile Quick Link */}
          {selectedVehicle ? (
            <button
              onClick={() => setActiveTab('garage')}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
                activeTab === 'garage'
                  ? 'bg-slate-800 border-emerald-500 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-medium text-slate-200 line-clamp-1">{selectedVehicle.make} {selectedVehicle.model}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>{selectedVehicle.currentFuelLevelPercent}% fuel</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{selectedVehicle.avgMpg} {preferences?.efficiencyUnit || 'MPG'}</span>
                </div>
              </div>
            </button>
          ) : (
            <div className="text-xs text-slate-400 font-medium">Smart Fuel</div>
          )}
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden border-t border-slate-800/80 py-2 justify-around text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('finder')}
            className={`flex flex-col items-center gap-1 px-2 py-1 shrink-0 ${activeTab === 'finder' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            <MapPin className="w-4 h-4" />
            <span>Stations</span>
          </button>

          <button
            onClick={() => setActiveTab('route')}
            className={`flex flex-col items-center gap-1 px-2 py-1 shrink-0 ${activeTab === 'route' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            <Navigation className="w-4 h-4" />
            <span>Route</span>
          </button>

          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex flex-col items-center gap-1 px-2 py-1 shrink-0 ${activeTab === 'logbook' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Logbook</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`flex flex-col items-center gap-1 px-2 py-1 shrink-0 ${activeTab === 'live' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
          >
            <Activity className="w-4 h-4" />
            <span>IoT Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex flex-col items-center gap-1 px-2 py-1 shrink-0 ${activeTab === 'audit' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            <Database className="w-4 h-4" />
            <span>Transactions</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 px-2 py-1 shrink-0 ${activeTab === 'ai' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Forecast</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

