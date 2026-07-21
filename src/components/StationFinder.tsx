'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Navigation, 
  Star, 
  Clock, 
  CheckCircle2, 
  Car, 
  Coffee, 
  Utensils, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Layers,
  X,
  PlusCircle,
  DollarSign
} from 'lucide-react';
import { FuelStation, FuelGradeKey, Amenity, UserPreferences } from '../types';

interface StationFinderProps {
  stations: FuelStation[];
  preferences: UserPreferences;
  onSelectStationForRoute?: (station: FuelStation) => void;
}

export const StationFinder: React.FC<StationFinderProps> = ({
  stations,
  preferences,
  onSelectStationForRoute,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<FuelGradeKey>(preferences.selectedFuelGrade || 'regular');
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'rating'>('price');
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [activeStationModal, setActiveStationModal] = useState<FuelStation | null>(null);
  const [hoveredStationId, setHoveredStationId] = useState<string | null>(null);

  // Price Report modal state
  const [reportModalStation, setReportModalStation] = useState<FuelStation | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<string>('');

  const toggleAmenity = (amenity: Amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Filter & Sort stations
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = station.name.toLowerCase().includes(q);
        const matchesBrand = station.brand.toLowerCase().includes(q);
        const matchesAddress = station.address.toLowerCase().includes(q);
        const matchesCity = station.city.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesAddress && !matchesCity) {
          return false;
        }
      }

      // Fuel Grade availability check
      const gradeAvailable = station.prices.some(p => p.key === selectedGrade && p.available);
      if (!gradeAvailable) return false;

      // Amenities check
      if (selectedAmenities.length > 0) {
        const hasAllSelected = selectedAmenities.every(a => station.amenities.includes(a));
        if (!hasAllSelected) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price') {
        const priceA = a.prices.find(p => p.key === selectedGrade)?.price ?? 999;
        const priceB = b.prices.find(p => p.key === selectedGrade)?.price ?? 999;
        return priceA - priceB;
      } else if (sortBy === 'distance') {
        return a.distanceMiles - b.distanceMiles;
      } else {
        return b.rating - a.rating;
      }
    });
  }, [stations, searchQuery, selectedGrade, selectedAmenities, sortBy]);

  const amenityIcons: Record<Amenity, { label: string; icon: React.ReactNode }> = {
    car_wash: { label: 'Car Wash', icon: <Car className="w-3.5 h-3.5 text-sky-400" /> },
    restroom: { label: 'Restroom', icon: <ShieldCheck className="w-3.5 h-3.5 text-slate-300" /> },
    open_247: { label: '24/7 Open', icon: <Clock className="w-3.5 h-3.5 text-emerald-400" /> },
    convenience_store: { label: 'Store', icon: <Layers className="w-3.5 h-3.5 text-amber-400" /> },
    hot_food: { label: 'Hot Food', icon: <Utensils className="w-3.5 h-3.5 text-orange-400" /> },
    atm: { label: 'ATM', icon: <DollarSign className="w-3.5 h-3.5 text-green-400" /> },
    air_water: { label: 'Air & Water', icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" /> },
    coffee: { label: 'Coffee', icon: <Coffee className="w-3.5 h-3.5 text-amber-600" /> },
    ev_charger: { label: 'EV Charger', icon: <Zap className="w-3.5 h-3.5 text-emerald-400" /> },
    loyalty_discount: { label: 'Rewards', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
  };

  const getPriceForGrade = (station: FuelStation, grade: FuelGradeKey) => {
    return station.prices.find(p => p.key === grade);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Header & Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Search Bar & View Mode Toggle */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search station in Ilorin (e.g., Tanke, Challenge, Fate Rd, Asa Dam)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* View Mode Buttons */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'split' ? 'bg-slate-800 text-emerald-400 font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'map' ? 'bg-slate-800 text-emerald-400 font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Map Only
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  viewMode === 'list' ? 'bg-slate-800 text-emerald-400 font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                List Only
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'distance' | 'rating')}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="price" className="bg-slate-900">Lowest Price</option>
                <option value="distance" className="bg-slate-900">Nearest Distance</option>
                <option value="rating" className="bg-slate-900">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fuel Grade Selector Pills */}
        <div>
          <div className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
            <span>Select Fuel Type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'regular', label: 'PMS Petrol' },
              { key: 'premium', label: 'V-Power / Super PMS' },
              { key: 'diesel', label: 'AGO Diesel' },
              { key: 'cng', label: 'CNG Gas 🌿' },
              { key: 'ev_fast', label: 'EV Charger ⚡' },
            ].map(grade => (
              <button
                key={grade.key}
                onClick={() => setSelectedGrade(grade.key as FuelGradeKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedGrade === grade.key
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {grade.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Multi-select filter */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium mb-2">Filter Amenities:</div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(amenityIcons) as Amenity[]).map(key => {
              const amenity = amenityIcons[key];
              const isSelected = selectedAmenities.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleAmenity(key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-sky-950/60 border-sky-500 text-sky-200'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {amenity.icon}
                  <span>{amenity.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area: Map + List */}
      <div className={`grid gap-6 ${
        viewMode === 'split' 
          ? 'grid-cols-1 lg:grid-cols-12' 
          : 'grid-cols-1'
      }`}>
        
        {/* Interactive Visual Map (Simulated Canvas/SVG Map) */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={`glass-panel rounded-2xl border border-slate-800 overflow-hidden relative min-h-[460px] flex flex-col ${
            viewMode === 'split' ? 'lg:col-span-6' : 'w-full'
          }`}>
            {/* Map Top Control Strip */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-semibold text-white">Live Regional Map Radar</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{filteredStations.length} stations found</span>
              </div>
              <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Live Pricing Feed
              </div>
            </div>

            {/* Visual Canvas Map Area */}
            <div className="flex-1 map-grid-bg relative bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
              
              {/* Radial city center glow */}
              <div className="absolute w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none"></div>

              {/* Simulated Map Roads (SVG background roads) */}
              <svg className="absolute inset-0 w-full h-full stroke-slate-800/60 stroke-[2] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 100 Q 200 150 500 120 T 1000 200" fill="none" strokeWidth="4" className="stroke-slate-800" />
                <path d="M 150 0 Q 180 300 220 600" fill="none" strokeWidth="4" className="stroke-slate-800" />
                <path d="M 400 0 Q 380 250 450 500" fill="none" strokeWidth="3" className="stroke-slate-800/80" />
                <path d="M 0 350 H 1000" fill="none" strokeWidth="3" strokeDasharray="6 6" className="stroke-slate-700/40" />
              </svg>

              {/* User Current Location Indicator Marker */}
              <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 group">
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-sky-500/30 animate-ping absolute"></div>
                  <div className="w-6 h-6 rounded-full bg-sky-500 border-2 border-white shadow-lg flex items-center justify-center text-slate-950 font-bold text-[10px]">
                    YOU
                  </div>
                </div>
                <div className="bg-slate-900/90 text-sky-400 border border-sky-500/30 text-[10px] font-medium px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                  Current Location
                </div>
              </div>

              {/* Render Stations on Map */}
              {filteredStations.map((station, index) => {
                const priceObj = getPriceForGrade(station, selectedGrade);
                const isHovered = hoveredStationId === station.id;
                
                // Calculate position offsets based on station lat/lng mock layout
                const positions = [
                  { left: '22%', top: '28%' },
                  { left: '48%', top: '35%' },
                  { left: '68%', top: '22%' },
                  { left: '78%', top: '65%' },
                  { left: '38%', top: '72%' },
                  { left: '60%', top: '80%' },
                ];
                const pos = positions[index % positions.length];

                return (
                  <div
                    key={station.id}
                    style={{ left: pos.left, top: pos.top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-30 cursor-pointer ${
                      isHovered ? 'scale-110 z-40' : 'hover:scale-105'
                    }`}
                    onMouseEnter={() => setHoveredStationId(station.id)}
                    onMouseLeave={() => setHoveredStationId(null)}
                    onClick={() => setActiveStationModal(station)}
                  >
                    <div className="flex flex-col items-center">
                      {/* Price Badge Pin */}
                      <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold shadow-xl flex items-center gap-1.5 transition-all ${
                        station.isTopDeal 
                          ? 'bg-emerald-500 text-slate-950 border-emerald-300 fuel-glow-emerald' 
                          : isHovered 
                          ? 'bg-slate-800 text-white border-sky-400' 
                          : 'bg-slate-900/95 text-slate-200 border-slate-700'
                      }`}>
                        {station.isTopDeal && <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />}
                        <span>{preferences.currencySymbol}{priceObj ? priceObj.price.toFixed(2) : 'N/A'}</span>
                      </div>

                      {/* Station Logo Point */}
                      <div className="w-4 h-4 rounded-full border-2 border-white shadow-md mt-0.5 flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ backgroundColor: station.logoColor }}
                      >
                        ●
                      </div>

                      {/* Station Label on Hover */}
                      {(isHovered || station.isTopDeal) && (
                        <div className="mt-1 bg-slate-950/90 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-200 font-medium whitespace-nowrap shadow-lg">
                          {station.name} ({station.distanceMiles} mi)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Map Legend */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-[11px] text-slate-300 space-y-1 z-10 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Cheapest Top Deal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
                  <span>Your Position</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Station List View */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`space-y-4 ${
            viewMode === 'split' ? 'lg:col-span-6' : 'w-full'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Showing <strong>{filteredStations.length}</strong> matching fuel locations</span>
              <span>Sorted by {sortBy}</span>
            </div>

            {filteredStations.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
                <MapPin className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-white">No stations found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try broadening your search term or unchecking some amenity filters.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedAmenities([]); }}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredStations.map(station => {
                const targetPrice = getPriceForGrade(station, selectedGrade);
                const isHovered = hoveredStationId === station.id;

                return (
                  <div
                    key={station.id}
                    onMouseEnter={() => setHoveredStationId(station.id)}
                    onMouseLeave={() => setHoveredStationId(null)}
                    className={`glass-panel-interactive p-5 rounded-2xl space-y-4 relative ${
                      station.isTopDeal ? 'border-emerald-500/40 bg-emerald-950/10' : ''
                    } ${isHovered ? 'border-sky-400/50' : ''}`}
                  >
                    {/* Top Deal Badge */}
                    {station.isTopDeal && (
                      <div className="absolute -top-3 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-slate-950" />
                        Best Value in Radius
                      </div>
                    )}

                    {/* Main Station Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {/* Brand Logo Avatar */}
                        <div 
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0"
                          style={{ backgroundColor: station.logoColor }}
                        >
                          {station.brand.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-white hover:text-emerald-400 transition-colors flex items-center gap-2">
                            {station.name}
                          </h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{station.address}, {station.city}</span>
                            <span>•</span>
                            <strong className="text-sky-400 font-semibold">{station.distanceMiles} mi away</strong>
                          </p>
                        </div>
                      </div>

                      {/* Featured Grade Price Display */}
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-black text-white tracking-tight">
                          {preferences.currencySymbol}{targetPrice ? targetPrice.price.toFixed(2) : 'N/A'}
                        </div>
                        <div className="text-[10px] uppercase font-semibold text-slate-400">
                          {targetPrice?.name || selectedGrade} / {targetPrice?.unit || preferences.volumeUnit}
                        </div>
                      </div>
                    </div>

                    {/* All Fuel Grades Price Grid Pills */}
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {station.prices.map(p => (
                        <div key={p.key} className={`p-1.5 rounded-lg border flex flex-col justify-between ${
                          p.key === selectedGrade 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                            : 'bg-slate-900/60 border-slate-800/60 text-slate-400'
                        }`}>
                          <span className="text-[10px] text-slate-400 font-medium">{p.name}</span>
                          <span className="font-bold text-white mt-0.5">
                            {preferences.currencySymbol}{p.price.toFixed(2)} <span className="text-[9px] text-slate-400">/{p.unit}</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Amenities Icons Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{station.rating}</span>
                          <span className="text-slate-500">({station.reviewCount})</span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Verified {station.verifiedAt}</span>
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setReportModalStation(station)}
                          className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-slate-300 text-xs font-medium transition-all flex items-center gap-1"
                          title="Report price update"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Report Price</span>
                        </button>

                        <button
                          onClick={() => setActiveStationModal(station)}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Station Detail Drawer / Modal */}
      {activeStationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-xl w-full rounded-2xl border border-slate-700 overflow-hidden shadow-2xl space-y-5 p-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveStationModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-white text-lg shadow-xl shrink-0"
                style={{ backgroundColor: activeStationModal.logoColor }}
              >
                {activeStationModal.brand.slice(0, 3).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{activeStationModal.name}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeStationModal.address}, {activeStationModal.city}, {activeStationModal.state} {activeStationModal.zipCode}</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {activeStationModal.rating} ({activeStationModal.reviewCount} reviews)
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-sky-400 font-medium">{activeStationModal.distanceMiles} miles from current location</span>
                </div>
              </div>
            </div>

            {/* Complete Pricing List */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Fuel Prices</h4>
              <div className="grid grid-cols-2 gap-2">
                {activeStationModal.prices.map(p => (
                  <div key={p.key} className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{p.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-400">{preferences.currencySymbol}{p.price.toFixed(2)}</div>
                      <div className="text-[9px] text-slate-400">per {p.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Station Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {activeStationModal.amenities.map(a => {
                  const am = amenityIcons[a];
                  return (
                    <div key={a} className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-2">
                      {am ? am.icon : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{am ? am.label : a}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            {activeStationModal.reviews && activeStationModal.reviews.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Driver Reviews</h4>
                <div className="space-y-2">
                  {activeStationModal.reviews.map(rev => (
                    <div key={rev.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-white">{rev.user}</span>
                        <span className="text-slate-500 text-[10px]">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-[10px]">
                        {'★'.repeat(rev.rating)}
                      </div>
                      <p className="text-slate-400 italic font-normal">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <a
                href={`https://maps.google.com/?q=${activeStationModal.lat},${activeStationModal.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Navigation className="w-4 h-4" />
                <span>Start Navigation</span>
              </a>

              {onSelectStationForRoute && (
                <button
                  onClick={() => {
                    onSelectStationForRoute(activeStationModal);
                    setActiveStationModal(null);
                  }}
                  className="px-4 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold rounded-xl text-sm transition-all"
                >
                  Add to Route Trip
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Price Modal */}
      {reportModalStation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl border border-slate-700 p-6 space-y-4 relative">
            <button
              onClick={() => setReportModalStation(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-white">Report Updated Price</h3>
            </div>
            <p className="text-xs text-slate-400">
              Help community drivers by updating the price for <strong className="text-white">{reportModalStation.name}</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Fuel Grade</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none">
                  {reportModalStation.prices.map(p => (
                    <option key={p.key} value={p.key}>{p.name} (Current: ${p.price.toFixed(2)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">New Price ({preferences.currencySymbol} / {preferences.volumeUnit})</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 3.15"
                  value={newPriceInput}
                  onChange={(e) => setNewPriceInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReportModalStation(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Thank you! Updated price of ${preferences.currencySymbol}${newPriceInput} submitted to verification network.`);
                  setReportModalStation(null);
                  setNewPriceInput('');
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all"
              >
                Submit Price Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
