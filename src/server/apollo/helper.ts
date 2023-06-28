import { CONTRACT_LUCKY_MONEY_ADDRESS } from "../../config"
import { lucky_money_contract, tronWeb, w_trx_contract } from "../../infra/blockchain/tronweb"
import { isAddressTronweb } from "../../infra/blockchain/tronweb/method"
import { Room, RoomMember } from "../../infra/database/mongo/models/Room"
import { ErrMsg, ERROR_CODE } from "../../lib/error_handler"
import { isGreaterOrEqual } from "../../lib/utils"

const encodeToken = (signature: string, address: string) => {
    return signature + "_" + address
}

const decodeToken = (token: string) => {
    if (!token) throw ErrMsg(ERROR_CODE.AUTHORIZATION_REQUIRED)
    const [signature, address] = token.split("_")
    return {
        signature,
        address,
    }
}

const GetAuthorization = (ctx: any) => {
    const { signature, address } = decodeToken(ctx?.req?.headers?.authorization)
    if (!signature) throw ErrMsg(ERROR_CODE.AUTHORIZATION_REQUIRED)
    if (!address && !isAddressTronweb(address)) throw ErrMsg(ERROR_CODE.SIGNATURE_INVALID)
    return { address, authorization: signature }
}

const CheckNullAndGetAuthorization = (ctx: any) => {
    const authorization = ctx?.req?.headers?.authorization
    // if (!authorization) throw ErrMsg(ERROR_CODE.AUTHORIZATION_REQUIRED)
    return authorization
}

type InputType = {
    id: string
    size: number
    amount: number
    currency: string
    address: string
    signature: string
    deposit_amount: number
}
function GetMessageSignedHash(input: InputType) {
    const { id, size, amount, address, signature, currency } = input
    const TypedDataEncoder = tronWeb.utils._TypedDataEncoder
    const types = {
        LuckyDraw: [
            { name: "roomId", type: "bytes32" },
            { name: "size", type: "uint8" },
            { name: "currency", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "signer", type: "address" },
        ],
    }
    const message = {
        roomId: id,
        size,
        currency,
        amount,
        signer: address,
    }
    const messageHash = TypedDataEncoder.from(types).hash(message) as string
    return messageHash
}
async function ValidateSignature(input: InputType) {
    try {
        const messageHash = GetMessageSignedHash(input)
        console.log({ messageHash })
        var is_valid_signature = await tronWeb.trx.verifyMessage(messageHash, input.signature, input.address)
        console.log({ is_valid_signature })
        if (!is_valid_signature) throw ErrMsg(ERROR_CODE.SIGNATURE_INVALID)
        return {
            address: input.address,
            amount: input.amount,
            signature: input.signature,
        } as RoomMember
    } catch (e) {
        throw e
    }
}

async function CheckUserBalance(address: string, deposit_amount: number) {
    const [allowance, balanceOf] = await Promise.all([
        w_trx_contract.allowance(address, CONTRACT_LUCKY_MONEY_ADDRESS).call(),
        w_trx_contract.balanceOf(address).call(),
    ])
    const is_allowance_greater_or_eq_deposit_amount = isGreaterOrEqual(allowance.toString(), deposit_amount.toString())
    const is_balance_greater_or_eq_deposit_amount = isGreaterOrEqual(balanceOf.toString(), deposit_amount.toString())
    if (!is_allowance_greater_or_eq_deposit_amount) throw new Error(`Allowance WTRX not enough, please approve WTRX for ${CONTRACT_LUCKY_MONEY_ADDRESS}`)
    if (!is_balance_greater_or_eq_deposit_amount) throw new Error("Balance WTRX not enough for deposit")
    return true
}
type UserType = {
    address: string
    signature: string
}
export const executeLuckyMoney = async (roomInfo: Pick<InputType, "id" | "size" | "currency" | "amount">, users: UserType[]) => {
    try {
        const { id, size, currency, amount } = roomInfo
        const _roomInfo = Object.values({ id, size, currency, amount })
        const _users = users.map(el => Object.values(el))
        // TODO: fix response data
        lucky_money_contract.excutePersonal(_roomInfo, _users).send({ feeLimit: 1e9, value: 0, useRelay: true, useSignType: "personal_trx" })
        return 'OK' as string
    } catch (e) {
        throw e
    }
}

export const isHexString = (msg: string) => /^(0x|0X)?[a-fA-F0-9]+$/.test(msg)
export { encodeToken, CheckNullAndGetAuthorization, GetAuthorization, ValidateSignature, CheckUserBalance }
