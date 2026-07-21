"use client";

import HardwareSimulator from "./HardwareSimulator";
import { useSimulator } from "../context/SimulatorContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const {
    isSimulatorOpen,
    setIsSimulatorOpen,
    session,
    setSession,
    handleAddTransaction,
  } = useSimulator();

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <main className="flex-1">
        {children}
      </main>

      {/* Edge Hardware Simulator Control Modal */}
      <HardwareSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        session={session}
        onUpdateSession={setSession}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}

