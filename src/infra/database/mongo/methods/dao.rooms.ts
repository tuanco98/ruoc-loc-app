
import { ClientSession, WithId } from "mongodb"
import { DAO } from "."
import { SettleEventDataType } from "../../../kafka/handler/handler.contractevent"
import { getPaginationStage, getTotalStage } from "../helper"
import { Room, RoomMember, SettleResultType } from "../models/Room"
import { collections } from "../mongo"




const getDAO = () => ({
    common: collections.rooms,
    createNewRoom: async (params: { id: string, size: number, amount: number, member: RoomMember }) => {
        const { id, size, amount, member } = params
        const new_room: Room = {
            id,
            size,
            amount,
            members: [member],
            created_at: new Date(),
        }
        await collections.rooms.insertOne(new_room)
        return new_room
    },
    userDeposit: async (room_id: string, member: RoomMember, session?: ClientSession) => {
        const response = await collections.rooms.findOneAndUpdate({ id: room_id }, { $addToSet: { members: member } }, { returnDocument: "after", session })
        if (!response.value) throw new Error("Room not exist")
        return response.value
    },
    getRoomById: async (id: string, session?: ClientSession) => {
        const room = await collections.rooms.findOne({ id }, { session })
        if (!room) throw new Error("Room not exist")
        return room
    },
    getRooms: async (params: { is_settle: boolean, page: number, pageSize: number, options?: { address: string } }) => {
        const { is_settle, page, pageSize, options } = params

        const match_stage = {
            $match: {
                settle_result: { $exists: is_settle }
            }
        }
        if (options?.address) {
            match_stage.$match["members.address"] = options.address
        }
        const pagination_stages = getPaginationStage(page, pageSize)
        const total_stage = getTotalStage()
        const sort_stage = {
            $sort: {
                created_at: -1
            }
        }

        const pipeline: Parameters<typeof collections.rooms.aggregate>[0] = [match_stage, sort_stage, ...pagination_stages]
        const total_pipeline: Parameters<typeof collections.rooms.aggregate>[0] = [match_stage, sort_stage, total_stage]

        const rooms = await collections.rooms.aggregate(pipeline).toArray() as WithId<Room>[]
        let total = 0
        const total_result = await collections.rooms.aggregate(total_pipeline).toArray() as { total: number }[]
        if (total_result.length) {
            total = total_result[0].total
        }
        return {
            total,
            rooms
        }
    },
    settleRoom: async (settle_data: SettleEventDataType, transactionId: string, session?: ClientSession) => {
        const room = await getDAO().getRoomById(settle_data.roomId, session)
        const new_settle_result: SettleResultType[] = room.members.map((el, index) => ({
            address: el.address,
            amount: settle_data.amount[index]
        }))
        await DAO.rooms.common.updateOne({ id: settle_data.roomId }, { $set: { settle_result: new_settle_result, settle_txid: transactionId } }, { session })
    },
    deleteRoom: async (id: string, address: string) => {
        const room = await getDAO().getRoomById(id)
        if (!(address === room.members[0].address)) throw new Error("You are not the owner of this room")
        await collections.rooms.deleteOne({ id })
    }
})

type DAOType = ReturnType<typeof getDAO>

export {
    getDAO as getRoomDAO,
    DAOType as RoomDAOType
}
