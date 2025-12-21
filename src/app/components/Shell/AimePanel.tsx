"use client";

import { useUI } from "@/lib/ui-store";
import { suggestions } from "@/lib/data";
import { useMemo, useRef, useState } from "react";

type Msg = { id: string; role: "assistant" | "user"; text: string; ts: string };

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AimePanel() {
  const { aimeOpen, setAimeOpen } = useUI();

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m1",
      role: "assistant",
      text: "Ask aime to analyse anything or use suggested prompt for the start.",
      ts: nowTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length >= 3 && input.trim().length <= 200, [input]);

  function push(role: Msg["role"], text: string) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, text, ts: nowTime() }]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function send(text: string) {
    const q = text.trim();
    if (q.length < 3) return;
    push("user", q);
    setInput("");
    // demo response
    setTimeout(() => push("assistant", `Got it. (Demo) I would run: "${q}"`), 300);
  }

  // Collapsed state: hide panel completely and show floating pill button (PNG)
  if (!aimeOpen) {
    return (
      <>
        <button
          onClick={() => setAimeOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-3 shadow-lg"
        >
          <span className="text-[#7c3aed]">✦</span>
          <span className="text-[14px] font-semibold">aime</span>
        </button>
      </>
    );
  }

  return (
    <aside className="flex h-full flex-col border-l border-[#e5e7eb] bg-white px-3 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-[#111827]">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f5f3ff] text-[11px] text-[#7c3aed]">
            ✦
          </span>
          <span className="text-[13px]">aime</span>
        </div>
        <button
          onClick={() => setAimeOpen(false)}
          className="h-6 w-6 rounded-full text-[#9ca3af] hover:bg-[#f3f4f6]"
          title="Collapse"
        >
          –
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mt-2 flex flex-col items-center text-center">
            <div className="text-[32px] text-[#7c3aed]">✦</div>
            <div className="mt-1 text-[14px] font-semibold leading-snug text-[#111827]">
              Meet aime — your AI assistant for
              <br />
              analyzing & creating your event
              <br />
              reports.
            </div>
          </div>

          <div className="mt-2 space-y-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-left text-[11px] text-[#374151] hover:bg-[#f3f4f6]"
              >
                {s}
              </button>
            ))}
            <button className="w-full rounded-xl px-3 py-2 text-center text-[11px] text-[#4f46e5] hover:bg-[#f5f5f7]">
              View all aime suggestions
            </button>
          </div>

          <div className="mt-2 rounded-2xl border border-[#eef0f7] bg-[#fbfcff] p-2">
            {messages.map((m) => (
              <div key={m.id} className={`mb-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={[
                    "max-w-[85%] rounded-2xl border px-3 py-1.5",
                    m.role === "user"
                      ? "border-[#111827] bg-[#111827] text-white"
                      : "border-[#e5e7eb] bg-white text-[#111827]",
                  ].join(" ")}
                >
                  <div className="mb-0.5 text-[10px] opacity-75">
                    {m.role === "assistant" ? "aime" : "You"} · {m.ts}
                  </div>
                  <div className="whitespace-pre-wrap text-[12px] leading-snug">{m.text}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-2">
        <div className="mb-1 text-[10px] text-[#6b7280]">
          Min 3 chars, max 200.
        </div>
        <div className="flex items-end gap-2">
          <textarea
            className="h-[48px] w-full resize-none rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-[12px] outline-none"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 200))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canSend) send(input);
              }
            }}
          />
          <button
            disabled={!canSend}
            onClick={() => send(input)}
            className="h-8 w-8 rounded-full bg-[#7c3aed] text-white disabled:opacity-40"
            title="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </aside>
  );
}
