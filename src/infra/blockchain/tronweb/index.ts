import {
    FULL_NODE,
    SOLIDITY_NODE,
    EVENT_SERVER,
    PRIVATE_KEY_BOT,
    TRON_PRO_API_KEY,
    CONTRACT_LUCKY_MONEY_ADDRESS,
    CONTRACT_WTRX_ADDRESS,
} from "./../../../config"
import TronWeb from "tronweb"
import { successConsoleLog } from "../../../lib/color-log"
import { lucky_money_abi } from "./abi/lucky_money"
import { wtrx_abi } from "./abi/wtrx"
import { TronSave } from "@phongntprl/tronfws"

let tronWeb: any
let tronSave: any

let w_trx_contract: any
let lucky_money_contract: any
const connectTronWeb = async () => {
    try {
        tronWeb = new TronWeb({
            fullNode: FULL_NODE,
            solidityNode: SOLIDITY_NODE,
            eventServer: EVENT_SERVER,
            privateKey: PRIVATE_KEY_BOT,
            headers: { "TRON-PRO-API-KEY": TRON_PRO_API_KEY },
        })
        tronSave = new TronSave(tronWeb, { apiKey: "FJT0BTG-F5BM4QC-P59F1MJ-GFR30PH", paymentMethodType: 11 })
        lucky_money_contract = await tronSave.tronWeb.contract(lucky_money_abi, CONTRACT_LUCKY_MONEY_ADDRESS)
        w_trx_contract = await tronWeb.contract(wtrx_abi, CONTRACT_WTRX_ADDRESS)
        successConsoleLog(`tronWeb: Connected`)
    } catch (e) {
        throw e
    }
}
export { connectTronWeb, tronWeb, w_trx_contract, lucky_money_contract }
