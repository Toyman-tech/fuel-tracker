'use client';

import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Check, 
  Trash2, 
  Sliders, 
  Globe, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  Fuel, 
  Sparkles,
  X
} from 'lucide-react';
import { Vehicle, UserPreferences, FuelCategory, FuelGradeKey } from '../types';

interface GarageSettingsProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle;
  setSelectedVehicle: (vehicle: Vehicle) => void;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  onAddVehicle: (newVehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
}

export const GarageSettings: React.FC<GarageSettingsProps> = ({
  vehicles,
  selectedVehicle,
  setSelectedVehicle,
  preferences,
  setPreferences,
  onAddVehicle,
  onDeleteVehicle,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2024);
  const [fuelType, setFuelType] = useState<FuelCategory>('gasoline');
  const [tankCapacity, setTankCapacity] = useState<number>(14.5);
  const [avgMpg, setAvgMpg] = useState<number>(32);
  const [nickname, setNickname] = useState('');

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim() || !model.trim()) return;

    const newVeh: Vehicle = {
      id: `veh-${Date.now()}`,
      make,
      model,
      year: Number(year),
      fuelType,
      tankCapacity: Number(tankCapacity),
      avgMpg: Number(avgMpg),
      currentFuelLevelPercent: 60,
      plateOrNickname: nickname || `${make} ${model}`,
      imageIcon: fuelType === 'ev' ? 'EV' : 'SUV',
      isPrimary: false,
    };

    onAddVehicle(newVeh);
    setShowAddModal(false);
    setMake('');
    setModel('');
    setNickname('');
  };

  return (
    <div className="space-y-6">
      
      {/* Garage Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Car className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Vehicle Garage & App Preferences</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Manage your vehicles, tank sizes, fuel specs, and unit display preferences for personalized route optimization and log tracking.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Vehicle Grid List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Your Vehicles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map(v => {
            const isSelected = selectedVehicle.id === v.id;

            return (
              <div 
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className={`glass-panel-interactive p-5 rounded-2xl border space-y-4 cursor-pointer relative ${
                  isSelected ? 'border-emerald-500 bg-emerald-950/20 fuel-glow-emerald' : 'border-slate-800'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    ACTIVE
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    {v.fuelType === 'ev' ? <Zap className="w-5 h-5 text-sky-400" /> : <Car className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{v.year} {v.make} {v.model}</h4>
                    <p className="text-xs text-slate-400">{v.plateOrNickname}</p>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Tank Capacity:</div>
                    <div className="font-bold text-white">{v.tankCapacity} {v.fuelType === 'ev' ? 'kWh' : preferences.volumeUnit}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Avg Efficiency:</div>
                    <div className="font-bold text-emerald-400">{v.avgMpg} {preferences.efficiencyUnit}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400">Current Fuel: <strong>{v.currentFuelLevelPercent}%</strong></span>
                  
                  {vehicles.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVehicle(v.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Remove vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* App Preferences Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          <span>Regional & Display Preferences</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="text-slate-300 font-semibold block">Currency Symbol</label>
            <div className="flex gap-2">
              {['$', '€', '£'].map(curr => (
                <button
                  key={curr}
                  onClick={() => setPreferences(prev => ({ ...prev, currencySymbol: curr }))}
                  className={`flex-1 py-2 rounded-lg font-bold border transition-all ${
                    preferences.currencySymbol === curr
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="text-slate-300 font-semibold block">Distance & Volume Standard</label>
            <div className="flex gap-2">
              <button
                onClick={() => setPreferences(prev => ({ ...prev, distanceUnit: 'miles', volumeUnit: 'gallons', efficiencyUnit: 'MPG' }))}
                className={`flex-1 py-2 rounded-lg font-semibold border transition-all ${
                  preferences.distanceUnit === 'miles'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Imperial (Miles/Gal)
              </button>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, distanceUnit: 'km', volumeUnit: 'liters', efficiencyUnit: 'L/100km' }))}
                className={`flex-1 py-2 rounded-lg font-semibold border transition-all ${
                  preferences.distanceUnit === 'km'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Metric (Km/L)
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="text-slate-300 font-semibold block">Default Fuel Grade Filter</label>
            <select
              value={preferences.selectedFuelGrade}
              onChange={(e) => setPreferences(prev => ({ ...prev, selectedFuelGrade: e.target.value as FuelGradeKey }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
            >
              <option value="regular">Regular 87</option>
              <option value="midgrade">Midgrade 89</option>
              <option value="premium">Premium 93</option>
              <option value="diesel">Diesel</option>
              <option value="ev_fast">EV DC Fast Charging</option>
            </select>
          </div>

        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl border border-slate-700 p-6 space-y-4 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-white">Add Vehicle to Garage</h3>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Make</label>
                  <input
                    type="text"
                    placeholder="e.g. Honda"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Civic"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Tank Capacity</label>
                  <input
                    type="number"
                    step="0.5"
                    value={tankCapacity}
                    onChange={(e) => setTankCapacity(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Avg MPG</label>
                  <input
                    type="number"
                    step="1"
                    value={avgMpg}
                    onChange={(e) => setAvgMpg(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Fuel Category</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelCategory)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="gasoline">Gasoline / Hybrid</option>
                  <option value="diesel">Diesel</option>
                  <option value="ev">Electric Vehicle (EV)</option>
                  <option value="alternative">Alternative (E85/CNG)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Vehicle Nickname (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Daily Commuter"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
