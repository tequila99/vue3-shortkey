const PKG = 'vue-shortkey'

export default (logger = false) => {
  let log = console
  if (!!logger && ['info', 'debug', 'warn', 'error'].every(el => typeof logger[el] === 'function')) log = logger
  const enableLogging = !!logger

  return {
    info (message) {
      if (!enableLogging) return
      log.info(`[INFO] (${PKG}): ${message}`)
    },
    debug (message) {
      if (!enableLogging) return
      log.debug(`[DEBUG] (${PKG}): ${message}`)
    },
    warn (message) {
      if (!enableLogging) return
      log.warn(`[WARN] (${PKG}): ${message}`)
    },
    error (message) {
      if (!enableLogging) return
      log.error(`[ERROR] (${PKG}): ${message}`)
    }
  }
}
