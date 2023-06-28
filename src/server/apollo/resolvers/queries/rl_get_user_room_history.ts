import { DAO } from "../../../../infra/database/mongo/methods"
import { Room } from "../../../../infra/database/mongo/models/Room"
import { ErrorHandler } from "../../../../lib/error_handler"
import { request_validator } from "../../../../lib/validate"

type InputType = {
    address: string,
    page: number,
    pageSize: number,
}

type OutputType = {
    total: number,
    data: Partial<Room>[]
}

export const rl_get_user_room_history = async (parent: any, args: any, ctx: any) => {
    try {
        const { address, page = 0, pageSize = 10 } = args as InputType
        request_validator.ValidateMissing({ address })
        request_validator.ValidatePagination({ page, pageSize })
        const data = await DAO.rooms.getRooms({ is_settle: true, page, pageSize, options: { address } })
        const result: OutputType = {
            total: data.total,
            data: data.rooms
        }
        return result
    } catch (e) {
        ErrorHandler(e, args, rl_get_user_room_history.name)
        throw e
    }
}