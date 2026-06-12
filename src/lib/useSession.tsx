"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { makeGridEvent } from "./mockData";
import {
  activatedSession,
  clearSession,
  defaultSession,
  loadSession,
  saveSession,
} from "./session";
import type { GridEvent, Session } from "./types";

interface SessionContextValue {
  session: Session;
  /** True once the session has been hydrated from localStorage on the client. */
  ready: boolean;
  activate: (
    payload: Pick<Session, "brandId" | "aggressiveness" | "targetTempF" | "monthlyBill">
  ) => void;
  /** Fire a grid event. Returns the created event (null if it was overridden). */
  dispatchEvent: (auto: boolean) => GridEvent;
  setOverride: (active: boolean) => void;
  updatePreferences: (
    payload: Partial<
      Pick<Session, "aggressiveness" | "targetTempF" | "monthlyBill" | "brandId">
    >
  ) => void;
  reset: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(defaultSession);
  const [ready, setReady] = useState(false);
  // Always read the freshest override state inside async/auto callbacks.
  const overrideRef = useRef(session.overrideActive);
  overrideRef.current = session.overrideActive;

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (ready) saveSession(session);
  }, [session, ready]);

  const activate = useCallback<SessionContextValue["activate"]>((payload) => {
    setSession((prev) => activatedSession(prev, payload));
  }, []);

  const dispatchEvent = useCallback<SessionContextValue["dispatchEvent"]>((auto) => {
    const overridden = overrideRef.current;
    const event = makeGridEvent({ auto, overridden });
    setSession((prev) => ({
      ...prev,
      events: [event, ...prev.events].slice(0, 50),
      rewardSavings: prev.rewardSavings + event.reward,
    }));
    return event;
  }, []);

  const setOverride = useCallback<SessionContextValue["setOverride"]>((active) => {
    setSession((prev) => ({ ...prev, overrideActive: active }));
  }, []);

  const updatePreferences = useCallback<SessionContextValue["updatePreferences"]>((payload) => {
    setSession((prev) => ({ ...prev, ...payload }));
  }, []);

  const reset = useCallback(() => {
    clearSession();
    setSession(defaultSession());
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({ session, ready, activate, dispatchEvent, setOverride, updatePreferences, reset }),
    [session, ready, activate, dispatchEvent, setOverride, updatePreferences, reset]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
