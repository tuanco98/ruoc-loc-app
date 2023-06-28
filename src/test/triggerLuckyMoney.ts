import { CONTRACT_WTRX_ADDRESS } from "./../config"
import { lucky_money_contract, tronWeb } from "../infra/blockchain/tronweb"

type InputType = {
    roomId: string
    size: number
    currency: string
    amount: number
    signer: string
    private_key: string
}
export const getSign = async (input: InputType) => {
    try {
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
            roomId: input.roomId,
            size: input.size,
            currency: input.currency,
            amount: input.amount,
            signer: input.signer,
        }

        const messageReal = TypedDataEncoder.from(types).hash(message)
        var signature = (await tronWeb.trx.sign(messageReal, input.private_key)) as string
        console.log({ messageReal })
        return signature
    } catch (e) {
        throw e
    }
}
export const triggerLuckyMoney = async () => {
    try {
        const private_key1 = "b0171cb1b148922e211fff1d8de7445baf61b72c59467ac903ec59293d5a402d"
        const private_key2 = "54929ffb23a25bd365f11ed33b3ed3ab8297e7687a3bad4eeaa2bb4e154b7a4a"
        const private_key3 = "4258e2160982d421411f51028a1865415b48598a0827e6d6b4e52679d2bf421e"
        const address1 = tronWeb.address.fromPrivateKey(private_key1)
        const address2 = tronWeb.address.fromPrivateKey(private_key2)
        const address3 = tronWeb.address.fromPrivateKey(private_key3)

        const roomId = tronWeb.sha3("11")
        // const roomId = '0x5bdfd14fcc917abc2f02a30721d152a6f147f09e8cbaad4e0d5405d646c5c3e1'
        const message = {
            roomId,
            size: 3,
            currency: CONTRACT_WTRX_ADDRESS,
            amount: 1000000,
        }
        const sign1 = await getSign({ ...message, private_key: private_key1, signer: address1 })
        const sign2 = await getSign({ ...message, private_key: private_key2, signer: address2 })
        const sign3 = await getSign({ ...message, private_key: private_key3, signer: address3 })
        console.log({ sign1, sign2 })
        const room = [message.roomId, message.size, message.currency, message.amount]
        const users = [
            [address1, sign1],
            [address2, sign2],
            [address3, sign3],
        ]
        console.log('day')
        const trigger_txId = lucky_money_contract.excutePersonal(room, users).send({ feeLimit: 1e9, value: 0, useRelay: true, useSignType: "personal_trx" })
        // console.log('day2')
        // console.log({ trigger_txId })
        return trigger_txId
    } catch (e) {
        console.log(e)
        throw e
    }
}

/*
  struct Room {
2        bytes32 roomId;
3        uint8 size;
4        address currency;
5        uint256 amount;
6    }
7
8    struct User {
9        address signer;
10        bytes sig;
11    }*/
