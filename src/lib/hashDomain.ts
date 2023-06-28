import { tronWeb } from "../infra/blockchain/tronweb"
type DomainSeparator = any
export const hashDomain = (domains: DomainSeparator) => {
    try {
        return tronWeb.utils._TypedDataEncoder.hashDomain(domains)
    } catch (e) {
        throw e
    }
}