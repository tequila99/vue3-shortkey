const shortkeys = {
  ArrowUp: 'arrowup',
  ArrowRight: 'arrowright',
  ArrowDown: 'arrowdown',
  AltGraph: 'altgraph',
  Escape: 'esc',
  Enter: 'enter',
  Tab: 'tab',
  Space: 'space',
  PageUp: 'pageup',
  PageDown: 'pagedown',
  Home: 'home',
  End: 'end',
  Delete: 'del',
  Backspace: 'backspace',
  Insert: 'insert',
  NumLock: 'numlock',
  CapsLock: 'capslock',
  Pause: 'pause',
  ContextMenu: 'contextmenu',
  ScrollLock: 'scrolllock',
  BrowserHome: 'browserhome',
  MediaSelect: 'mediaselect',
  PrintScreen: 'printscreen',
  Digit0: '0',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  KeyA: 'a',
  KeyB: 'b',
  KeyC: 'c',
  KeyD: 'd',
  KeyE: 'e',
  KeyF: 'f',
  KeyG: 'g',
  KeyH: 'h',
  KeyI: 'i',
  KeyJ: 'j',
  KeyK: 'k',
  KeyL: 'l',
  KeyM: 'm',
  KeyN: 'n',
  KeyO: 'o',
  KeyP: 'p',
  KeyQ: 'q',
  KeyR: 'r',
  KeyS: 's',
  KeyT: 't',
  KeyU: 'u',
  KeyV: 'v',
  KeyW: 'w',
  KeyX: 'x',
  KeyY: 'y',
  KeyZ: 'z',
  MeatLeft: 'meta',
  MetaRight: 'meta',
  F1: 'f1',
  F2: 'f2',
  F3: 'f3',
  F4: 'f4',
  F5: 'f5',
  F6: 'f6',
  F7: 'f7',
  F8: 'f8',
  F9: 'f9',
  F10: 'f10',
  F11: 'f11',
  F12: 'f12',
  Semicolon: ';',
  Equal: '=',
  Comma: ',',
  Minus: '-',
  Period: '.',
  Slash: '/',
  Backquote: '`',
  BracketLeft: '[',
  BracketRight: ']',
  BackSlash: '\\',
  Quote: '\''
}

const createShortcutIndex = pKey => {
  let k = ''
  if (pKey.key === 'Alt' || pKey.altKey) k += 'alt'
  if (pKey.key === 'Control' || pKey.ctrlKey) k += 'ctrl'
  if (pKey.key === 'Meta' || pKey.metaKey) k += 'meta'
  if (pKey.key === 'Shift' || pKey.shiftKey) k += 'shift'
  return k + (shortkeys[pKey.code] || '')
}

export const decodeKey = pKey => createShortcutIndex(pKey)

export const encodeKey = pKey => {
  pKey = pKey.map(el => el.toLowerCase()).sort()
  const shortKey = {}
  shortKey.shiftKey = pKey.includes('shift')
  shortKey.ctrlKey = pKey.includes('ctrl')
  shortKey.metaKey = pKey.includes('meta')
  shortKey.altKey = pKey.includes('alt')
  let indexedKeys = createShortcutIndex(shortKey)
  indexedKeys += pKey.filter(item => !['shift', 'ctrl', 'meta', 'alt'].includes(item)).join('')

  return indexedKeys
}
