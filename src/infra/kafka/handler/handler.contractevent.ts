import { KafkaMessage } from "kafkajs";
import { CONTRACT_LUCKY_MONEY_ADDRESS, LUCKY_MONEY_CONTRACT_START_BLOCK } from "../../../config";
import { DAO } from "../../database/mongo/methods";
import { mongo } from "../../database/mongo/mongo";
import { Sentry } from "../../logging/sentry";
import { utils } from "ethers"

let currentBlockNumber = 0
const setCurrentBlockNumber = (blockNumber: number) => {
  if (currentBlockNumber < blockNumber) {
    currentBlockNumber = blockNumber
    console.log(new Date().toISOString(), 'currentBlockNumber', currentBlockNumber);
  }
}

/*
{
  timeStamp: 1674010929000,
  triggerName: 'contractEventTrigger',
  uniqueId: 'dd2a9d01e721da7d1ed6967ecbf88cad48e805bf5d4c5567250b4706fc7f40c7_1',
  transactionId: 'dd2a9d01e721da7d1ed6967ecbf88cad48e805bf5d4c5567250b4706fc7f40c7',
  contractAddress: 'TN9D4RD8NqUyGmwxnVZ5atGQ7KSusdjQRk',
  callerAddress: '',
  originAddress: 'TKVSaJQDWeKFSEXmA44pjxduGTxyXa6B52',
  creatorAddress: 'TKVSaJQDWeKFSEXmA44pjxduGTxyXa6B52',
  blockNumber: 33414408,
  blockHash: '0000000001fddd0800b2961122abc1bc6c617be1600e2b3342359662903fdbe9',
  removed: false,
  latestSolidifiedBlockNumber: 33414389,
  logInfo: null,
  rawData: {
    address: '8585b7a594de65ac5be2e96dc6936b5fd3c869ea',
    topics: [
      '5ef48a2d985dd3f36d94bc27d80a18563c1b4073254edcf13ffcf4412b6570ab'
    ],
    data: 'ceebf77a833b30520287ddd9478ff51abbdffa30aa90a8d655dba0e8a79ce0c10000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f4240'
  },
  abi: null,
  eventSignature: 'Settle(bytes32,uint256[])',
  eventSignatureFull: 'Settle(bytes32 roomId,uint256[] amount)',
  eventName: 'Settle',
  topicMap: {},
  dataMap: {
    '1': 'ceebf77a833b30520287ddd9478ff51abbdffa30aa90a8d655dba0e8a79ce0c10000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f4240'
  }
}
*/

type ContractEventType = {
  timeStamp: number,
  blockNumber: number,
  contractAddress: string,
  eventName: string,
  transactionId: string
  dataMap: string
}

export type SettleEventDataType = {
  roomId: string
  amount: number[]
}

enum ContractNameEnum {
  Settle = "Settle"
}



export const ContractEventHandler = async (message: KafkaMessage) => {
  const session = mongo.startSession()
  try {

    const event: ContractEventType = JSON.parse(message.value?.toString() || "")

    const { blockNumber, contractAddress, eventName, transactionId } = event
    if (blockNumber < LUCKY_MONEY_CONTRACT_START_BLOCK) return
    const is_lucky_money_contract_event = contractAddress === CONTRACT_LUCKY_MONEY_ADDRESS
    if (!is_lucky_money_contract_event) return
    console.log(event)
    await session.withTransaction(async () => {
      switch (eventName) {
        case ContractNameEnum.Settle:
          const data = getSettleEventData(event)
          await DAO.rooms.settleRoom(data, transactionId, session)
          break;
        default:
          break;
      }
    })
    //Checking

  } catch (e: any) {
    if (session.inTransaction()) await session.abortTransaction()
    if (["Room not exist"].includes(e.message)) return
    Sentry.captureException(e)
    throw e
  } finally {
    await session.endSession()
  }
}


const getSettleEventData = (event: ContractEventType) => {
  const dataMap = event.dataMap[1]
  const response = utils.defaultAbiCoder.decode(["bytes32", "uint256[]"], "0x" + dataMap)
  const [roomId, amount] = response
  return {
    roomId,
    amount: amount.map(el => el.toNumber())
  } as SettleEventDataType
}