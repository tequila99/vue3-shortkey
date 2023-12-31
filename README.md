# vue3-shortkey

Плагин Vue3 для вызова событий по нажатию клавиш, как отдельных, так и в различных сочетаниях. По мотивам https://github.com/fgr-araujo/vue-shortkey.

## Установка
```
npm install @tequila99/vue3-shortkey
```

## Инициализация
```javascript
import shortkey from '@tequila99/vue3-shortkey'
Vue.use(shortkey)
```

В качестве опции при инициализации можно передавать список типов элементов (классов или любых других селекторов). Все элементы, соответствующие этим типам или селекторам будут пропускаться при генерации события. 

Примеры:

```javascript
Vue.use('vue-shortkey', { prevent: ['input', 'textarea'] })
```

```javascript
Vue.use('vue-shortkey', { prevent: ['.my-class-name', 'textarea.class-of-textarea'] })
```

## Используемые клавиши

Для добавления к любому элементу клавиатурного сокращения используется директива v-shortkey. В качестве параметров ей передается массив строк, соответствующих нажатым клавишам. Клавиши Ctrl, Alt, Shift и Meta являются модификаторами и могут быть использованы в любых сочетаниях с другими клавишами. Сочетания клавиш не зависят от регистра и выбранной раскладки (русская-английская). Клавиши дополнительной цифровой клавиатуры в этой версии не задействованы.

| Клавиша | Строка в параметрах|
|---------|------------------------|
|ArrowUp   |'arrowup'               |
|ArrowRight|'arrowright'           |
|ArrowDown| 'arrowdown'|
|AltGraph| 'altgraph'|
|Escape| 'esc'|
|Enter| 'enter'|
|Tab| 'tab'|
|Space| 'space'|
|PageUp| 'pageup'|
|PageDown| 'pagedown'|
|Home| 'home'|
|End| 'end'|
|Delete| 'del'|
|Backspace| 'backspace'|
|Insert| 'insert'|
|NumLock| 'numlock'|
|CapsLock| 'capslock'|
|Pause| 'pause'|
|ContextMenu| 'contextmenu'|
|ScrollLock| 'scrolllock'|
|BrowserHome| 'browserhome'|
|MediaSelect| 'mediaselect'|
|PrintScreen| 'printscreen'|
|0-1| '0'-'9'|
|A-Z| 'a'= 'z'|
|F1-F12| 'f1'-'f12'|
|;| ';'|
|=| '='|
|,| ','|
|-| '-'|
|.| '.'|
|/| '/'|
|`| '`'|
|[ | '['|
|]| ']'|
|'| '''

## Примеры использования

### Поведение по умолчанию

<sub>Код ниже подразумевает, что комбинация клавиш Ctrl + Alt + o будет вызывать выполнение метода 'handleAction' </sub>

```html
<button v-shortkey="['ctrl', 'alt', 'o']" @shortkey="handleAction">Open</button>
```

Метод, указанный в событии __@shortkey__  будет вызываться каждый раз при нажатии клавиш. При необходимости вызвать этот метод только один раз, можно применить модификатор `once`
```html
<button v-shortkey.once="['ctrl', 'alt', 'o']" @shortkey="theAction">Open</button>
```
### Установка фокуса
С помощью клавиатурных сокращений можно легко установить фокус на необходимый элемент

<sub>Код ниже подразумевает, что сочетание клавиш Alt + I установит фокус на поле ввода</sub>

```html
<input type="text" v-shortkey.focus="['alt', 'i']" v-model="name" />
```

### Режим клавиатуры

Иногда необходимо вызвать метода-обработчик как при нажатии, так и при отпускании клавиш. Т.е. первоначально метод срабатывает при нажатии клавиш, когда же клавиши отпущены - метод срабатывает снова, как триггер. Для использования такого режима служит модификатор `push`. 

Пример ниже показывает возможный код

```html
<tooltip v-shortkey.push="['f3']" @shortkey="toggleToolTip"></tooltip>
```

### Выполнение всех обработчиков

По умолчанию событие обрабатывает и выполняется на последнем смонтированном элементе (компоненте). Чтобы выполнить все обработчики для того же клавиатурного сочетания на всех смонтированных элементах (компонентах) необходимо использовать модификатор `propagate`

<sub>Пример ниже подразумевает выполнение при нажатии Ctrl + Alt + o методов `anAction` и `aDiferrentAction`</sub>

```html
 <my-first-component v-shortkey.propagate="['ctrl', 'alt', 'o']" @shortkey="anAction"></my-first-component>
 <my-second-component v-shortkey.propagate="['ctrl', 'alt', 'o']" @shortkey="aDifferentAction"></my-second-component>
```

### Пропуск отдельного элемента (компонента)

Кроме задания списка пропускаемых при обработке типов элементов или других селекторов, существует возможность пропустить при обработке отдельный элемент используя модификатор `avoid`

<sub>Пример кода</sub>
```html
<textarea v-shortkey.avoid></textarea>
```
## Логи

Добавлена возможность выводить логи и другие сообщения. Для этого предназначен параметр `logger` при инициализации плагина. Значение по умолчанию - `false`, т.е. в консоль ничего не выводится.

Пример инициализации

```javascript
import shortkey from '@tequila99/vue3-shortkey'
Vue.use(shortkey, { logger: true })
```

в этом случае для вывода логов будет использоваться стандартная утилита `console`. 

В качестве `logger` может быть использован объект, содержащий в себе методы `info`, `error`, `warn` и `debug`.

пример:

```javascript
import shortkey from '@tequila99/vue3-shortkey'

const logger = {
  info (message) { console.log(message) },
  error (message) { console.log(message) },
  warn (message) { console.log(message) },
  debug (message) { console.log(message) }
}

Vue.use(shortkey, { logger })
```

если сигнатура объекта `logger` не соответствует ожидаемой (к примеру отсутствует один или несколько вышеуказанных методов) - вывод логов будет включен, но для вывода будет использоваться стандартная утилита `console`

## Тесты

Запуск тестов 

```
npm run test
```
## TODO 
- сделать возможность управления уровнем детализации логов. К примеру выводить только ошибки
- больше тестов богу тестов. :-) Придумать еще кучу граничных ситуаций и покрыть их тестами.
- задействовать дополнительную цифровую клавиатуру (numpad)