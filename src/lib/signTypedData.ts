import TronWeb from 'tronweb'

const tronweb = new TronWeb({
    fullNode: 'https://api.nileex.io/',
    solidityNode: 'https://api.nileex.io/',
    eventServer: 'https://event.nileex.io/',
})
const domain = {
    name: "TronSave",
    version: "1",
    chainId: "5261902794970562729723956147026966389845957733744416035036",
    verifyingContract: "0x"
}

const hash = tronweb.utils._TypedDataEncoder.hashDomain(domain)

const type1 = {
    "ForwardRequest": [
        { "name": "from", type: "address" },
        { "name": "to", type: "address" },
        { "name": "value", type: "uint256" },
        { "name": "gas", type: "uint256" },
        { "name": "nonce", type: "uint256" },
        { "name": "data", type: "bytes" },
        { "name": "validUntilTime", type: "uint256" }
    ],
}
const type2 = {
    RelayRequest: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "gas", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "validUntilTime", type: "uint256" },
        { name: "relayData", type: "RelayData" },
      ],
      RelayData: [
        { name: "bwDiscount", type: "uint256" },
        { name: "energyDiscount", type: "uint256" },
        { name: "bwPrice", type: "uint256" },
        { name: "energyPrice", type: "uint256" },
        { name: "forwarder", type: "address" },
      ],
}
// const value = {
//     "from": "TJSWYgZirmqKF59sFvaqFKspVszYRi2UBT",
//     "to": "TTmRCycurfWJe8m93WiGPqnRqVhwtVtr7a",
//     "value": "0",
//     "gas": "100000",
//     "nonce": "7",
//     "data": "0x6a5f15b1",
//     "validUntilTime": "1111111111111"
// }

export const getSign = async (value: any, type: 1 | 2, private_key: string) => {
    const types = type === 1 ? type1 : type2
    const digest = tronweb.utils._TypedDataEncoder.hash(domain, types, value);
    const sign = await tronweb.trx._signTypedData(domain, types, value, private_key)
    return sign
}