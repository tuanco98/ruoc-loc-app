import { connectTronWeb, tronWeb } from "../infra/blockchain/tronweb"
import { TronTxDecoder } from "../lib/tron-tx-decoder-tronweb"

(async()=>{
    try {
        await connectTronWeb()
        const tx_decode = new TronTxDecoder(tronWeb)
        console.log(await tx_decode.decodeRevertMessage('875f36beac96ca830383a38ccb8a037e07ecdb073b84dbdd2a644e45ae9efcb7'))
    } catch (e) {
        throw e
    }
})()