import { LiveSession, Transaction } from "./types";

export const INITIAL_MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-20",
    device_id: "verifier_node_01",
    total_volume_liters: 45.8,
    max_flow_rate: 32.4,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "tx-19",
    device_id: "verifier_node_01",
    total_volume_liters: 38.2,
    max_flow_rate: 31.0,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "tx-18",
    device_id: "verifier_node_01",
    total_volume_liters: 52.1,
    max_flow_rate: 34.2,
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
  },
  {
    id: "tx-17",
    device_id: "verifier_node_01",
    total_volume_liters: 24.5,
    max_flow_rate: 29.8,
    timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
  },
  {
    id: "tx-16",
    device_id: "verifier_node_01",
    total_volume_liters: 60.0,
    max_flow_rate: 35.5,
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
  {
    id: "tx-15",
    device_id: "verifier_node_01",
    total_volume_liters: 18.7,
    max_flow_rate: 28.1,
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
  },
  {
    id: "tx-14",
    device_id: "verifier_node_01",
    total_volume_liters: 41.3,
    max_flow_rate: 33.0,
    timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
  },
  {
    id: "tx-13",
    device_id: "verifier_node_01",
    total_volume_liters: 33.9,
    max_flow_rate: 30.5,
    timestamp: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
  },
  {
    id: "tx-12",
    device_id: "verifier_node_01",
    total_volume_liters: 49.6,
    max_flow_rate: 34.8,
    timestamp: new Date(Date.now() - 1000 * 60 * 620).toISOString(),
  },
  {
    id: "tx-11",
    device_id: "verifier_node_01",
    total_volume_liters: 27.4,
    max_flow_rate: 29.1,
    timestamp: new Date(Date.now() - 1000 * 60 * 780).toISOString(),
  },
  {
    id: "tx-10",
    device_id: "verifier_node_01",
    total_volume_liters: 55.2,
    max_flow_rate: 35.1,
    timestamp: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
  },
  {
    id: "tx-09",
    device_id: "verifier_node_01",
    total_volume_liters: 42.0,
    max_flow_rate: 32.0,
    timestamp: new Date(Date.now() - 1000 * 60 * 1050).toISOString(),
  },
  {
    id: "tx-08",
    device_id: "verifier_node_01",
    total_volume_liters: 15.0,
    max_flow_rate: 26.5,
    timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
  },
  {
    id: "tx-07",
    device_id: "verifier_node_01",
    total_volume_liters: 50.4,
    max_flow_rate: 34.0,
    timestamp: new Date(Date.now() - 1000 * 60 * 1400).toISOString(),
  },
  {
    id: "tx-06",
    device_id: "verifier_node_01",
    total_volume_liters: 39.8,
    max_flow_rate: 31.9,
    timestamp: new Date(Date.now() - 1000 * 60 * 1600).toISOString(),
  }
];

export const INITIAL_LIVE_SESSION: LiveSession = {
  is_active: false,
  flow_rate: 0,
  current_volume: 0.0,
};
