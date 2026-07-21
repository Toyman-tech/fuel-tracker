"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebaseConfig";
import { LiveSession } from "./types";
import { INITIAL_LIVE_SESSION } from "./mockService";

export function useLiveSession() {
  const [session, setSession] = useState<LiveSession>(INITIAL_LIVE_SESSION);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const liveRef = ref(rtdb, "live_session");

      const unsubscribe = onValue(
        liveRef,
        (snapshot) => {
          setLoading(false);
          setIsConnected(true);
          setError(null);

          if (snapshot.exists()) {
            const data = snapshot.val();
            setSession({
              is_active: Boolean(data.is_active),
              flow_rate: Number(data.flow_rate || 0),
              current_volume: Number(data.current_volume || 0),
            });
          } else {
            // Node does not exist yet in RTDB, default to idle
            setSession(INITIAL_LIVE_SESSION);
          }
        },
        (err) => {
          console.warn("RTDB Connection listener notice:", err.message);
          setIsConnected(false);
          setLoading(false);
          setError(err.message);
        }
      );

      return () => unsubscribe();
    } catch (e: unknown) {
      const msg = (e as Error).message || "Firebase RTDB init notice";
      console.warn("Firebase RTDB init notice:", msg);
      setTimeout(() => {
        setIsConnected(false);
        setLoading(false);
        setError(msg);
      }, 0);
    }
  }, []);

  return { session, loading, isConnected, error, setSession };
}
