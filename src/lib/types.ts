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
