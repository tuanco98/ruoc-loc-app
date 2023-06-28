import { CONTRACT_WTRX_ADDRESS } from "../../../../config"
import { tronWeb } from "../../../../infra/blockchain/tronweb"
import { DAO } from "../../../../infra/database/mongo/methods"
import { Room } from "../../../../infra/database/mongo/models/Room"
import { ErrMsg, ErrorHandler, ERROR_CODE } from "../../../../lib/error_handler"
import { request_validator } from "../../../../lib/validate"
import { CheckUserBalance, isHexString, ValidateSignature } from "../../helper"
type InputType = {
    id: string,
    size: number,
    amount: number,
    address: string,
    signature: string,
    deposit_amount: number
}

type OutputType = Partial<Room>

export const rl_create_room = async (parent: any, args: any, ctx: any) => {
    try {
        const { id, size, amount, address, signature, deposit_amount } = args as InputType
        request_validator.ValidateMissing({ id, size, amount, address, signature, deposit_amount })
        if (size < 2) throw new Error("Size must be greater than 1")
        if (amount < 2) throw new Error("Amount must be greater than 1")
        if(!isHexString(id)) throw new Error("id is not valid")
        if(!isHexString(signature)) throw new Error("signature is not valid")
        if (!tronWeb.isAddress(address)) throw new Error("address not valid")
        const member = await ValidateSignature({ id, size, amount, address, signature, deposit_amount, currency: CONTRACT_WTRX_ADDRESS })
        console.log({ member })
        await CheckUserBalance(address, deposit_amount)
        const new_room = await DAO.rooms.createNewRoom({ id, size, amount, member })
        const result: OutputType = new_room
        return result
    } catch (e: any) {
        console.log(e.message)
        if (e.message && e.message.startsWith("E11000 duplicate key error collection")) e = ErrMsg(ERROR_CODE.ROOM_EXISTS)
        ErrorHandler(e, args, rl_create_room.name)
        throw e
    }
}

