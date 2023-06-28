import { getRoomDAO, RoomDAOType } from "./dao.rooms";
type DAOType = {
    rooms: RoomDAOType,
}

let DAO: DAOType = new Object() as any

const initDAO = () => {
    console.log(`init DAO ...`)
    DAO.rooms = getRoomDAO()

}

export {
    initDAO,
    DAO
}
