'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Plus, 
  Trash2, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Fuel, 
  Car, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  X,
  Gauge
} from 'lucide-react';
import { FillUpRecord, Vehicle, UserPreferences, FuelGradeKey } from '../types';

interface FuelLogbookProps {
  logs: FillUpRecord[];
  vehicles: Vehicle[];
  selectedVehicle: Vehicle;
  preferences: UserPreferences;
  onAddLog: (newLog: FillUpRecord) => void;
  onDeleteLog: (id: string) => void;
}

export const FuelLogbook: React.FC<FuelLogbookProps> = ({
  logs,
  vehicles,
  selectedVehicle,
  preferences,
  onAddLog,
  onDeleteLog,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicleIdFilter, setSelectedVehicleIdFilter] = useState<string>('all');

  // New Log Form State
  const [formVehicleId, setFormVehicleId] = useState(selectedVehicle.id);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formOdometer, setFormOdometer] = useState<string>('');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formPricePerUnit, setFormPricePerUnit] = useState<string>('');
  const [formTotalCost, setFormTotalCost] = useState<string>('');
  const [formStationName, setFormStationName] = useState('Bovas & Company Station (Tanke)');
  const [formFuelGrade, setFormFuelGrade] = useState<FuelGradeKey>('regular');
  const [formIsFullTank, setFormIsFullTank] = useState(true);
  const [formNotes, setFormNotes] = useState('');

  // Auto calculate total cost when price or amount changes
  const handleAmountChange = (val: string) => {
    setFormAmount(val);
    const numAmt = parseFloat(val);
    const numPrice = parseFloat(formPricePerUnit);
    if (!isNaN(numAmt) && !isNaN(numPrice)) {
      setFormTotalCost((numAmt * numPrice).toFixed(2));
    }
  };

  const handlePriceChange = (val: string) => {
    setFormPricePerUnit(val);
    const numPrice = parseFloat(val);
    const numAmt = parseFloat(formAmount);
    if (!isNaN(numAmt) && !isNaN(numPrice)) {
      setFormTotalCost((numAmt * numPrice).toFixed(2));
    }
  };

  const handleTotalCostChange = (val: string) => {
    setFormTotalCost(val);
    const numTotal = parseFloat(val);
    const numAmt = parseFloat(formAmount);
    if (!isNaN(numTotal) && !isNaN(numAmt) && numAmt > 0) {
      setFormPricePerUnit((numTotal / numAmt).toFixed(3));
    }
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    if (selectedVehicleIdFilter === 'all') return logs;
    return logs.filter(l => l.vehicleId === selectedVehicleIdFilter);
  }, [logs, selectedVehicleIdFilter]);

  // Calculated Aggregate Stats
  const stats = useMemo(() => {
    let totalSpend = 0;
    let totalUnits = 0;
    let validMpgCount = 0;
    let sumMpg = 0;

    filteredLogs.forEach(l => {
      totalSpend += l.totalCost;
      totalUnits += l.fuelAmount;
      if (l.calculatedMpg && l.calculatedMpg > 0) {
        sumMpg += l.calculatedMpg;
        validMpgCount++;
      }
    });

    const avgMpg = validMpgCount > 0 ? sumMpg / validMpgCount : selectedVehicle.avgMpg;
    const avgPricePerUnit = totalUnits > 0 ? totalSpend / totalUnits : 850;

    return {
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalUnits: Math.round(totalUnits * 10) / 10,
      avgMpg: Math.round(avgMpg * 10) / 10,
      avgPricePerUnit: Math.round(avgPricePerUnit * 100) / 100,
      costPerMile: Math.round((avgPricePerUnit / (avgMpg || 30)) * 1000) / 1000,
    };
  }, [filteredLogs, selectedVehicle]);

  const handleSubmitNewLog = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    const price = parseFloat(formPricePerUnit);
    const odo = parseFloat(formOdometer) || 15000;
    const total = parseFloat(formTotalCost) || amt * price;

    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid fuel amount.');
      return;
    }

    // Estimate MPG based on recent log
    const prevLog = logs.find(l => l.vehicleId === formVehicleId);
    let calculatedMpg = selectedVehicle.avgMpg;
    if (prevLog && prevLog.odometer < odo && amt > 0) {
      calculatedMpg = Math.round(((odo - prevLog.odometer) / amt) * 10) / 10;
    }

    const matchedVeh = vehicles.find(v => v.id === formVehicleId);

    const record: FillUpRecord = {
      id: `log-${Date.now()}`,
      vehicleId: formVehicleId,
      date: formDate,
      odometer: odo,
      fuelAmount: amt,
      pricePerUnit: price,
      totalCost: total,
      stationName: formStationName,
      stationBrand: formStationName.split(' ')[0],
      fuelGrade: formFuelGrade,
      calculatedMpg,
      isFullTank: formIsFullTank,
      notes: formNotes,
    };

    onAddLog(record);
    setShowAddModal(false);
    // Reset form
    setFormAmount('');
    setFormPricePerUnit('');
    setFormTotalCost('');
    setFormOdometer('');
    setFormNotes('');
  };

  const exportCSV = () => {
    const headers = ['ID', 'Vehicle ID', 'Date', 'Odometer', 'Fuel Amount', 'Price/Unit', 'Total Cost', 'Station', 'MPG'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.vehicleId,
      l.date,
      l.odometer,
      l.fuelAmount,
      l.pricePerUnit,
      l.totalCost,
      `"${l.stationName}"`,
      l.calculatedMpg || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_fuel_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Fuel Logbook & Efficiency Tracker</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Track fill-ups, monitor real-world fuel economy (MPG), and analyze monthly spending patterns across all your garage vehicles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log New Fill-Up</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Fuel Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {preferences.currencySymbol}{stats.totalSpend.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Across {filteredLogs.length} logged fill-ups</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Average MPG</span>
            <Gauge className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats.avgMpg} <span className="text-xs font-normal text-slate-400">{preferences.efficiencyUnit}</span>
          </div>
          <div className="text-[10px] text-sky-400 font-medium">
            Optimal efficiency target
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Pumped</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats.totalUnits} <span className="text-xs font-normal text-slate-400">{preferences.volumeUnit}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Avg {preferences.currencySymbol}{stats.avgPricePerUnit.toFixed(2)}/{preferences.volumeUnit}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Cost per Mile</span>
            <Car className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {preferences.currencySymbol}{stats.costPerMile.toFixed(2)}
          </div>
          <div className="text-[10px] text-purple-400 font-medium">
            Direct operational cost
          </div>
        </div>

      </div>

      {/* Visual Analytics Chart & Log List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Line Trend Chart (Simulated SVG Chart) */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Fuel Price Trend vs MPG History</span>
            </h3>
            <span className="text-[10px] text-slate-400">Past 30 Days</span>
          </div>

          <div className="h-56 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 relative flex flex-col justify-between overflow-hidden">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-b border-slate-700 w-full"></div>
              <div className="border-b border-slate-700 w-full"></div>
              <div className="border-b border-slate-700 w-full"></div>
              <div className="border-b border-slate-700 w-full"></div>
            </div>

            {/* Simulated Chart Paths */}
            <svg className="absolute inset-0 w-full h-full p-6 overflow-visible pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Green MPG Trend Line */}
              <path
                d="M 30 110 Q 120 70 200 95 T 380 50"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                className="drop-shadow-lg"
              />
              {/* Amber Price/Gal Line */}
              <path
                d="M 30 60 Q 120 90 200 70 T 380 120"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              {/* Data points */}
              <circle cx="30" cy="110" r="4" fill="#10b981" />
              <circle cx="120" cy="70" r="4" fill="#10b981" />
              <circle cx="200" cy="95" r="4" fill="#10b981" />
              <circle cx="380" cy="50" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
            </svg>

            {/* Chart Legend */}
            <div className="mt-auto flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  Fuel Economy (MPG)
                </span>
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  Price per Gal ({preferences.currencySymbol})
                </span>
              </div>
              <span className="text-slate-500 font-mono">Jul 01 - Jul 21</span>
            </div>
          </div>
        </div>

        {/* Recent Fill-Ups Table List */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Logged Fill-Up History</h3>
            
            {/* Filter by vehicle dropdown */}
            <select
              value={selectedVehicleIdFilter}
              onChange={(e) => setSelectedVehicleIdFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-white px-2.5 py-1 rounded-xl focus:outline-none"
            >
              <option value="all">All Vehicles</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.make} {v.model}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No logs recorded yet. Click &quot;Log New Fill-Up&quot; to start tracking!
              </div>
            ) : (
              filteredLogs.map(log => {
                const veh = vehicles.find(v => v.id === log.vehicleId);

                return (
                  <div 
                    key={log.id} 
                    className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        <Fuel className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{log.stationName}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                          <span>{log.date}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-medium">{veh?.make} {veh?.model}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{log.calculatedMpg} MPG</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-black text-white text-sm">{preferences.currencySymbol}{log.totalCost.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-400">
                          {log.fuelAmount} {preferences.volumeUnit} @ {preferences.currencySymbol}{log.pricePerUnit.toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Add New Log Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl border border-slate-700 p-6 space-y-4 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-white">Record Fuel Fill-Up</h3>
            </div>

            <form onSubmit={handleSubmitNewLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Select Vehicle</label>
                  <select
                    value={formVehicleId}
                    onChange={(e) => setFormVehicleId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.make} {v.model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Fill-Up Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Odometer (mi)</label>
                  <input
                    type="number"
                    placeholder="e.g. 14800"
                    value={formOdometer}
                    onChange={(e) => setFormOdometer(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Amount ({preferences.volumeUnit})</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 11.5"
                    value={formAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Price/{preferences.volumeUnit}</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.29"
                    value={formPricePerUnit}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Total Cost ({preferences.currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 37.83"
                    value={formTotalCost}
                    onChange={(e) => handleTotalCostChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Station Name</label>
                  <input
                    type="text"
                    value={formStationName}
                    onChange={(e) => setFormStationName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Notes / Trip context (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Highway commute with heavy traffic"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
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
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
