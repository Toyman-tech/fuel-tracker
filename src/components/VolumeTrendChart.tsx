"use client";

import { useEffect, useState } from "react";
import { Transaction, parseTimestampToDate } from "../lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface VolumeTrendChartProps {
  transactions: Transaction[];
  loading?: boolean;
}

export default function VolumeTrendChart({
  transactions,
  loading = false,
}: VolumeTrendChartProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !mounted) {
    return (
      <div className="h-72 w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-center items-center animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded mb-4" />
        <div className="h-40 w-full bg-slate-800/50 rounded-xl" />
      </div>
    );
  }

  // Reverse transactions array so chronological order goes left to right
  const chartData = [...transactions]
    .reverse()
    .map((tx) => {
      const date = parseTimestampToDate(tx.timestamp);
      const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const formattedDate = date.toLocaleDateString([], { month: "short", day: "numeric" });

      return {
        timestamp: `${formattedDate} ${formattedTime}`,
        shortTime: formattedTime,
        volume: tx.total_volume_liters,
        maxFlow: tx.max_flow_rate,
        deviceId: tx.device_id,
      };
    });

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Fuel Volume Usage Trends
            </h3>
            <p className="text-xs text-slate-400">
              Total Liters dispensed per completed session over time
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
          Last {transactions.length} Fills
        </span>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="volumeBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="shortTime"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              unit=" L"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md text-xs">
                      <p className="font-bold text-slate-200 mb-1">{data.timestamp}</p>
                      <div className="space-y-1 font-mono">
                        <p className="text-emerald-400 font-bold">
                          Volume: {data.volume.toFixed(2)} Liters
                        </p>
                        <p className="text-cyan-400">
                          Max Flow: {data.maxFlow.toFixed(1)} L/min
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          Device: {data.deviceId}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="volume"
              fill="url(#volumeBarGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="url(#volumeBarGradient)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
