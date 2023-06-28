import { cpus } from "os"
import { IS_FORK } from "./config"
import { CaptureException } from "./infra/logging/sentry"
import { ForkServer } from "./lib/fork_system"
import { Main } from "./lib/check_status"

(async () => {
    try {
        ForkServer(Main, { is_use_fork: IS_FORK, number_of_cpu: cpus.length })
    } catch (e) {
        CaptureException(e, {})
    }
})()