"use client";

import { useTransactions } from "@/lib/useTransactions";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function HistoryPage() {
  const { transactions, loading, usingMock } = useTransactions();

  return (
    <AnalyticsDashboard
      transactions={transactions}
      loading={loading}
      usingMock={usingMock}
    />
  );
}
