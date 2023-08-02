# vue3-shortkey

Плагин Vue3 для работы с клавиатурными сокращениями. По мотивам https://github.com/fgr-araujo/vue-shortkey.

## Установка
```
npm install @tequila99/vue3-shortkey
```

## Инициализация
```javascript
import shortkey from '@tequila99/vue3-shortkey'
Vue.use(shortkey)
```

В качестве опции при инициализации можно передавать список типов элементов (классов или любых других селекторов). Все элементы, соответствующих этим типам или селекторам будут пропускаться при генерации события. 
Примеры такой инициализации:

```javascript
Vue.use('vue-shortkey', { prevent: ['input', 'textarea'] })
```

```javascript
Vue.use('vue-shortkey', { prevent: ['.my-class-name', 'textarea.class-of-textarea'] })
```

**TODO:** Сделать в качестве опции передачу параметра logger, при установке которого будут выводится отладочные сообщения. Если в качестве значения параметра будет передана функция - вывод будет осуществляться через нее, если любое другое значение, приводимое к `true`,  то  `console.log`. Значение по умолчанию - false

## Список используемых клавиш

| Клавиша | соответствующая строка |
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

Для добавления к любому элементу клавиатурного сокращения используется директива v-shortkey, в качестве параметров которой передается массив строк, соответствующим нажатым клавишам. Клавиши Ctrl, Alt, Shift и Meta являются модификаторами и могут быть использованы в любых сочетаниях с другими клавишами. Сочетания клавиш являются не зависят от регистра и выбранной раскладки (русская-английская). Клавиши дополнительной цифровой клавиатуры в этой версии не задействованы.

## Примеры

<sub>Код ниже подразумевает, что комбинация клавиш Ctrl + Aдt + o будет вызывать выполнение метода 'handleAction' </sub>

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

Иногда необходимо вызов метода-обработчика как при нажатии, так и при отпускании клавиш. В этом режиме метод срабатывает при нажатии клавиш, когда клавиши отпущены - метод срабатывает снова, как триггер. Для получения подобной функциональности служит модификатор `push`. Пример ниже показывает возможный код

```html
<tooltip v-shortkey.push="['f3']" @shortkey="toggleToolTip"></tooltip>
```

### Выполнение всех обработчиков

По умолчанию событие обрабатывает и выполняется на последнем смонтированном элементе (компоненте). Чтобы выполнить все обработчики для того же клавиатурного сочетания на всех смонтированных элементах (компонентах) необходимо использовать модификатор `propagate`

<sub>Пример ниже подразумевает выполнение при нажатии Ctrl + Alt + o методов `anAction` и `aDiferrentAction`</sub>

```html
 <my-first-component v-shortkey.propagate="['ctrl', 'alt', 'o']" @shortkey="anAction"></my-first-component>
 <my--second-component v-shortkey.propagate="['ctrl', 'alt', 'o']" @shortkey="aDifferentAction"></my--second-component>
```

### Пропуск элемента (компонента)

Кроме задания списка пропускаемых при обработке типов элементов или других селекторов, существует возможность пропустить при обработке отдельный элемент используя модификатор `avoid`

<sub>Пример кода</sub>
```html
<textarea v-shortkey.avoid></textarea>
```
