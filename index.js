/* global CustomEvent */
import { decodeKey, encodeKey } from './shortkeys.js'

const objAvoided = new WeakSet()
const mapElements = new Map()

let elementAvoided

let keyPressed

const dispatchShortkeyEvent = items => {
  const e = new CustomEvent('shortkey', { bubbles: false })
  const item = items.at(-1)
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

const bindValue = (el, binding) => {
  const {
    push = false,
    focus = false,
    once = false,
    propagate = false
  } = binding.modifiers

  if (binding.modifiers.avoid) {
    objAvoided.add(el)
  } else {
    const k = encodeKey(binding.value)
    const item = mapElements.get(k) || []
    item.push({
      push,
      once,
      focus,
      propagate,
      dispatched: false,
      el
    })
    mapElements.set(k, item)
  }
}

const unbindValue = (el, { oldValue = [] }) => {
  const k = encodeKey(oldValue)
  const item = mapElements.get(k)
  if (!item) return
  const idxElm = item.findIndex(item => item.el === el)
  if (idxElm > -1) {
    item.splice(idxElm, 1)
  } else {
    mapElements.delete(k)
  }
}

const availableElement = decodedKey => {
  if (!mapElements.has(decodedKey)) return false
  if (!document.activeElement) return false
  if (objAvoided.has(document.activeElement)) return false
  if (Array.from(elementAvoided).some(selector => document.activeElement.matches(selector))) return false

  return true
}

export default {
  install (Vue, options = {}) {
    elementAvoided = new Set(options.prevent || [])

    document.addEventListener('keydown', pKey => {
      const decodedKey = decodeKey(pKey)
      if (!availableElement(decodedKey)) return
      const items = mapElements.get(decodedKey)
      if (!items) return
      pKey.preventDefault()
      pKey.stopPropagation()
      const item = items.at(-1)
      if (!item.focus) {
        if ((!item.once && !item.push) || (item.push && !keyPressed)) dispatchShortkeyEvent(items)
        keyPressed = true
      } else if (!keyPressed) {
        item.el.focus()
        keyPressed = true
      }
    }, true)

    document.addEventListener('keyup', pKey => {
      const decodedKey = decodeKey(pKey)
      if (!availableElement(decodedKey)) return
      const items = mapElements.get(decodedKey)
      if (!items) return
      keyPressed = false
      pKey.preventDefault()
      pKey.stopPropagation()
      const item = items.at(-1)
      if ((item.once && !item.dispatched) || item.push) dispatchShortkeyEvent(items)
    }, true)

    Vue.directive('shortkey', {
      beforeMount: (el, binding) => {
        bindValue(el, binding)
      },
      updated: (el, binding) => {
        unbindValue(el, binding)
        bindValue(el, binding)
      },
      unmounted: (el, binding) => {
        unbindValue(el, binding)
      }
    })
  }
}
