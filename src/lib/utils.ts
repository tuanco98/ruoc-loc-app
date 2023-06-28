import { BigNumber } from "bignumber.js"
import { tronWeb } from "../infra/blockchain/tronweb"

export const sleep = async (ms: number) => {
    await new Promise((resolver, reject) => {
        setTimeout(() => resolver("OK"), ms)
    })
}


export const createRunePackArray = (runes: { runeId: number, quantity: number }[]) => {
    const results: number[] = []
    for (let rune of runes) {
        results[rune.runeId] = rune.quantity
    }
    for (let i = 0; i < 12; i++) {
        if (!results[i]) results[i] = 0
    }
    return results
}

/**
 * @param from start number
 * @param to end number
 * @returns random number in (from,to)
 */
export const randomBetween: (from: number, to: number) => number = (from: number, to: number) => {
    if (from > to) throw new Error("to must greater than from")
    const result = from + (Math.random() * (to - from))
    return result
}
export const getValuesFromArray = (arr: any[], n: number) => {
    const arr_random: number[] = []
    while (arr_random.length < n) {
        const random_index = Math.round(randomBetween(0, arr.length - 1))
        if (!arr_random.includes(random_index)) {
            arr_random.push(random_index)
        }
    }
    return arr_random.map(el => arr[el])
}

export const isAtTime = (start_time: number, dt_time: number, check_time: number) => {
    if (start_time <= check_time && start_time + dt_time > check_time) return true
    return false
}
/**
 * Get previous days of date
 * @param from 
 * @param days number of day in past
 * @returns 
 */
export const getPreviousDays = (from: Date, days: number) => {
    return new Date(from.getTime() - (days * 86400000))
}


export const getStartPreviousDays = (from: Date, days: number) => {
    return new Date(from.getTime() - (days * 86400000))
}

export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
export const generateCodeVerify = () => {
    let code: string = ''
    while (code.length < 6) {
        const number = Math.floor(Math.random() * 10)
        code += number.toString()
    }
    return code
}
export function getUniqueArr(a: any[]) {
    return Array.from(new Set(a));
}

export function lowerCase(s: string) {
    return s?.toLowerCase()
}

const emailRegex = /^[a-z][a-z0-9_\.]{4,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}.*$/
const projectNameRegex = /^([a-zA-Z0-9-\s]){0,50}$/

export const isValidEmailAddress = (email: string) => email.match(emailRegex)
export const isValidProjectName = (project_name: string) => projectNameRegex.test(project_name)

export const getPreviousAndNextMonth = (date: Date | string | number = new Date(), typeOfMonth: 'previous' | 'next', quantity: number = 1) => {
    const convertDate: typeof date = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    let new_month: number = convertDate.getUTCMonth()
    typeOfMonth === 'previous' ? new_month -= quantity : new_month += quantity
    const new_date = new Date().setUTCMonth(new_month)
    return new Date(new_date)
}
export const isLessThan = (number1: string, number2: string) => {
    return new BigNumber(number1).isLessThan(number2)
}
export const isGreaterOrEqual = (number1: string, number2: string) => {
    return new BigNumber(number1).isGreaterThanOrEqualTo(number2)
}
export const isMatch = (param1: string | number, param2: string | number) => {
    return param1 === param2
}
export const toHexAddress = (from_base58: string) => {
    return `0x${tronWeb.address.toHex(from_base58).substring(2)}`
}
export const getPreviousMonth = (date: Date | string | number = new Date()) => {
    const convertDate = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    const new_month = convertDate.getUTCMonth() - 1
    const new_date = new Date().setUTCMonth(new_month)
    return new Date(new_date)
}

export enum typeOfDate {
    firstOfMonth = 'firstOfMonth',
    lastOfMonth = 'lastOfMonth',
    startOfDay = 'startOfDay',
    endOfDay = 'endOfDay'
}

export const convertDateDayOrMonth = (date: Date | number, typeOfDay: typeOfDate) => {
    let convertedDate: typeof date = new Date(date)
    switch (typeOfDay) {
        case typeOfDate.firstOfMonth:
            convertedDate = new Date(convertedDate.getUTCFullYear(), convertedDate.getUTCMonth(), 2).setUTCHours(0, 0, 0, 0)
            break
        case typeOfDate.lastOfMonth:
            convertedDate = new Date(convertedDate.getUTCFullYear(), convertedDate.getUTCMonth() + 1, 1).setUTCHours(0, 0, 0, 0)
            break
        case typeOfDate.startOfDay:
            convertedDate = convertedDate.setUTCHours(0, 0, 0, 0)
            break
        case typeOfDate.endOfDay:
            convertedDate = convertedDate.setUTCHours(24, 0, 0, 0)
            break
    }
    return convertedDate
}
