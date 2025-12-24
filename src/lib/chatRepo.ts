import type { Db } from "mongodb";

export type ChatRole = "user" | "assistant" | "system";

export async function upsertConversation(
  db: Db,
  params: { conversationId: string; userId?: string | null; title?: string | null }
) {
  const now = new Date();
  await db.collection("conversations").updateOne(
    { conversationId: params.conversationId },
    {
      $setOnInsert: {
        conversationId: params.conversationId,
        userId: params.userId ?? null,
        createdAt: now,
      },
      $set: { title: params.title ?? "Aime Chat", updatedAt: now },
    },
    { upsert: true }
  );
}

export async function saveMessage(
  db: Db,
  params: {
    conversationId: string;
    userId?: string | null;
    role: ChatRole;
    content: string;
    meta?: Record<string, any>;
  }
) {
  await db.collection("messages").insertOne({
    conversationId: params.conversationId,
    userId: params.userId ?? null,
    role: params.role,
    content: params.content,
    meta: params.meta ?? {},
    createdAt: new Date(),
  });
}
