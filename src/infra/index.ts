import { MONGO_URI, MONGO_DB_NAME } from './../config';
import { connectTronWeb } from "./blockchain/tronweb"
import { connectMongo } from "./database/mongo/mongo"
import { initSentry } from "./logging/sentry"

const connectInfra = async () => {
    try {
        await Promise.all([
            connectMongo(MONGO_URI, MONGO_DB_NAME),
            initSentry(),
            connectTronWeb(),
        ])
    } catch (e) {
        throw e
    }
}

export {
    connectInfra
}