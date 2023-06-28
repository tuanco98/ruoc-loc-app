import { tronWeb } from "."


export const isAddressTronweb = (address: string) => tronWeb.isAddress(address)

export const getAddressByPrivateKey = (privateKey: string) => tronWeb.address.fromPrivateKey(privateKey)