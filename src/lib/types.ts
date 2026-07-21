export interface LiveSession {
  is_active: boolean;
  flow_rate: number;       // Liters per minute (L/min)
  current_volume: number;  // Total volume dispensed so far in Liters
}

export interface Transaction {
  id?: string;
  device_id: string;
  total_volume_liters: number;
  max_flow_rate: number;
  timestamp: string;       // ISO-8601 string, e.g. "2026-07-21T01:02:37Z"
}

export interface AnalyticsSummary {
  totalVolume: number;
  totalTransactions: number;
  avgVolume: number;
  maxFlowRate: number;
}

export function parseTimestampToDate(rawTimestamp: unknown): Date {
  if (!rawTimestamp) return new Date();

  if (rawTimestamp instanceof Date) {
    return isNaN(rawTimestamp.getTime()) ? new Date() : rawTimestamp;
  }

  if (typeof rawTimestamp === "object" && rawTimestamp !== null) {
    // Firestore Timestamp object (.toDate())
    if ("toDate" in rawTimestamp && typeof (rawTimestamp as { toDate?: () => Date }).toDate === "function") {
      try {
        const d = (rawTimestamp as { toDate: () => Date }).toDate();
        if (!isNaN(d.getTime())) return d;
      } catch {
        // ignore fallback
      }
    }
    if ("seconds" in rawTimestamp && typeof (rawTimestamp as { seconds?: number }).seconds === "number") {
      const secs = (rawTimestamp as { seconds: number }).seconds;
      const d = new Date(secs * 1000);
      if (!isNaN(d.getTime())) return d;
    }
  }

  if (typeof rawTimestamp === "number") {
    const ms = rawTimestamp > 1e11 ? rawTimestamp : rawTimestamp * 1000;
    const d = new Date(ms);
    if (!isNaN(d.getTime())) return d;
  }

  if (typeof rawTimestamp === "string") {
    const d = new Date(rawTimestamp);
    if (!isNaN(d.getTime())) return d;
  }

  return new Date();
}
