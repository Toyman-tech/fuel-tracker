"use client";

import { Transaction } from "../lib/types";
import SummaryCards from "./SummaryCards";
import VolumeTrendChart from "./VolumeTrendChart";
import TransactionsTable from "./TransactionsTable";
import { Database, Info } from "lucide-react";

interface AnalyticsDashboardProps {
  transactions: Transaction[];
  loading?: boolean;
  usingMock?: boolean;
}

export default function AnalyticsDashboard({
  transactions,
  loading = false,
  usingMock = false,
}: AnalyticsDashboardProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              Analytics & Audit Ledger
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-500/20">
              <Database className="h-3 w-3" /> Firestore
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Historical transaction ledger ordered by timestamp descending (limit 20).
          </p>
        </div>

        {usingMock && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300">
            <Info className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Showing sample dataset (Firebase credentials pending configuration)</span>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <SummaryCards transactions={transactions} loading={loading} />

      {/* Recharts Usage Trend Chart */}
      <VolumeTrendChart transactions={transactions} loading={loading} />

      {/* Transaction Ledger Table */}
      <TransactionsTable transactions={transactions} loading={loading} />
    </div>
  );
}
