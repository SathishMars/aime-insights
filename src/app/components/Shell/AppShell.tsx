"use client";

import { UIProvider, useUI } from "@/lib/ui-store";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AimePanel } from "./AimePanel";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { aimeOpen, sidebarCollapsed } = useUI();

  // Exact 3-column behavior like PNG:
  // - Sidebar fixed
  // - Main fills
  // - Aime panel appears/disappears, with floating pill when hidden
  return (
    <div className="h-screen w-full overflow-hidden bg-[#f5f5f7]">
      <Topbar />

      <div
        className="grid h-[calc(100vh-56px)]"
        style={{
          gridTemplateColumns: `${sidebarCollapsed ? 72 : 260}px 1fr ${aimeOpen ? 360 : 0}px`,
        }}
      >
        <Sidebar />

        <main className="h-full overflow-hidden">
          {/* Main scroll area (like PNG center area) */}
          <div className="h-full overflow-y-auto px-4 py-4">{children}</div>
        </main>

        {/* Right panel */}
        <div className="h-full overflow-hidden">
          <AimePanel />
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <ShellInner>{children}</ShellInner>
    </UIProvider>
  );
}
