"use client";

import { AnalyticsSummary, Transaction } from "../lib/types";
import { Fuel, BarChart3, Droplets, Gauge } from "lucide-react";

interface SummaryCardsProps {
  transactions: Transaction[];
  loading?: boolean;
}

export default function SummaryCards({ transactions, loading = false }: SummaryCardsProps) {
  const summary: AnalyticsSummary = transactions.reduce(
    (acc, tx) => {
      acc.totalVolume += tx.total_volume_liters || 0;
      acc.totalTransactions += 1;
      if ((tx.max_flow_rate || 0) > acc.maxFlowRate) {
        acc.maxFlowRate = tx.max_flow_rate;
      }
      return acc;
    },
    { totalVolume: 0, totalTransactions: 0, avgVolume: 0, maxFlowRate: 0 }
  );

  summary.avgVolume = summary.totalTransactions > 0 ? summary.totalVolume / summary.totalTransactions : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 animate-pulse"
          >
            <div className="h-4 w-24 bg-slate-800 rounded mb-3" />
            <div className="h-8 w-32 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Fuel Dispensed",
      value: `${summary.totalVolume.toFixed(1)} L`,
      subtitle: `Across ${summary.totalTransactions} verified fills`,
      icon: Fuel,
      color: "emerald",
      badge: "Cumulative Volume",
    },
    {
      title: "Total Transactions",
      value: summary.totalTransactions.toString(),
      subtitle: "Recent ledger records",
      icon: BarChart3,
      color: "cyan",
      badge: "Completed",
    },
    {
      title: "Average Dispense",
      value: `${summary.avgVolume.toFixed(1)} L`,
      subtitle: "Per vehicle fill-up",
      icon: Droplets,
      color: "amber",
      badge: "Mean Volume",
    },
    {
      title: "Peak Flow Rate",
      value: `${summary.maxFlowRate.toFixed(1)} L/m`,
      subtitle: "Hardware node max speed",
      icon: Gauge,
      color: "purple",
      badge: "Node Peak",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 backdrop-blur-md shadow-xl hover:border-slate-700 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  card.color === "emerald"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : card.color === "cyan"
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                    : card.color === "amber"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                    : "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-black text-slate-100 font-mono tracking-tight">
                {card.value}
              </div>
            </div>

            <p className="mt-1 text-xs text-slate-400 font-medium">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
