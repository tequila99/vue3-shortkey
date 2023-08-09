import { describe, test, expect, vi } from 'vitest'
import Logger from '../logger.js'

describe('Тестирование логирования', () => {
  test('поведение по умолчанию (отсутсвие логирования)', () => {
    const spyInfo = vi.spyOn(console, 'info')
    const spyWarn = vi.spyOn(console, 'warn')
    const spyDebug = vi.spyOn(console, 'debug')
    const spyError = vi.spyOn(console, 'error')

    const log = Logger()

    log.info('инфо')
    expect(spyInfo).not.toHaveBeenCalled()

    log.warn('внимание')
    expect(spyWarn).not.toHaveBeenCalled()

    log.debug('отладка')
    expect(spyDebug).not.toHaveBeenCalled()

    log.error('ошибка')
    expect(spyError).not.toHaveBeenCalled()
  })

  test('логирование через console', () => {
    const spyInfo = vi.spyOn(console, 'info')
    const spyWarn = vi.spyOn(console, 'warn')
    const spyDebug = vi.spyOn(console, 'debug')
    const spyError = vi.spyOn(console, 'error')

    const log = Logger(true)

    log.info('инфо')
    expect(spyInfo).toHaveBeenCalledWith('[INFO] (vue-shortkey): инфо')

    log.warn('внимание')
    expect(spyWarn).toHaveBeenCalledWith('[WARN] (vue-shortkey): внимание')

    log.debug('отладка')
    expect(spyDebug).toHaveBeenCalledWith('[DEBUG] (vue-shortkey): отладка')

    log.error('ошибка')
    expect(spyError).toHaveBeenCalledWith('[ERROR] (vue-shortkey): ошибка')
  })

  test('логирование через внешний logger', () => {
    const logger = {
      info () {},
      warn () {},
      debug () {},
      error () {}
    }

    const spyInfo = vi.spyOn(logger, 'info')
    const spyWarn = vi.spyOn(logger, 'warn')
    const spyDebug = vi.spyOn(logger, 'debug')
    const spyError = vi.spyOn(logger, 'error')

    const log = Logger(logger)

    log.info('инфо')
    expect(spyInfo).toHaveBeenCalledWith('[INFO] (vue-shortkey): инфо')

    log.warn('внимание')
    expect(spyWarn).toHaveBeenCalledWith('[WARN] (vue-shortkey): внимание')

    log.debug('отладка')
    expect(spyDebug).toHaveBeenCalledWith('[DEBUG] (vue-shortkey): отладка')

    log.error('ошибка')
    expect(spyError).toHaveBeenCalledWith('[ERROR] (vue-shortkey): ошибка')
  })

  test('логирование через console, если внешний logger задан с ошибкой (не совпадает сигнатура)', () => {
    const logger = {
      info () { },
      warn () { },
      debug () { }
    }

    const spyInfo = vi.spyOn(console, 'info')
    const spyWarn = vi.spyOn(console, 'warn')
    const spyDebug = vi.spyOn(console, 'debug')
    const spyError = vi.spyOn(console, 'error')

    const spyLoggerInfo = vi.spyOn(logger, 'info')
    const spyLoggerWarn = vi.spyOn(logger, 'warn')
    const spyLoggerDebug = vi.spyOn(logger, 'debug')

    const log = Logger(logger)

    log.info('инфо')
    expect(spyInfo).toHaveBeenCalledWith('[INFO] (vue-shortkey): инфо')
    expect(spyLoggerInfo).not.toHaveBeenCalled()

    log.warn('внимание')
    expect(spyWarn).toHaveBeenCalledWith('[WARN] (vue-shortkey): внимание')
    expect(spyLoggerWarn).not.toHaveBeenCalled()

    log.debug('отладка')
    expect(spyDebug).toHaveBeenCalledWith('[DEBUG] (vue-shortkey): отладка')
    expect(spyLoggerDebug).not.toHaveBeenCalled()

    log.error('ошибка')
    expect(spyError).toHaveBeenCalledWith('[ERROR] (vue-shortkey): ошибка')
  })
})
