import { ApolloServer } from "apollo-server"
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault, ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { typeDefs } from "./typeDefs/schema"
import { resolvers } from "./resolvers"
import { successConsoleLog } from "../../lib/color-log";
import { IS_USE_PLAYGROUND, NODE_ENV, GRAPHQL_PORT, SERVER_NAME } from "../../config";


export const startApolloServer = async () => {
    try {
        const plugins = IS_USE_PLAYGROUND ? [ApolloServerPluginLandingPageGraphQLPlayground()] : (
            NODE_ENV === "production" ? [ApolloServerPluginLandingPageProductionDefault({ footer: false })] : [ApolloServerPluginLandingPageLocalDefault({ footer: false })]
        )
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: req => ({
                ...req
            }),
            plugins,
            debug: true
        })

        const { url } = await server.listen({ port: GRAPHQL_PORT })
        successConsoleLog(`🚀 ${SERVER_NAME} graphql ready at ${url}`);
        console.log(`Try your health check at: ${url}.well-known/apollo/server-health`);
    } catch (e) {
        throw e
    }
}
