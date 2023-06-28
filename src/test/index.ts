import { utils } from "ethers"
import { connectTronWeb, tronWeb } from "../infra/blockchain/tronweb"
import { lucky_money_abi } from "../infra/blockchain/tronweb/abi/lucky_money"
import { InputDataDecoder } from "../lib/data-decode"
import { TronTxDecoder } from "../lib/tron-tx-decoder-tronweb"
import { isHexString } from "../server/apollo/helper"
import { triggerLuckyMoney } from "./triggerLuckyMoney"


const test = async () => {
    try {
        await connectTronWeb()
    const domain = {
        name: "USD Coin",
        version: "1",
        chainId: "421613",
        verifyingContract: "0x428125Ea4b54ec4AaCE8260E3dE08E0c4612F4c8"
    }
    const eip712DomainModal = [
        {
            name: "name",
            type: "string"
        },
        {
            name: "version",
            type: "string"
        },
        {
            name: "chainId",
            type: "uint256"
        },
        {
            name: "verifyingContract",
            type: "address"
        }
    ]
    const permitModal = [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
    ];

    const typesPermit = {
        // EIP712Domain: eip712DomainModal,
        Permit: permitModal,
    }
    const values = {
        owner: "0xc1468A7d6146503FC5f019464a42954ddF031098",
        spender: "0x428125Ea4b54ec4AaCE8260E3dE08E0c4612F4c8",
        value: 10000,
        nonce: 0,
        deadline: 1708164545
    }
    
    const TypedDataEncoder = tronWeb.utils._TypedDataEncoder
    const result =await  tronWeb.utils._TypedDataEncoder.hash(domain, typesPermit, values);
    console.log(result)
    } catch (e) {
        throw e
    }
    
}

test()
