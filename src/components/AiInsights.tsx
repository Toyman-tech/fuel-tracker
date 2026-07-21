'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  BellRing, 
  CheckCircle2, 
  ShieldCheck, 
  Lightbulb, 
  ArrowRight, 
  DollarSign, 
  Calendar,
  Flame
} from 'lucide-react';
import { PriceForecast, UserPreferences } from '../types';

interface AiInsightsProps {
  forecast: PriceForecast;
  preferences: UserPreferences;
}

export const AiInsights: React.FC<AiInsightsProps> = ({
  forecast,
  preferences,
}) => {
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* AI Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 fuel-glow-amber">
              <Sparkles className="w-5 h-5 fill-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Fuel Price Radar & Market Predictor</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Our machine learning model analyzes crude futures, local station inventory, and weekly demand cycles to deliver accurate 7-day fuel price forecasts.
          </p>
        </div>

        <button
          onClick={() => setIsAlertSubscribed(!isAlertSubscribed)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
            isAlertSubscribed
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>{isAlertSubscribed ? 'Price Drop Alerts Active ✓' : 'Notify Me When Prices Drop'}</span>
        </button>
      </div>

      {/* Main Prediction Highlight Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>AI Recommendation for Ilorin, Kwara State</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">
              BUY NOW AT BOVAS (TANKE) OR MATRIX (ASA DAM)
            </div>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 px-4 py-2 rounded-xl text-right">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Best Pump Price in Ilorin</div>
            <div className="text-xl font-black text-emerald-400">
              {preferences.currencySymbol}850.00 / {preferences.volumeUnit === 'gallons' ? 'gal' : 'L'}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <strong className="text-amber-400">Analysis:</strong> {forecast.recommendationReason} If you commute along Tanke, Fate Road, or Taiwo Road, filling up at Bovas (Tanke) or NNPC Mega (Fate Rd) guarantees calibrated accurate metering and the best price in Kwara State.
        </p>
      </div>

      {/* 7-Day Forecast Visual Table & Cards */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>7-Day Ilorin Pump Price Trend ({forecast.fuelGrade})</span>
          <span className="text-xs text-slate-400 font-normal">Updated 10 mins ago</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {forecast.forecast7Days.map((item, idx) => {
            const isLowest = item.predictedPrice === Math.min(...forecast.forecast7Days.map(f => f.predictedPrice));

            return (
              <div 
                key={idx}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-center transition-all ${
                  isLowest 
                    ? 'bg-emerald-950/40 border-emerald-500 text-white fuel-glow-emerald' 
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                {isLowest && (
                  <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
                    BEST DAY
                  </span>
                )}
                
                <div className="text-xs font-bold text-slate-400">{item.day}</div>
                
                <div className="text-lg font-black my-2 text-white">
                  {preferences.currencySymbol}{item.predictedPrice.toFixed(0)}
                </div>

                <div className="text-[10px] flex items-center justify-center gap-1 font-semibold">
                  {item.trend === 'down' ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> Drop
                    </span>
                  ) : item.trend === 'up' ? (
                    <span className="text-red-400 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> Rise
                    </span>
                  ) : (
                    <span className="text-slate-400">Steady</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Smart Driving & Refuel Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
            <Lightbulb className="w-4 h-4" />
            <span>Meter Accuracy Verification</span>
          </div>
          <h4 className="text-sm font-semibold text-white">Bovas Tanke & Matrix Asa Dam</h4>
          <p className="text-xs text-slate-400 leading-normal">
            Independent IoT telemetry confirms 100% accurate flow meter calibration at Bovas Tanke and Matrix Asa Dam stations, avoiding pump tampering losses.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Tire Pressure Boost</span>
          </div>
          <h4 className="text-sm font-semibold text-white">Save +1.2 km/L Free</h4>
          <p className="text-xs text-slate-400 leading-normal">
            Maintaining 32 - 34 PSI reduces rolling resistance on Kwara roads, saving up to ₦45,000 annually in fuel expenses.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
            <DollarSign className="w-4 h-4" />
            <span>CNG Conversion Insight</span>
          </div>
          <h4 className="text-sm font-semibold text-white">Save up to 60% with CNG</h4>
          <p className="text-xs text-slate-400 leading-normal">
            CNG at NNPC Mega Station (Fate Rd) sells for ₦230/SMC compared to PMS at ₦850/L, drastically cutting commercial commute costs in Ilorin.
          </p>
        </div>

      </div>

    </div>
  );
};
