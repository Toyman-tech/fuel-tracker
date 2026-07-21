"use client";

import React, { createContext, useContext, useState } from "react";
import { useLiveSession } from "../lib/useLiveSession";
import { useTransactions } from "../lib/useTransactions";
import { LiveSession, Transaction } from "../lib/types";

interface SimulatorContextType {
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  toggleSimulator: () => void;
  session: LiveSession;
  setSession: (session: LiveSession) => void;
  liveLoading: boolean;
  isConnected: boolean;
  transactions: Transaction[];
  txLoading: boolean;
  usingMock: boolean;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  handleAddTransaction: (newTx: Transaction) => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const { session, loading: liveLoading, isConnected, setSession } = useLiveSession();
  const { transactions, loading: txLoading, usingMock, setTransactions } = useTransactions();

  const toggleSimulator = () => setIsSimulatorOpen((prev) => !prev);

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev.slice(0, 19)]);
  };

  return (
    <SimulatorContext.Provider
      value={{
        isSimulatorOpen,
        setIsSimulatorOpen,
        toggleSimulator,
        session,
        setSession,
        liveLoading,
        isConnected,
        transactions,
        txLoading,
        usingMock,
        setTransactions,
        handleAddTransaction,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error("useSimulator must be used within a SimulatorProvider");
  }
  return context;
}
