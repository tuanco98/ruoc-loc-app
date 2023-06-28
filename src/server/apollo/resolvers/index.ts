import { ObjectId } from "mongodb"
import { CONTRACT_WTRX_ADDRESS } from "../../../config"
import { tronWeb } from "../../../infra/blockchain/tronweb"
import { DAO } from "../../../infra/database/mongo/methods"
import { getSign } from "../../../test/triggerLuckyMoney"
import { rl_create_room } from "./mutation/rl_create_room"
import { rl_deposit } from "./mutation/rl_deposit"
import { rl_get_available_rooms } from "./queries/rl_get_available_rooms"
import { rl_get_room_by_id } from "./queries/rl_get_room_by_id"
import { rl_get_user_room_history } from "./queries/rl_get_user_room_history"


const resolvers = {
    Query: {
        rl_get_room_id: () => tronWeb.sha3(new ObjectId().toHexString()),
        rl_get_available_rooms,
        rl_get_room_by_id,
        rl_get_user_room_history,
        rl_get_signature_test: (parent: any, args: any, ctx: any) => {
            const { id, size, amount, address, private_key } = args
            return getSign({ roomId: id, size, amount, signer: address, private_key, currency: CONTRACT_WTRX_ADDRESS })
        }
      
    },
    Mutation: {
        rl_create_room,
        rl_deposit,
        rl_delete_room: async (parent: any, args: any, ctx: any) => {
            const { id, address } = args
            await DAO.rooms.deleteRoom(id, address)
        }
    }
}

export { resolvers }



