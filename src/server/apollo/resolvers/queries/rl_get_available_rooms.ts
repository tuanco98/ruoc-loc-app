import { DAO } from "../../../../infra/database/mongo/methods"
import { Room } from "../../../../infra/database/mongo/models/Room"
import { ErrorHandler } from "../../../../lib/error_handler"
import { request_validator } from "../../../../lib/validate"

type InputType = {
    page: number,
    pageSize: number,
}

type OutputType = {
    total: number,
    data: Partial<Room>[]
}
export const rl_get_available_rooms = async (parent: any, args: any, ctx: any) => {
    try {
        const { page = 0, pageSize = 10 } = args as InputType
        request_validator.ValidatePagination({ page, pageSize })
        const data = await DAO.rooms.getRooms({ is_settle: false, page, pageSize })
        const result: OutputType = {
            total: data.total,
            data: data.rooms
        }
        return result
    } catch (e) {
        ErrorHandler(e, args, rl_get_available_rooms.name)
        throw e
    }
}