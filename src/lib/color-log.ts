import { DEBUG_LEVEL, IS_DEBUG } from "../config";

const colours = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

const successConsoleLog = (msg: string) => console.log(colours.fg.green, "✔️ " + `${new Date().toUTCString()}: ${msg}`, colours.reset)
const warningConsoleLog = (msg: string) => console.log(colours.fg.yellow, "⚠️ " + `${new Date().toUTCString()}: ${msg}`, colours.reset)
const errorConsoleLog = (msg: string) => console.log(colours.fg.red, "❌ " + `${new Date().toUTCString()}: ${msg}`, colours.reset)
const debugLog = (msg: any) => { if (IS_DEBUG) console.log(colours.fg.crimson, msg, colours.reset) }

const MY_LOGGER = {
    info: (msg: any) => {
        if (DEBUG_LEVEL.includes("info") && IS_DEBUG) {
            successConsoleLog(msg?.stack || msg?.message || JSON.stringify(msg))
        }
    },
    warning: (msg: any) => {
        if (DEBUG_LEVEL.includes("warning") && IS_DEBUG) {
            warningConsoleLog(msg?.stack || msg?.message || JSON.stringify(msg))
        }
    },
    error: (msg: any) => {
        if (DEBUG_LEVEL.includes("error") && IS_DEBUG) {
            errorConsoleLog(msg?.stack || msg?.message || JSON.stringify(msg))
        }
    },
    table: (msg: any) => {
        if (DEBUG_LEVEL.includes("table") && IS_DEBUG) {
            console.table(msg)
        }
    }
}

export { colours, successConsoleLog, warningConsoleLog, errorConsoleLog, debugLog, MY_LOGGER }