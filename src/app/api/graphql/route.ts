import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "./schema";

export const runtime = "nodejs"; // required for pg
export const dynamic = "force-dynamic";

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export async function GET(request: Request) {
    console.log("[GraphQL] GET request received");
    return handler(request);
}

export async function POST(request: Request) {
    console.log("[GraphQL] POST request received");
    return handler(request);
}
