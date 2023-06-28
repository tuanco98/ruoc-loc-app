import { IS_FORK, NODE_ENV } from "../config"
import { createMongoIndex } from "../infra/database/mongo/mongo"
import { successConsoleLog } from "./color-log"
import { connectInfra } from "../infra"
import { startApolloServer } from "../server/apollo/apollo"
import { startKafkaConsumer } from "../infra/kafka"


const RunServer = async (is_main: boolean = true) => {
    try {
        console.log({ is_main })
        console.log("========================")
        successConsoleLog("SERVER STARTING")
        await connectInfra()
        
        if (!is_main) {
            successConsoleLog(`🍴Run Fork Cluster Job ...`)
            await startApolloServer()
        } else {
            if (!IS_FORK) await startApolloServer(),
            successConsoleLog(`👑 Run Main Cluster Job ...`)
            Promise.all([
                createMongoIndex(),
                startKafkaConsumer()
            ])
            if (NODE_ENV !== "local") {
                await Promise.all([
                ])
            }
        }
    } catch (e) {
        console.log(e)
        throw e
    }
}
const IntervalCheckHealth = async () => {

}
export const Main = async (first_run: boolean = true, is_main: boolean = true) => {
    try {
        first_run && RunServer(is_main)
        !first_run && IntervalCheckHealth()
    } catch (e) {
        console.log(e)
    } finally {
        setTimeout(() => Main(false, is_main), 60000)
    }
}

