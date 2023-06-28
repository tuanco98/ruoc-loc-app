import { Collection, MongoClient, MongoClientOptions, ReadPreference } from "mongodb";
import { MONGO_DB_NAME, MONGO_URI } from "../../../config";
import { errorConsoleLog, successConsoleLog } from "../../../lib/color-log";
import { initDAO } from "./methods";
import { Room, RoomIndexes } from "./models/Room";

let mongo: MongoClient

let collections: {
    rooms: Collection<Room>,
  
} = new Object() as any

const COLLECTION_NAMES = {
    rooms: "rooms",
}

const indexes = {
    rooms: RoomIndexes,
}

const checkModelInDb = async (params: { schema: any, collection: Collection<any> }[]) => {
    try {
        for (let param of params) {
            const { collection, schema } = param
            console.log(`checking in collection ${collection.collectionName} ...`)
            const notPassSchemaItems = await collection.find({ $nor: [{ $jsonSchema: schema }] }).toArray()
            if (notPassSchemaItems.length > 0) throw new Error(`${collection.collectionName} collection has ${notPassSchemaItems.length} item(s) not pass schema`)
        }
    } catch (e) {
        throw e
    }
}


const connectMongo = async (uri: string = MONGO_URI, db_name: string = MONGO_DB_NAME) => {
    try {
        console.log(`mongodb: connecting ...`)
        const mongo_options: MongoClientOptions = {
            ignoreUndefined: true, // find: {xxx: {$exists: false}}
            readPreference: ReadPreference.PRIMARY,
        }
        mongo = await new MongoClient(uri, mongo_options).connect()

        mongo.on('error', async (e) => {
            try {
                console.log(e)
                await mongo.close()
                await connectMongo(uri, db_name)
            } catch (e) {
                setTimeout(() => connectMongo(uri, db_name), 1000)
                throw e
            }
        })

        mongo.on('timeout', async () => {
            try {
                await mongo.close()
                await connectMongo(uri, db_name)
            } catch (e) {
                setTimeout(() => connectMongo(uri, db_name), 1000)
                throw e
            }
        })

        mongo.on('close', async () => {
            try {
                await connectMongo(uri, db_name)
            } catch (e) {
                setTimeout(() => connectMongo(uri, db_name), 1000)
                throw e
            }
        })

        const db = db_name ? mongo.db(db_name) : mongo.db()
        Object.keys(COLLECTION_NAMES).forEach((name) => {
            collections[COLLECTION_NAMES[name]] = db.collection(COLLECTION_NAMES[name])
        })

        successConsoleLog(`🚀 mongodb: connected to ${db.databaseName}`)
        initDAO()
    } catch (e) {
        errorConsoleLog(`mongodb: disconnected`)
        await mongo?.close(true)
        setTimeout(connectMongo, 1000)
        throw e
    }
}

const createMongoIndex = async () => {
    console.log(`📇 Create indexes ...`)
    for (let name of Object.keys(COLLECTION_NAMES)) {
        if (indexes[name]) {
            await collections[COLLECTION_NAMES[name]].createIndexes(indexes[name])
            console.log(`create indexes for -${name}- collection success!`)
        }
    }
    console.log(`📇 Create all indexes success!`)
}

const dropMongoIndex = async () => {
    console.log(`📇 Drop indexes ...`)
    for (let name of Object.keys(COLLECTION_NAMES)) {
        if (indexes[name]) {
            try {
                await collections[COLLECTION_NAMES[name]].dropIndexes()
            } catch (e) {
                console.log(e)
            }
            console.log(`Drop indexes for -${name}- collection success!`)
        }
    }
    console.log(`📇 Drop all indexes success!`)
}

const mongoCheckModel = async () => {
    try {
        console.log(`mongodb: checking model and document schema ...`)
        await checkModelInDb([

        ])
    } catch (e) {
        throw e
    }
}



export {
    mongo,
    connectMongo,
    collections,
    indexes,
    createMongoIndex,
    dropMongoIndex,
    COLLECTION_NAMES,
    mongoCheckModel
}