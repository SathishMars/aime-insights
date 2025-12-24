import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "./schema";
import { getMongoDb } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let serverInstance: ApolloServer<any> | null = null;

async function getHandler() {
    if (!serverInstance) {
        serverInstance = new ApolloServer({ typeDefs, resolvers });
    }

    return startServerAndCreateNextHandler(serverInstance, {
        context: async (req) => {
            return {
                mongo: await getMongoDb(),
                user: null, // later: attach logged-in user id/email
                requestId: (req as any).headers?.get?.("x-request-id") ??
                    (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7)),
            };
        },
    });
}

export async function GET(request: Request) {
    const handler = await getHandler();
    return handler(request);
}

export async function POST(request: Request) {
    const handler = await getHandler();
    return handler(request);
}
