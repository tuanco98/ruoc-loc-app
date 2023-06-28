import { CONTRACT_WTRX_ADDRESS } from "../../../../config"
import { tronWeb } from "../../../../infra/blockchain/tronweb"
import { DAO } from "../../../../infra/database/mongo/methods"
import { Room, SettleResultType } from "../../../../infra/database/mongo/models/Room"
import { mongo } from "../../../../infra/database/mongo/mongo"
import { ErrorHandler } from "../../../../lib/error_handler"
import { request_validator } from "../../../../lib/validate"
import { CheckUserBalance, executeLuckyMoney, ValidateSignature } from "../../helper"
const currency = CONTRACT_WTRX_ADDRESS
type InputType = {
    id: string,
    address: string,
    signature: string,
    deposit_amount: number
}

type OutputType = "Success" | Omit<string, "Success">

export const rl_deposit = async (parent: any, args: any, ctx: any) => {
    const session = mongo.startSession()

    try {
        const { id, address, signature, deposit_amount } = args as InputType
        if (!tronWeb.isAddress(address)) throw new Error("address not valid")
        request_validator.ValidateMissing({ id, address, signature, deposit_amount })
        let after_room: Room | null = null
        await session.withTransaction(async () => {
            const room = await DAO.rooms.getRoomById(id)
            const { amount, size } = room
            validateRoom(address, deposit_amount, room)
             await CheckUserBalance(address, deposit_amount)
            const member = await ValidateSignature({ id, size, amount, address, signature, deposit_amount, currency })
            after_room = await DAO.rooms.userDeposit(room.id, member, session)
        })
        if (after_room) {
            await SendSettleRoom(after_room)
        }
        const result: OutputType = "Success"
        return result
    } catch (e: any) {
        console.log(e.message)

        ErrorHandler(e, args, rl_deposit.name)
        throw e
    }
}

const validateRoom = (new_address: string, new_deposit_amount: number, room: Room) => {
    const { amount, size, members } = room
    if (members.length > size - 1) throw new Error("ROOM FULL")
    const found_member = members.find(member => member.address === new_address)
    if (found_member) throw new Error("ALREADY JOIN ROOM")
    const is_valid_deposit_amount = amount !== new_deposit_amount
    if (is_valid_deposit_amount) throw new Error("DEPOSIT AMOUNT NOT EQUAL ROOM AMOUNT")
}

async function SendSettleRoom(room: Room) {
    if (room.members.length === room.size) {
        //Send settle to transaction
        const execute_txid = await executeLuckyMoney({ ...room, currency }, room.members.map(el => ({ address: el.address, signature: el.signature })))
        await DAO.rooms.common.updateOne({ id: room.id }, { $set: { settle_txid: execute_txid } })
    }
    return true
}
