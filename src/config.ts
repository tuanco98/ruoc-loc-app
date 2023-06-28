import { config } from "dotenv";
import { getArrStringFromEnv, getBooleanFromEnv, getEnvString,getIntFromEnv } from "./lib/config.helper";

const path = ".env"
console.table({ env_path: path })
config({ path })

export const NODE_ENV = getEnvString("NODE_ENV")
export const SERVER_NAME = getEnvString("SERVER_NAME")
export const SENTRY_DNS = getEnvString("SENTRY_DNS")
export const MONGO_URI = getEnvString("MONGO_URI")
export const MONGO_DB_NAME = getEnvString("MONGO_DB_NAME")
export const GRAPHQL_PORT = getEnvString("GRAPHQL_PORT")
export const SERVER_CODE = getEnvString("SERVER_CODE")
export const PRIVATE_KEY_BOT = getEnvString("PRIVATE_KEY_BOT")
export const FULL_NODE_JSON_RPC_API = getEnvString("FULL_NODE_JSON_RPC_API")
export const TRON_PRO_API_KEY = getEnvString("TRON_PRO_API_KEY")
export const FULL_NODE = getEnvString("FULL_NODE")
export const SOLIDITY_NODE = getEnvString("SOLIDITY_NODE")
export const EVENT_SERVER = getEnvString("EVENT_SERVER")
export const KAFKA_CLIENT_ID = getEnvString("KAFKA_CLIENT_ID")
export const KAFKA_BROKER = getEnvString("KAFKA_BROKER")
export const KAFKA_GROUP_ID = getEnvString("KAFKA_GROUP_ID")
export const LUCKY_MONEY_CONTRACT_START_BLOCK = getIntFromEnv("LUCKY_MONEY_CONTRACT_START_BLOCK")
export const CONTRACT_LUCKY_MONEY_ADDRESS = getEnvString("CONTRACT_LUCKY_MONEY_ADDRESS")
export const CONTRACT_WTRX_ADDRESS = getEnvString("CONTRACT_WTRX_ADDRESS")


export const IS_FORK = getBooleanFromEnv("IS_FORK")
export const IS_DEBUG = getBooleanFromEnv("IS_DEBUG")
export const IS_SERVER_MAINTAINED = getBooleanFromEnv("IS_SERVER_MAINTAINED")
export const IS_USE_PLAYGROUND = getBooleanFromEnv("IS_USE_PLAYGROUND")

export const DEBUG_LEVEL = getArrStringFromEnv("DEBUG_LEVEL", ",")