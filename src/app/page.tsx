'use client';

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from '../components/Navbar';
import { StationFinder } from '../components/StationFinder';
import { RouteOptimizer } from '../components/RouteOptimizer';
import { FuelLogbook } from '../components/FuelLogbook';
import { AiInsights } from '../components/AiInsights';
import { GarageSettings } from '../components/GarageSettings';
import LiveSessionPortal from '../components/LiveSessionPortal';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useSimulator } from '../context/SimulatorContext';

import { 
  initialPreferences, 
  initialVehicles, 
  mockStations, 
  initialLogs, 
  mockPriceForecast 
} from '../data/mockData';
import { Vehicle, FillUpRecord, UserPreferences, FuelStation } from '../types';
import { 
  subscribeToLogs, 
  saveLogToDb, 
  removeLogFromDb,
  subscribeToStations,
  seedInitialStations,
  saveStationToDb,
  subscribeToVehicles,
  saveVehicleToDb,
  removeVehicleFromDb
} from '../lib/firebase';
import { Fuel, ShieldCheck, CloudCheck } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('finder');
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(initialVehicles[0]);
  const [stations, setStations] = useState<FuelStation[]>(mockStations);
  const [logs, setLogs] = useState<FillUpRecord[]>(initialLogs);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  const {
    session,
    liveLoading,
    setIsSimulatorOpen,
    transactions,
    txLoading,
    usingMock,
  } = useSimulator();

  // Subscribe to Firebase Realtime Database
  useEffect(() => {
    let unsubscribeLogs: (() => void) | undefined;
    let unsubscribeStations: (() => void) | undefined;
    let unsubscribeVehicles: (() => void) | undefined;

    try {
      // 1. Live Logs
      unsubscribeLogs = subscribeToLogs((firebaseLogs) => {
        if (firebaseLogs && firebaseLogs.length > 0) {
          setLogs(firebaseLogs);
        }
        setIsFirebaseConnected(true);
      });

      // 2. Live Stations
      unsubscribeStations = subscribeToStations((firebaseStations) => {
        if (firebaseStations && firebaseStations.length > 0) {
          setStations(prev => {
            const map = new Map<string, FuelStation>();
            // 1. Populate default mock stations
            mockStations.forEach(s => map.set(s.id, s));
            // 2. Preserve current local state
            prev.forEach(s => map.set(s.id, s));
            // 3. Override with live updates from Firebase
            firebaseStations.forEach(s => map.set(s.id, s));
            return Array.from(map.values());
          });
        }
      });

      // 3. Live Vehicles
      unsubscribeVehicles = subscribeToVehicles((firebaseVehicles) => {
        if (firebaseVehicles && firebaseVehicles.length > 0) {
          setVehicles(firebaseVehicles);
          if (!firebaseVehicles.some(v => v.id === selectedVehicle.id)) {
            setSelectedVehicle(firebaseVehicles[0]);
          }
        }
      });
    } catch (e) {
      console.warn("Firebase client subscription fallback:", e);
    }

    return () => {
      if (typeof unsubscribeLogs === 'function') unsubscribeLogs();
      if (typeof unsubscribeStations === 'function') unsubscribeStations();
      if (typeof unsubscribeVehicles === 'function') unsubscribeVehicles();
    };
  }, []);

  // Handlers synced with Firebase
  const handleAddLog = (newLog: FillUpRecord) => {
    setLogs(prev => [newLog, ...prev]);
    saveLogToDb(newLog);
  };

  const handleDeleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
    removeLogFromDb(id);
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles(prev => [...prev, newVehicle]);
    setSelectedVehicle(newVehicle);
    saveVehicleToDb(newVehicle);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(prev => {
      const remaining = prev.filter(v => v.id !== id);
      if (selectedVehicle.id === id && remaining.length > 0) {
        setSelectedVehicle(remaining[0]);
      }
      return remaining;
    });
    removeVehicleFromDb(id);
  };

  const handleUpdateStation = (updatedStation: FuelStation) => {
    setStations(prev => prev.map(s => s.id === updatedStation.id ? updatedStation : s));
    saveStationToDb(updatedStation);
  };

  const handleSelectStationForRoute = (station: FuelStation) => {
    setActiveTab('route');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Header Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        preferences={preferences}
        setPreferences={setPreferences}
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
      />

      {/* Firebase Live Cloud Status Pill */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-200">Firebase Realtime DB & Firestore</span>
            <span className="text-slate-500 hidden sm:inline">• Project ID: <code className="text-emerald-400 font-mono">fuel-tracker-4dac1</code></span>
          </div>
          <div className="text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <CloudCheck className="w-3.5 h-3.5" />
            <span>{isFirebaseConnected ? 'Live Synced' : 'Ready (env keys loaded)'}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 radial-glow space-y-6">
        
        {/* Render Active View Tab */}
        {activeTab === 'finder' && (
          <StationFinder
            stations={stations}
            preferences={preferences}
            onSelectStationForRoute={handleSelectStationForRoute}
            onUpdateStation={handleUpdateStation}
          />
        )}

        {activeTab === 'route' && (
          <RouteOptimizer
            vehicle={selectedVehicle}
            stations={stations}
            preferences={preferences}
            onNavigateToStation={(stationId) => {
              setActiveTab('finder');
            }}
          />
        )}

        {activeTab === 'logbook' && (
          <FuelLogbook
            logs={logs}
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            preferences={preferences}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {activeTab === 'ai' && (
          <AiInsights
            forecast={mockPriceForecast}
            preferences={preferences}
          />
        )}

        {activeTab === 'live' && (
          <LiveSessionPortal
            session={session}
            loading={liveLoading}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
          />
        )}

        {activeTab === 'audit' && (
          <AnalyticsDashboard
            transactions={transactions}
            loading={txLoading}
            usingMock={usingMock}
          />
        )}

        {activeTab === 'garage' && (
          <GarageSettings
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            preferences={preferences}
            setPreferences={setPreferences}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              <Fuel className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Smart Fuel Platform</span>
            <span>— Firebase Cloud Powered</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>© 2026 Smart Fuel Inc.</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Firebase Realtime Sync
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

