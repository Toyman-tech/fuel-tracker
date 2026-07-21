"use client";

import { Transaction, parseTimestampToDate } from "../lib/types";
import { Clock, Cpu, Droplets, Gauge, History } from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
  loading?: boolean;
}

export default function TransactionsTable({
  transactions,
  loading = false,
}: TransactionsTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 animate-pulse">
        <div className="h-6 w-40 bg-slate-800 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-slate-800/40 rounded-xl" />
        ))}
      </div>
    );
  }

  const formatDate = (rawTimestamp: unknown) => {
    const date = parseTimestampToDate(rawTimestamp);
    return {
      date: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-md shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Completed Transactions Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Firestore collection `/transactions` (ordered by timestamp desc)
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
          Showing {transactions.length} Records
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <p className="text-sm font-semibold">No transactions recorded in Firestore yet.</p>
          <p className="text-xs text-slate-500 mt-1">
            Complete a fill session with the ESP32 flow meter to append a transaction log.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800/80 font-bold tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-5">
                    Date & Time
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Device Node
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Volume Dispensed
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Max Flow Speed
                  </th>
                  <th scope="col" className="py-3.5 px-5 text-right">
                    Verification
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((tx, idx) => {
                  const { date, time } = formatDate(tx.timestamp);
                  return (
                    <tr
                      key={tx.id || idx}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-semibold text-slate-200">{date}</div>
                            <div className="text-xs text-slate-400 font-mono">{time}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800 w-fit">
                          <Cpu className="h-3.5 w-3.5 text-purple-400" />
                          {tx.device_id || "verifier_node_01"}
                        </div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Droplets className="h-4 w-4 text-emerald-400" />
                          <span className="font-mono font-extrabold text-base text-emerald-400">
                            {tx.total_volume_liters.toFixed(2)} L
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-cyan-400 font-bold">
                          <Gauge className="h-4 w-4 text-cyan-400" />
                          {tx.max_flow_rate.toFixed(1)} L/min
                        </div>
                      </td>
                      <td className="py-4 px-5 whitespace-nowrap text-right">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                          Verified
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="sm:hidden divide-y divide-slate-800/80">
            {transactions.map((tx, idx) => {
              const { date, time } = formatDate(tx.timestamp);
              return (
                <div key={tx.id || idx} className="p-4 space-y-3 hover:bg-slate-800/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="h-3.5 w-3.5" /> {date} at {time}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Volume
                      </span>
                      <div className="text-xl font-mono font-black text-emerald-400">
                        {tx.total_volume_liters.toFixed(2)} L
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Max Flow
                      </span>
                      <div className="text-base font-mono font-bold text-cyan-400">
                        {tx.max_flow_rate.toFixed(1)} L/min
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/40">
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Cpu className="h-3 w-3 text-purple-400" /> {tx.device_id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
