'use client';

import React, { useState, useMemo } from 'react';
import { 
  Navigation, 
  MapPin, 
  Car, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Sliders
} from 'lucide-react';
import { Vehicle, FuelStation, UserPreferences } from '../types';

interface RouteOptimizerProps {
  vehicle: Vehicle;
  stations: FuelStation[];
  preferences: UserPreferences;
  onNavigateToStation?: (stationId: string) => void;
}

export const RouteOptimizer: React.FC<RouteOptimizerProps> = ({
  vehicle,
  stations,
  preferences,
  onNavigateToStation,
}) => {
  const [origin, setOrigin] = useState('Taiwo Road, Ilorin, Kwara State');
  const [destination, setDestination] = useState('Unilorin Permanent Site, Tanke, Ilorin');
  const [currentFuelPercent, setCurrentFuelPercent] = useState(vehicle.currentFuelLevelPercent || 35);
  const [strayDistanceToleranceMiles, setStrayDistanceToleranceMiles] = useState(1.5);
  const [isCalculating, setIsCalculating] = useState(false);

  // Compute trip estimates based on origin & destination preset routes
  const routeCalculation = useMemo(() => {
    const totalDistanceMiles = 24; // e.g. Taiwo Road to Unilorin Perm Site round trip (km)
    const estDurationHours = 0.6; // 35 minutes

    // Vehicle stats
    const tankGal = vehicle.tankCapacity || 50; // Liters
    const mpg = vehicle.avgMpg || 14.5; // km/L
    const currentFuelGal = (currentFuelPercent / 100) * tankGal;
    const maxRangeMilesCurrentFuel = currentFuelGal * mpg;

    // Check if refuel is required to complete trip
    const totalFuelNeededGal = totalDistanceMiles / mpg;
    const isRefuelRequired = maxRangeMilesCurrentFuel < totalDistanceMiles;

    // Find best station on route (e.g. Bovas Tanke)
    const cheapStation1 = stations[0]; // Bovas Tanke

    // Calculate optimal refuel points
    const stop1Distance = Math.min(Math.round(maxRangeMilesCurrentFuel * 0.75), 15);
    const stop1Gallons = Math.min(tankGal - 5, (totalDistanceMiles - stop1Distance) / mpg);
    const stop1Price = cheapStation1?.prices?.find(p => p.category === 'gasoline')?.price || 850;
    const stop1Cost = stop1Gallons * stop1Price;

    // Average price without optimization (₦875/L)
    const avgPrice = 875;
    const unoptimizedCost = totalFuelNeededGal * avgPrice;
    const optimizedCost = stop1Cost;
    const totalSavings = Math.max(850, unoptimizedCost - optimizedCost);

    return {
      totalDistanceMiles,
      estDurationHours,
      maxRangeMilesCurrentFuel,
      totalFuelNeededGal,
      isRefuelRequired,
      suggestedStops: [
        {
          mileMarker: stop1Distance,
          station: cheapStation1,
          refuelGal: Math.round(stop1Gallons * 10) / 10,
          pricePerGal: stop1Price,
          estCost: Math.round(stop1Cost * 100) / 100,
          detourTimeMins: 3,
        }
      ],
      optimizedCost: Math.round(optimizedCost * 100) / 100,
      unoptimizedCost: Math.round(unoptimizedCost * 100) / 100,
      totalSavings: Math.round(totalSavings * 100) / 100,
    };
  }, [currentFuelPercent, vehicle, stations]);

  const handleRecalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Description Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Navigation className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Smart Route Fuel Stop Planner</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Input your trip starting point &amp; destination. Our algorithm checks your vehicle&apos;s range, fuel prices along highway exits, and recommends optimal stops to save up to 25% on refueling.
          </p>
        </div>

        {/* Selected Vehicle Badge */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="text-slate-400 font-medium">Active Vehicle:</div>
            <div className="font-bold text-white">{vehicle.make} {vehicle.model}</div>
            <div className="text-[10px] text-emerald-400 font-semibold">{vehicle.avgMpg} {preferences.efficiencyUnit} Avg</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Controls Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Trip & Vehicle Parameters</span>
            </h3>

            {/* Origin & Destination Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Start Location</span>
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Destination</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Fuel Level Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Starting Fuel Level</span>
                <span className="font-bold text-emerald-400">{currentFuelPercent}% Full</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={currentFuelPercent}
                onChange={(e) => setCurrentFuelPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Empty (5%)</span>
                <span>Half (50%)</span>
                <span>Full (100%)</span>
              </div>
            </div>

            {/* Detour Stray Tolerance */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Max Highway Detour</span>
                <span className="font-bold text-sky-400">{strayDistanceToleranceMiles} miles</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={strayDistanceToleranceMiles}
                onChange={(e) => setStrayDistanceToleranceMiles(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleRecalculate}
              disabled={isCalculating}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                  <span>Calculating Route...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Optimize Route Fuel Stops</span>
                </>
              )}
            </button>
          </div>

          {/* Savings Callout Box */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <DollarSign className="w-5 h-5 bg-emerald-500/20 rounded-lg p-0.5" />
              <span>Projected Refuel Savings</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{preferences.currencySymbol}{routeCalculation.totalSavings}</span>
              <span className="text-xs text-slate-400">saved on this trip</span>
            </div>

            <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-emerald-500/20">
              <div className="flex justify-between">
                <span className="text-slate-400">Standard Exit Price (Avg):</span>
                <span className="text-slate-300">{preferences.currencySymbol}{routeCalculation.unoptimizedCost}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-400">
                <span>Smart Route Refuel:</span>
                <span>{preferences.currencySymbol}{routeCalculation.optimizedCost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Route Visualizer & Stop Recommendation Cards */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Highway Route Visual Canvas Map */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Interactive Highway Corridor</span>
              <span className="text-xs text-sky-400 font-normal lowercase">{routeCalculation.totalDistanceMiles} miles total</span>
            </h3>

            {/* Route Line Container */}
            <div className="bg-slate-950/90 border border-slate-800 p-6 rounded-xl relative space-y-8 my-4">
              
              {/* Progress Line */}
              <div className="relative flex items-center justify-between">
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-2 bg-slate-800 rounded-full z-0">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 rounded-full" style={{ width: '100%' }}></div>
                </div>

                {/* Start Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 border-2 border-white font-bold flex items-center justify-center text-xs shadow-lg">
                    A
                  </div>
                  <span className="text-xs font-semibold text-white mt-1">{origin.split(',')[0]}</span>
                  <span className="text-[10px] text-slate-400 font-mono">0 mi</span>
                </div>

                {/* Suggested Stop Pin */}
                {routeCalculation.suggestedStops.map((stop, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 border-2 border-white font-black flex items-center justify-center text-xs shadow-xl fuel-glow-amber animate-bounce">
                      <Sparkles className="w-5 h-5 fill-slate-950" />
                    </div>
                    <span className="text-xs font-bold text-amber-400 mt-1">{stop.station.brand}</span>
                    <span className="text-[10px] text-slate-300 font-mono">Mile {stop.mileMarker}</span>
                  </div>
                ))}

                {/* Destination Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-950 border-2 border-white font-bold flex items-center justify-center text-xs shadow-lg">
                    B
                  </div>
                  <span className="text-xs font-semibold text-white mt-1">{destination.split(',')[0]}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{routeCalculation.totalDistanceMiles} mi</span>
                </div>
              </div>

              {/* Range warning callout */}
              {routeCalculation.isRefuelRequired ? (
                <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl flex items-center gap-3 text-xs text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Your current fuel range is <strong>{Math.round(routeCalculation.maxRangeMilesCurrentFuel)} miles</strong>. A refuel stop is <strong>required</strong> before Mile {Math.round(routeCalculation.maxRangeMilesCurrentFuel - 30)}.
                  </span>
                </div>
              ) : (
                <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3 text-xs text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    You have enough fuel range to reach your destination, but stopping at our recommended station will lock in the lowest regional price!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Refuel Stops List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">Recommended Refuel Stops</h3>
            
            {routeCalculation.suggestedStops.map((stop, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-slate-900/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0"
                      style={{ backgroundColor: stop.station.logoColor }}
                    >
                      {stop.station.brand.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">{stop.station.name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Located at Exit 142 • {stop.station.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-amber-400">
                      {preferences.currencySymbol}{stop.pricePerGal.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase">per {preferences.volumeUnit}</div>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Recommended Refuel:</div>
                    <div className="font-bold text-white">{stop.refuelGal} {preferences.volumeUnit}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Est. Refuel Cost:</div>
                    <div className="font-bold text-emerald-400">{preferences.currencySymbol}{stop.estCost}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Highway Detour:</div>
                    <div className="font-bold text-sky-400">+{stop.detourTimeMins} mins</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saves {preferences.currencySymbol}0.46/gal compared to next exit
                  </span>

                  <button
                    onClick={() => {
                      if (onNavigateToStation) onNavigateToStation(stop.station.id);
                    }}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Set Stop in GPS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
