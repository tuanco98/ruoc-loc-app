import { DAO } from "../../../../infra/database/mongo/methods"
import { Room } from "../../../../infra/database/mongo/models/Room"
import { ErrorHandler } from "../../../../lib/error_handler"

type InputType = {
    id: string,
}

type OutputType = Partial<Room>

export const rl_get_room_by_id = async (parent: any, args: any, ctx: any) => {
    try {
        const { id } = args as InputType
        const room = await DAO.rooms.getRoomById(id)
        const result: OutputType = room
        return result
    } catch (e) {
        ErrorHandler(e, args, rl_get_room_by_id.name)
        throw e
    }
}