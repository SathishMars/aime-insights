export type ChatMsg = { role: "user" | "assistant"; text: string };

export function buildContextSummary(history: ChatMsg[]) {
  // Keep it simple for sprint 1: send last few utterances.
  const recent = history.slice(-6).map((m) => `${m.role.toUpperCase()}: ${m.text}`).join("\n");
  return recent ? `Conversation so far:\n${recent}` : "";
}
