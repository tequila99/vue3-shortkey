/* global CustomEvent */
import { decodeKey, encodeKey } from './shortkeys.js'
import Logger from './logger.js'
let log

let objAvoided
let mapElements

let elementAvoided

let keyPressed

const dispatchShortkeyEvent = (items, k) => {
  const e = new CustomEvent('shortkey', { bubbles: false })
  const item = items.at(-1)
  log.debug(`Генерация события для '${k}'`)
  if (!item.propagate) {
    item.el.dispatchEvent(e)
    item.dispatched = true
  } else {
    items.reverse().forEach(elmItem => {
      if ((elmItem.once && elmItem.dispatched) || elmItem.push) return
      elmItem.el.dispatchEvent(e)
      elmItem.dispatched = true
    })
  }
}

const bindValue = (el, binding, idx = undefined) => {
  const {
    push = false,
    focus = false,
    once = false,
    propagate = false
  } = binding.modifiers

  if (binding.modifiers.avoid) {
    objAvoided.add(el)
    log.debug('Элемент добавлен в список пропускаемых')
  } else {
    try {
      const k = encodeKey(binding.value)
      const items = mapElements.get(k) || []
      if (idx === undefined || idx === -1) {
        items.push({
          push,
          once,
          focus,
          propagate,
          dispatched: false,
          el
        })
      } else {
        items.splice(idx, 0, {
          push,
          once,
          focus,
          propagate,
          dispatched: false,
          el
        })
      }
      mapElements.set(k, items)
      log.debug(`Привязано событие для '${k}', модификаторы: ${Object.keys(binding.modifiers).length ? Object.keys(binding.modifiers).join(', ') : 'отсутствуют'}`)
    } catch (error) {
      log.error(error.message)
    }
  }
}

const unbindValue = (el, value) => {
  let idxElm
  try {
    const k = encodeKey(value)
    const item = mapElements.get(k)
    if (!item) return
    idxElm = item.findIndex(item => item.el === el)
    if (idxElm > -1) {
      item.splice(idxElm, 1)
      if (!item.length) mapElements.delete(k)
    } else {
      mapElements.delete(k)
    }
    log.debug(`Удалена привязка для '${k}'`)
  } catch (error) {
    log.error(error.message)
  }

  return idxElm
}

const availableElement = decodedKey => {
  if (!mapElements.has(decodedKey)) return false
  if (!document.activeElement) return false
  if (objAvoided.has(document.activeElement)) return false
  if (Array.from(elementAvoided).some(selector => document.activeElement.matches(selector))) return false

  return true
}

function keyDownListener (pKey) {
  const decodedKey = decodeKey(pKey)
  if (!availableElement(decodedKey)) return
  const items = mapElements.get(decodedKey)
  if (!items) return
  pKey.preventDefault()
  pKey.stopPropagation()
  const item = items.at(-1)
  if (!item.focus) {
    if ((!item.once && !item.push) || (item.push && !keyPressed)) dispatchShortkeyEvent(items, decodedKey)
    keyPressed = true
  } else if (!keyPressed) {
    item.el.focus()
    keyPressed = true
  }
}

function keyUpListener (pKey) {
  const decodedKey = decodeKey(pKey)
  if (!availableElement(decodedKey)) return
  const items = mapElements.get(decodedKey)
  if (!items) return
  keyPressed = false
  pKey.preventDefault()
  pKey.stopPropagation()
  const item = items.at(-1)
  if ((item.once && !item.dispatched) || item.push) dispatchShortkeyEvent(items, decodedKey)
}

export default {
  install (Vue, options = {}) {
    elementAvoided = new Set(options.prevent || [])
    objAvoided = new WeakSet()
    mapElements = new Map()

    log = Logger(options.logger || false)

    document.addEventListener('keydown', keyDownListener, true)

    document.addEventListener('keyup', keyUpListener, true)

    log.info('Модуль успешно проинициализирован')

    Vue.directive('shortkey', {
      beforeMount: (el, binding) => {
        bindValue(el, binding)
      },
      updated: (el, binding) => {
        const idx = unbindValue(el, binding.oldValue)
        bindValue(el, binding, idx)
      },
      unmounted: (el, binding) => {
        unbindValue(el, binding.value)
      }
    })
  }
}
