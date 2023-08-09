import { beforeEach, describe, test, expect, vi } from 'vitest'
import { createApp, nextTick } from 'vue/dist/vue.esm-bundler'

import Shortkey from '../index.js'

const createEvent = (name = 'keydown') => new Event(name, { cancelable: true })

const mockHandler = vi.fn(val => val)
const mockOtherHandler = vi.fn(val => val)

const methods = {
  handle: mockHandler,
  otherHandle: mockOtherHandler,
  setCalled () { this.called = !this.called }
}
const VM = template => createApp({
  template,
  data () {
    return {
      called: false
    }
  },
  methods
}).use(Shortkey, { prevent: ['.disableshortkey', '.disableshortkey textarea'] })

const createDiv = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  return div
}

beforeEach(() => {
  vi.clearAllMocks()
})

test('single event. Common user case', () => {
  mockHandler.mockClear()
  const vm = VM('<div @shortkey="handle" v-shortkey="[\'q\']"></div>')
  vm.mount(createDiv())

  const keydown = createEvent('keydown')
  keydown.code = 'KeyQ'
  document.dispatchEvent(keydown)

  const keyup = createEvent('keyup')
  keyup.code = 'KeyQ'
  document.dispatchEvent(keyup)

  expect(mockHandler).toHaveBeenCalledTimes(1)

  vm.unmount()
})

test('single event. unbind simple events', () => {
  const vm = VM('<div @shortkey="handle" v-shortkey="[\'w\']"></div>')
  vm.mount(createDiv())

  vm.unmount()

  const keydown = createEvent('keydown')
  keydown.code = 'KeyW'
  document.dispatchEvent(keydown)
  const keyup = createEvent('keyup')
  keyup.code = 'KeyW'
  document.dispatchEvent(keyup)

  expect(mockHandler).not.toHaveBeenCalled()
})

test('dont trigger listen for keydown and dispatch event', () => {
  const vm = VM('<div @shortkey="handle" v-shortkey="[\'b\']"><textarea v-shortkey.avoid></textarea></div>')
  const root = vm.mount(createDiv())

  const textarea = root.$el.querySelector('textarea')
  textarea.focus()
  expect(document.activeElement === textarea).toBe(true)

  const keydown = createEvent('keydown')
  keydown.code = 'KeyB'
  document.dispatchEvent(keydown)

  const keyup = createEvent('keyup')
  keyup.code = 'KeyB'
  document.dispatchEvent(keyup)

  expect(mockHandler).not.toHaveBeenCalled()
  vm.unmount()
})

test('does not trigger events when its class is in the prevent list', () => {
  const vm = VM('<div @shortkey="handle" v-shortkey="[\'e\']"><textarea class="disableshortkey"></textarea></div>')
  const root = vm.mount(createDiv())

  const textarea = root.$el.querySelector('textarea')
  textarea.focus()
  expect(document.activeElement === textarea).toBe(true)

  const keydown = createEvent('keydown')
  keydown.code = 'KeyE'
  document.dispatchEvent(keydown)

  const keyup = createEvent('keyup')
  keyup.code = 'KeyE'
  document.dispatchEvent(keyup)

  expect(mockHandler).not.toHaveBeenCalled()
  vm.unmount()
})

test('does not trigger events when one of its classes is in the prevent list', () => {
  const vm = VM('<div @shortkey="handle" v-shortkey="[\'r\']"><textarea class="disableshortkey stylingclass"></textarea></div>')
  const root = vm.mount(createDiv())

  const textarea = root.$el.querySelector('textarea')
  textarea.focus()
  expect(document.activeElement === textarea).toBe(true)

  const keydown = createEvent('keydown')
  keydown.code = 'KeyR'
  document.dispatchEvent(keydown)

  const keyup = createEvent('keyup')
  keyup.code = 'KeyR'
  document.dispatchEvent(keyup)

  expect(mockHandler).not.toHaveBeenCalled()
  vm.unmount()
})

test('does not trigger events when it gets matched by one item in the prevent list', () => {
  const vm = VM('<div @shortkey="handle" v-shortkey="[\'t\']" class="disableshortkey"><textarea class="stylingclass"></textarea></div>')
  const root = vm.mount(createDiv())

  const textarea = root.$el.querySelector('textarea')
  textarea.focus()
  expect(document.activeElement === textarea).toBe(true)

  const keydown = createEvent('keydown')
  keydown.code = 'KeyT'
  document.dispatchEvent(keydown)

  const keyup = createEvent('keyup')
  keyup.code = 'KeyT'
  document.dispatchEvent(keyup)

  expect(mockHandler).not.toHaveBeenCalled()
  vm.unmount()
})

test('does trigger events when only the parent element gets matched by one item in the prevent list', () => {
  const vm = VM('<div @shortkey="handle" v-shortkey="[\'h\']" class="disableshortkey"><input type="text" /></div>')
  const root = vm.mount(createDiv())

  const input = root.$el.querySelector('input')
  input.focus()
  expect(document.activeElement === input).toBe(true)

  const keydown = createEvent('keydown')
  keydown.code = 'KeyH'
  document.dispatchEvent(keydown)

  const keyup = createEvent('keyup')
  keyup.code = 'KeyH'
  document.dispatchEvent(keyup)

  expect(mockHandler).toHaveBeenCalledTimes(1)

  vm.unmount()
})

describe('Test "propagate" modifier', () => {
  test('trigger listen for keydown and not propagate event to all listeners when modifier is not present', () => {
    const vm = VM(`<div>
        <button type="button" class="foo" @shortkey="handle" v-shortkey="['c']">FOO</button>
        <button type="button" class="bar" @shortkey="otherHandle" v-shortkey="['c']">BAR</button>
      </div>`)

    const root = vm.mount(createDiv())

    const buttonBar = root.$el.querySelector('button.bar')
    buttonBar.focus()
    expect(document.activeElement === buttonBar).toBe(true)

    const keydown = createEvent('keydown')
    keydown.code = 'KeyC'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.code = 'KeyC'
    document.dispatchEvent(keyup)

    expect(mockHandler).not.toHaveBeenCalled()
    expect(mockOtherHandler).toHaveBeenCalledTimes(1)

    vm.unmount()
  })

  test('trigger listen for keydown and propagate event to all listeners when modifier is present', async () => {
    const vm = VM(`<div>
        <button type="button" class="foo" @shortkey="handle" v-shortkey="['c']">FOO</button>
        <button v-if="called" type="button" class="bar" @shortkey="otherHandle" v-shortkey.propagate="['c']">BAR</button>
      </div>`)

    const root = vm.mount(createDiv())
    root.called = true

    await nextTick()

    const buttonBar = root.$el.querySelector('button.bar')
    buttonBar.focus()
    expect(document.activeElement === buttonBar).toBe(true)

    const keydown = createEvent('keydown')
    keydown.code = 'KeyC'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.code = 'KeyC'
    document.dispatchEvent(keyup)

    expect(mockHandler).toHaveBeenCalledTimes(1)
    expect(mockOtherHandler).toHaveBeenCalledTimes(1)

    vm.unmount()
  })

  test('trigger listen for keydown and propagate event to all listeners when modifier is present on the first element', () => {
    const vm = VM(`<div>
        <button type="button" class="foo" @shortkey="handle" v-shortkey.propagate="['c']">FOO</button>
        <button type="button" class="bar" @shortkey="otherHandle" v-shortkey="['c']">BAR</button>
      </div>`)

    const root = vm.mount(createDiv())

    const buttonFoo = root.$el.querySelector('button.foo')
    buttonFoo.focus()
    expect(document.activeElement === buttonFoo).toBe(true)

    const keydown = createEvent('keydown')
    keydown.code = 'KeyC'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.code = 'KeyC'
    document.dispatchEvent(keyup)

    expect(mockHandler).not.toHaveBeenCalled()
    expect(mockOtherHandler).toHaveBeenCalled()

    vm.unmount()
  })
})

describe('тест модификатора focus', () => {
  test('установка фокуса по модификатору .focus', () => {
    const vm = VM('<div><input type="text" /> <button type="button" v-shortkey.focus="[\'f\']">BUTTON</button></div>')
    const root = vm.mount(createDiv())

    const inputText = root.$el.querySelector('input')
    inputText.focus()
    expect(document.activeElement === inputText).toBe(true)

    const keydown = createEvent('keydown')
    keydown.code = 'KeyF'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.code = 'KeyF'
    document.dispatchEvent(keyup)

    const buttonInput = root.$el.querySelector('button')
    expect(document.activeElement === buttonInput).toBe(true)

    vm.unmount()
  })
})

describe('тест модификатора push', () => {
  test('эмуляция кнопки без фиксации с .push модификатором', () => {
    mockHandler.mockReset()
    const vm = VM('<div><button type="button" v-shortkey.push="[\'p\']" @shortkey="handle">BUTTON</button></div>')
    vm.mount(createDiv())

    const keydown = createEvent('keydown')
    keydown.code = 'KeyP'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.code = 'KeyP'
    document.dispatchEvent(keyup)

    expect(mockHandler).toHaveBeenCalledTimes(2)

    vm.unmount()
  })
})

describe('тест всяких неоднозначных клавиш', () => {
  test('клавиша Del', () => {
    const vm = VM('<button @shortkey="handle" v-shortkey="[\'del\']"></button>')
    vm.mount(createDiv())

    const keydown = createEvent('keydown')
    keydown.code = 'Delete'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.code = 'Delete'
    document.dispatchEvent(keyup)

    expect(mockHandler).toHaveBeenCalledOnce()
    vm.unmount()
  })
})

describe('тест модификатора once', () => {
  test('без модификатора once срабатывает несколько раз при повторном нажатии', () => {
    const vm = VM('<button @shortkey="handle" v-shortkey="[\'del\']"></button>')
    vm.mount(createDiv())

    const keydown = createEvent('keydown')
    keydown.code = 'Delete'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.code = 'Delete'
    document.dispatchEvent(keyup)

    const keydownNext = createEvent('keydown')
    keydownNext.code = 'Delete'
    document.dispatchEvent(keydownNext)

    const keyupNext = createEvent('keyup')
    keyupNext.code = 'Delete'
    document.dispatchEvent(keyupNext)

    expect(mockHandler).toHaveBeenCalledTimes(2)
    vm.unmount()
  })

  test('c модификатором once срабатывает только один раз даже при повторном нажатии', () => {
    const vm = VM('<button @shortkey="handle" v-shortkey.once="[\'del\']"></button>')
    vm.mount(createDiv())

    const keydown = createEvent('keydown')
    keydown.code = 'Delete'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keyup.code = 'Delete'
    document.dispatchEvent(keyup)

    const keydownNext = createEvent('keydown')
    keydownNext.code = 'Delete'
    document.dispatchEvent(keydownNext)

    const keyupNext = createEvent('keyup')
    keyupNext.code = 'Delete'
    document.dispatchEvent(keyupNext)

    expect(mockHandler).toHaveBeenCalledOnce()
    vm.unmount()
  })
})

describe('Проверка обновления binding в событии updated', () => {
  test('смена видимости компонентов', async () => {
    const vm = VM(`<div>
                      <div v-if="!called" class="first" @shortkey="setCalled" v-shortkey="['q']">foo</div>
                      <div v-else         class="test"  @shortkey="setCalled" v-shortkey="['g']">bar</div>
                    </div>`)
    const root = vm.mount(createDiv())
    const keydown = createEvent('keydown')
    keydown.code = 'KeyQ'
    document.dispatchEvent(keydown)

    const keyup = createEvent('keyup')
    keydown.code = 'KeyQ'
    document.dispatchEvent(keyup)

    expect(root.called).toBe(true)
    await nextTick()
    const keydownNext = createEvent('keydown')
    keydownNext.code = 'KeyG'
    document.dispatchEvent(keydownNext)

    const keyupNext = createEvent('keyup')
    keyupNext.code = 'KeyG'
    document.dispatchEvent(keyupNext)

    expect(root.called).toBe(false)
    vm.unmount()
  })
})
