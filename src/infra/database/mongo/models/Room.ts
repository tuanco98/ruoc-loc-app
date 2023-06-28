import { IndexDescription } from "mongodb"


type RoomMember = {
    address: string
    amount: number
    signature: string
}

type SettleResultType = {
    address: string
    amount: number
}

type Room = {
    id: string
    size: number
    amount: number
    created_at: Date
    members: RoomMember[]
    settle_txid?: string
    settle_result?: SettleResultType[]
}

const RoomIndexes: IndexDescription[] = [
    { key: { id: 1 }, unique: true, background: true },
    { key: { settle_txid: 1 }, partialFilterExpression: { settle_txid: { $exists: true } }, unique: true, background: true },
    { key: { size: 1 }, background: true },
    { key: { amount: 1 }, background: true },
    { key: { members: 1 }, background: true },
]

export {
    Room,
    RoomIndexes,
    RoomMember,
    SettleResultType
}