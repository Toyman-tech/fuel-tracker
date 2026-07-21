"use client";

import { useState, useEffect } from "react";
import { Play, Square, RotateCcw, Cpu, Radio, ShieldCheck, X } from "lucide-react";
import { LiveSession, Transaction } from "../lib/types";

interface HardwareSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  session: LiveSession;
  onUpdateSession: (newSession: LiveSession) => void;
  onAddTransaction?: (tx: Transaction) => void;
}

export default function HardwareSimulator({
  isOpen,
  onClose,
  session,
  onUpdateSession,
  onAddTransaction,
}: HardwareSimulatorProps) {
  const [maxFlowSeen, setMaxFlowSeen] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Auto-increment volume ONLY when manual simulation mode is actively running in modal
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOpen && isSimulating && session.is_active) {
      interval = setInterval(() => {
        onUpdateSession({
          is_active: true,
          // Generate realistic flow rate fluctuations around 30 - 36 L/min
          flow_rate: Number((31.5 + Math.random() * 4.5).toFixed(1)),
          current_volume: Number((session.current_volume + 0.35).toFixed(2)),
        });

        if (session.flow_rate > maxFlowSeen) {
          setMaxFlowSeen(session.flow_rate);
        }
      }, 300);
    }

    return () => clearInterval(interval);
  }, [isOpen, isSimulating, session, onUpdateSession, maxFlowSeen]);

  if (!isOpen) return null;

  const handleStartSim = () => {
    setMaxFlowSeen(32.5);
    setIsSimulating(true);
    onUpdateSession({
      is_active: true,
      flow_rate: 32.5,
      current_volume: session.current_volume > 0 ? session.current_volume : 0.1,
    });
  };

  const handleStopSim = () => {
    setIsSimulating(false);
    const finalVolume = Number(session.current_volume.toFixed(2));
    const finalMaxFlow = Number((maxFlowSeen || session.flow_rate || 32.5).toFixed(1));

    // Stop active flow
    onUpdateSession({
      is_active: false,
      flow_rate: 0,
      current_volume: finalVolume,
    });

    // Post to transactions log if volume dispensed
    if (finalVolume > 0 && onAddTransaction) {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        device_id: "ilorin_verifier_node_01",
        total_volume_liters: finalVolume,
        max_flow_rate: finalMaxFlow,
        timestamp: new Date().toISOString(),
      };
      onAddTransaction(newTx);
    }
  };

  const handleResetSim = () => {
    setIsSimulating(false);
    onUpdateSession({
      is_active: false,
      flow_rate: 0,
      current_volume: 0.0,
    });
    setMaxFlowSeen(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                ESP32 Hardware Simulator
              </h3>
              <p className="text-xs text-slate-400">Verifier Node: <code className="text-purple-300">verifier_node_01</code></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="mb-5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-300 flex items-start gap-2.5">
          <Radio className="h-4 w-4 shrink-0 mt-0.5 text-blue-400 animate-pulse" />
          <div>
            <span className="font-semibold text-blue-200">Testing Tool Notice:</span> In production, ESP32 edge hardware dictates RTDB state updates automatically. Use this control panel to simulate live dispensing and test UI reactions.
          </div>
        </div>

        {/* Live Metrics Preview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-xs font-medium text-slate-400">State</span>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  session.is_active ? "bg-emerald-400 animate-ping" : "bg-slate-500"
                }`}
              />
              <span
                className={`text-sm font-bold uppercase ${
                  session.is_active ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {session.is_active ? "Dispensing" : "Idle"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-xs font-medium text-slate-400">Current Liters</span>
            <p className="mt-1 text-lg font-extrabold text-emerald-400 font-mono">
              {session.current_volume.toFixed(2)} L
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          {!session.is_active ? (
            <button
              onClick={handleStartSim}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <Play className="h-5 w-5 fill-current" />
              Simulate Dispensing Start (ESP32 On)
            </button>
          ) : (
            <button
              onClick={handleStopSim}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <Square className="h-5 w-5 fill-current" />
              Simulate Stop & Log to Ledger
            </button>
          )}

          <button
            onClick={handleResetSim}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Volume Counter to 0.00 L
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Tamper-Proof Hardware Pipeline
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
