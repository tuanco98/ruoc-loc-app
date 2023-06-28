import { tronWeb } from "."

type TronTransactionInfoType = {
    id: string
    fee: number
    blockNumber: number
    blockTimeStamp: number
    contractResult: string[]
    contract_address: string
    receipt: {
        energy_fee?: number
        energy_usage_total?: number
        net_fee?: number
        net_usage?: number
        result?: string
        energy_penalty_total?: number
    },
    log: {
        address: string
        topics: string[]
        data: string
    }
    packingFee: number
}

const getTransactionInfo = async (hex: string) => {
    const data = await tronWeb.trx.getTransactionInfo(hex) as TronTransactionInfoType
    return data
}

type TronTransactionType = {
    ret: { contractRet: "SUCCESS" | string }[],
    signature: string[],
    txID: string,
    raw_data: {
        contract: {
            parameter: {
                value: {
                    amount?: number
                    data?: string,
                    owner_address: string,
                    contract_address?: string,
                    to_address?: string
                },
                type_url: string
            },
            type: "TriggerSmartContract" | "TransferContract"
        }[],
        ref_block_bytes: string
        ref_block_hash: string
        expiration: number
        fee_limit: number
        timestamp: number
    },
    raw_data_hex: string
}

const getTransaction = async (hex: string) => {
    const data = await tronWeb.trx.getTransaction(hex) as TronTransactionType
    return data
}

const getTronAddressFromHex = (hex: string) => tronWeb.address.fromHex(hex)

export { getTransactionInfo, getTransaction, TronTransactionType, getTronAddressFromHex }