import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "./schema";

export const runtime = "nodejs"; // required for pg
export const dynamic = "force-dynamic";

let serverInstance: any = null;

async function getHandler() {
    if (!serverInstance) {
        serverInstance = new ApolloServer({
            typeDefs,
            resolvers,
        });
    }
    return startServerAndCreateNextHandler(serverInstance);
}

export async function GET(request: Request) {
    console.log("[GraphQL] GET request received");
    const handler = await getHandler();
    return handler(request);
}

export async function POST(request: Request) {
    console.log("[GraphQL] POST request received");
    const handler = await getHandler();
    return handler(request);
}
