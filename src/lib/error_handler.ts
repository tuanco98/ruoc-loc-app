import { IS_DEBUG, SERVER_CODE } from "../config"
import { CaptureException } from "../infra/logging/sentry"
import { HTTP_ERROR_CODE } from "./http-error"

export const genCodeName = (msg: string, add_msg?: string) => `${SERVER_CODE}:${msg} ${ErrCodeMessage[SERVER_CODE + msg]} ${add_msg || ""}`

export const ErrMsg = (msg: string, add_msg?: string) => {
    const gen = genCodeName(msg, add_msg)
    return new Error(gen)
}
export const validateMissing = (object: any) => {
    for (let el in object) {
        if (object[el] === null || object[el] === undefined || object[el] === "") throw ErrMsg(ERROR_CODE.MISSING_PARAMS, el)
    }
}

/**
 * Show the error and capture exception to Sentry
 * @param e error 
 * @param args params of user 
 * @param funcName Name of function
 */

export function ErrorHandler(e: any, args: any, funcName: string) {
    let { message } = e
    if (!message) message = ""
    const { password, ...params } = args
    if (message.startsWith(`${SERVER_CODE}:`)) {
        if (IS_DEBUG) {
            const errCode = message.substring(0, SERVER_CODE.length) + message.substring(SERVER_CODE.length + 1);
            console.log('\n========================================================================================\n')
            console.log('\x1b[33m%s\x1b[0m', `⚠️  WARNING : EXPECTED ERROR HAPPENED!\n`)
            console.log('Function:', funcName)
            console.log(`Argument:`, JSON.parse(JSON.stringify(params)))
            console.log(`Message:`, ErrCodeMessage[errCode] ? ErrCodeMessage[errCode] : message.substring(SERVER_CODE.length + 1))
            console.log(`Stack:`, e.stack)
            console.log('\n========================================================================================')
        }
    } else {
        console.log('\n========================================================================================\n')
        console.log('\x1b[31m%s\x1b[0m', `🔥  🔥  🔥  DANGER : UNEXPECTED ERROR HAPPENED!\n `)
        console.log('Function:', funcName)
        console.log(`Argument:`, JSON.parse(JSON.stringify(params)))
        console.log(`Stack:`, e?.stack)
        console.log('\n========================================================================================')
        CaptureException(e, { args: JSON.parse(JSON.stringify(args)) }, false)
    }
    // throw e
}

const ErrCodeMessage = {
    RLU000: "UNEXPECTED_ERROR",
    RLU100: "SIGNATURE_INVALID",
    RLU101: "AUTHORIZATION_REQUIRED",
    RLU102: "HEADER_ADDRESS_REQUIRED",
    RLU103: "ADMIN_REQUIRED",
    RLU104: "SIGNATURE_OUTDATE",

    RLU200: "SIGNATURE_INVALID",
    RLU201: "DOMAIN_NOT_EXIST",
    RLU202: "MUST_APPROVE_FIRST",
    RLU203: "INSUFFICIENT_WTRX",
    RLU204: "INVALID_API_KEY",
    RLU205: "INSUFFICIENT_BALANCE",
    RLU206: "INVALID_PAYMENT_METHOD",

    RLU212: "ADDRESS_INVALID",
    RLU213: "DURATION_INVALID",

    RLU400: "MISSING_PARAMS",
    RLU401: "INVALID_PAGE",
    RLU402: "INVALID_PAGESIZE",
    RLU403: "INVALID_VALID_UNTIL_TIME",
    RLU404: "INVALID_ERC20_ADDRESS",
    RLU405: "INVALID_VALUE",
    RLU406: "USER_NOT_EXIST",
    RLU407: "BALANCE_IS_NOT_ENOUGH",
    RLU408: "INVALID_PARAMS",
    RLU409: "PROJECT_NOT_EXISTS",
    RLU410: "ROOM_EXISTS",
    RLU411: "TRANSACTION_IS_NOT_TRANSFER_TRX",
    RLU412: "TRANSACTION_IS_NOT_VALID_TRANSFER_TRX",
    RLU413: "RATE_LIMIT",
    RLU414: "MIN_TRANSFER_AMOUNT",

    RLU501: "SERVER_MAINTAINED",
}

export const ERROR_CODE = {
    //==========UNEXPECTED ERROR==========
    UNEXPECTED_ERROR: '000',
    SUCCESS: '001',
    //==========AUTH==============
    AUTHORIZATION_REQUIRED: '101',
    HEADER_ADDRESS_REQUIRED: '102',
    SIGNATURE_OUTDATE: '104',

    //==========FETCH DATA==========
    SIGNATURE_INVALID: '200',
    DOMAIN_NOT_EXIST: '201',
    MUST_APPROVE_FIRST: "202",
    INSUFFICIENT_WTRX: "203",
    INVALID_API_KEY: "204",
    INSUFFICIENT_BALANCE: "205",
    INVALID_PAYMENT_METHOD: "206",
    ADDRESS_INVALID: '212',
    DURATION_INVALID: '213',
    //==========PARAMS==============
    MISSING_PARAMS: '400',
    INVALID_PAGE: '401',
    INVALID_PAGESIZE: '402',
    INVALID_VALID_UNTIL_TIME: '403',
    INVALID_VALUE: '405',
    USER_NOT_EXIST: '406',
    INVALID_PARAMS: '408',
    PROJECT_NOT_EXISTS: '409',
    ROOM_EXISTS: '410',
    TRANSACTION_IS_NOT_TRANSFER_TRX: '411',
    TRANSACTION_IS_NOT_VALID_TRANSFER_TRX: '412',
    RATE_LIMIT: '413',
    MIN_TRANSFER_AMOUNT: '414',
    //==========SERVER==============
    SERVER_MAINTAINED: '501',
    //==========BUSINESS==============
}

export const getHTTPErrorCode = (e: Error) => {
    const start_message = e.message.substring(0, SERVER_CODE.length + 2)
    switch (start_message) {
        case `${SERVER_CODE}:1`:
            return HTTP_ERROR_CODE.OK_200
        case `${SERVER_CODE}:2`:
            return HTTP_ERROR_CODE.OK_200
        case `${SERVER_CODE}:4`:
            return HTTP_ERROR_CODE.BAD_REQUEST_400
        default:
            return HTTP_ERROR_CODE.OK_200
    }
}

export const getErrorMessage = (error_code: string) => {
    const code_name = `${SERVER_CODE}${error_code}`
    return ErrCodeMessage[code_name]
}

