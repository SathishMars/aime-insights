"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type UIState = {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;

  aimeOpen: boolean; // right panel open/closed
  setAimeOpen: (v: boolean) => void;

  // when Customize is clicked anywhere -> ensure aime opens
  openAime: () => void;
};

const Ctx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aimeOpen, setAimeOpen] = useState(true);

  const value = useMemo<UIState>(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      aimeOpen,
      setAimeOpen,
      openAime: () => setAimeOpen(true),
    }),
    [sidebarCollapsed, aimeOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}
