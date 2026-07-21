"use client";

import { useEffect, useState } from "react";
import { LiveSession } from "../lib/types";
import { Activity, Gauge, Fuel, CheckCircle2, ShieldCheck, Zap, AlertCircle } from "lucide-react";

interface LiveSessionPortalProps {
  session: LiveSession;
  loading?: boolean;
  onOpenSimulator?: () => void;
}

export default function LiveSessionPortal({
  session,
  loading = false,
  onOpenSimulator,
}: LiveSessionPortalProps) {
  // Animated value for smooth numerical counter transitions
  const displayVolume = session.current_volume;

  // Estimated PMS fuel cost calculation (e.g. ₦850 / Liter in Ilorin)
  const unitPrice = 850;
  const estimatedCost = (session.current_volume * unitPrice);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-30" />
          <div className="relative h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">
          Connecting to IoT Hardware Node...
        </p>
      </div>
    );
  }

  const isActive = session.is_active;

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-100px)] max-w-4xl mx-auto px-4 py-4 md:py-8">
      {/* Top Node Status Header */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3.5 sm:p-4 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold transition-all ${
              isActive
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-400 border border-slate-700/50"
            }`}
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pump Verification System
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: ilorin_verifier_node_01</span>
            </div>
            <p className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              {isActive ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Hardware Dispensing Fuel (PMS Petrol)
                </span>
              ) : (
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Standby / Ready
                </span>
              )}
            </p>
          </div>
        </div>

        {/* High contrast state indicator badge */}
        <div
          className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider ${
            isActive
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 border border-emerald-400"
              : "bg-slate-800/90 text-slate-300 border border-slate-700"
          }`}
        >
          <Zap className={`h-3.5 w-3.5 ${isActive ? "fill-current" : "text-slate-400"}`} />
          <span>{isActive ? "ACTIVE FILL" : "IDLE"}</span>
        </div>
      </div>

      {/* Main Dispenser Body Container */}
      <div className="flex-1 flex flex-col justify-center my-6">
        {!isActive ? (
          /* STATE 1: IDLE STATE */
          <div className="flex flex-col items-center justify-center text-center p-6 md:p-12 rounded-3xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />

            <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl text-slate-400 group-hover:scale-105 transition-transform duration-300">
              <Fuel className="h-12 w-12 text-emerald-500/70" />
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 max-w-md">
              Waiting for next fill-up...
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed">
              Place nozzle and begin dispensing at the pump. The ESP32 flow meter will automatically detect PMS fuel delivery in real-time.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-4 py-2 border border-slate-800 text-xs font-semibold text-slate-300">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>Flow Meter: <strong className="text-slate-100">Calibrated</strong></span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-4 py-2 border border-slate-800 text-xs font-semibold text-slate-300">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>Anti-Fraud Ledger: <strong className="text-slate-100">Live</strong></span>
              </div>
            </div>

            {/* Helper launcher for test driving */}
            {onOpenSimulator && (
              <button
                onClick={onOpenSimulator}
                className="mt-8 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 flex items-center gap-1.5 transition-colors"
              >
                <span>Simulate pump action for testing</span> &rarr;
              </button>
            )}
          </div>
        ) : (
          /* STATE 2: ACTIVE DISPENSING STATE (HIGH-CONTRAST MOBILE FIRST) */
          <div className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl border-2 border-emerald-500/50 bg-slate-950/90 backdrop-blur-2xl shadow-2xl relative overflow-hidden fuel-glow-emerald">
            {/* Animated fluid background wave */}
            <div className="absolute inset-0 opacity-10 animated-fluid-gradient pointer-events-none" />

            {/* Dispensing Header Tag */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 shadow-sm animate-pulse-glow">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Dispensing Petrol in Real-Time</span>
            </div>

            {/* MASSIVE DIGITAL VOLUME COUNTER (SUNLIGHT-READABLE) */}
            <div className="my-4 text-center">
              <div className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-emerald-400 font-mono sunlight-contrast leading-none select-none">
                {displayVolume.toFixed(2)}
              </div>
              <div className="mt-2 text-xl sm:text-2xl font-black uppercase tracking-widest text-slate-300 font-sans">
                Liters Dispensed
              </div>
            </div>

            {/* SECONDARY METRIC: FLOW RATE */}
            <div className="mt-4 w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Current Flow Speed
                    </span>
                    <p className="text-xs text-slate-500">Real-time ESP32 calculation</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                    {session.flow_rate.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-slate-400 ml-1">L/min</span>
                </div>
              </div>

              {/* Estimated Cost calculation */}
              <div className="flex items-center justify-between text-xs font-medium pt-1">
                <span className="text-slate-400">Estimated Total:</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  ₦{estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-slate-500 font-normal">(@ ₦{unitPrice}/L)</span>
                </span>
              </div>
            </div>

            {/* Dynamic flow progress pulse bar */}
            <div className="mt-6 w-full max-w-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
                <span className="flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-emerald-400 animate-spin" /> Flow Sensor Active
                </span>
                <span className="text-emerald-400 font-semibold">Edge Hardware Stream</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800 p-0.5">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer System Disclaimer */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/80" />
          <span>Passive Observer Interface &bull; Real-time cryptographic fuel verification</span>
        </p>
      </div>
    </div>
  );
}
