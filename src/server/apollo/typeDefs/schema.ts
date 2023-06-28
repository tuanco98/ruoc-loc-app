import { gql } from "apollo-server";
const version = `0.0.0`

const typeDefs = gql`
    """
    API_VERSION = ${version}
    """
    scalar Date
    scalar JSON
    type RoomMember{
        address:String
        amount:Float
    }

    type SettleResultType{
        address:String
        amount:Float
    }
    
    type Room{
        id:String
        size:Int
        amount:Float
        created_at: Date
        members: [RoomMember]
        settle_result: [SettleResultType]
    }

    type GetRoomsResponse{
        total:Int
        data:[Room]
    }

    type Query{
      rl_get_available_rooms(page:Int,pageSize:Int):GetRoomsResponse
      rl_get_room_by_id(id:String!):Room
      rl_get_user_room_history(address:String!,page:Int,pageSize:Int):GetRoomsResponse
      rl_get_room_id:String
      rl_get_signature_test(id:String!,size:Int!,amount:Float!,address:String!,private_key:String!):String!
    }

    type Mutation {
        rl_create_room(id:String!,size:Int!,amount:Float!,address:String!,signature:String!,deposit_amount:Float!):Room!
        rl_delete_room(id:String!,address:String!):String
        rl_deposit(id:String!,deposit_amount:Float!address:String!,signature:String!):String!
    }
`
export {
    typeDefs,
    version
}