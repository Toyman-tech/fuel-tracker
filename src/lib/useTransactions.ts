"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Transaction, parseTimestampToDate } from "./types";
import { INITIAL_MOCK_TRANSACTIONS } from "./mockService";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function fetchFirestoreTransactions() {
      try {
        setLoading(true);
        const transactionsRef = collection(db, "transactions");
        const q = query(transactionsRef, orderBy("timestamp", "desc"), limit(20));

        // Use real-time snapshot for Firestore so completed hardware fills update instantly
        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            setLoading(false);
            setError(null);
            if (!querySnapshot.empty) {
              const docs: Transaction[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  device_id: data.device_id || "verifier_node_01",
                  total_volume_liters: Number(data.total_volume_liters || 0),
                  max_flow_rate: Number(data.max_flow_rate || 0),
                  timestamp: parseTimestampToDate(data.timestamp).toISOString(),
                };
              });
              setTransactions(docs);
              setUsingMock(false);
            } else {
              // Collection empty, provide fallback mock transactions for demo display
              setTransactions(INITIAL_MOCK_TRANSACTIONS);
              setUsingMock(true);
            }
          },
          (err) => {
            console.warn("Firestore snapshot error/unconfigured notice:", err.message);
            // Graceful fallback to mock data when API key placeholder or permission pending
            setTransactions(INITIAL_MOCK_TRANSACTIONS);
            setUsingMock(true);
            setLoading(false);
            setError(err.message);
          }
        );
      } catch (e: unknown) {
        const msg = (e as Error).message || "Firestore fetch notice";
        console.warn("Firestore fetch notice:", msg);
        setTransactions(INITIAL_MOCK_TRANSACTIONS);
        setUsingMock(true);
        setLoading(false);
      }
    }

    fetchFirestoreTransactions();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { transactions, loading, error, usingMock, setTransactions };
}
