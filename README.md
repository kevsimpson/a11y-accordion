# @kevsimpson/accordion

[![npm (scoped)](https://img.shields.io/npm/v/@kevsimpson/accordion.svg)](https://www.npmjs.com/package/@kevsimpson/accordion)

> Modern accessible accordion

## Install

```
$ npm install @kevsimpson/accordion
```

Accordions rely on header and panel pairs, wrapped in a single container.

```html
<div class="c-accordion js-accordion">
    <h2 id="accordion-header-1" class="c-accordion__header js-accordion__header">Accordion header 1</h2>
    <div id="accordion-panel-1" class="c-accordion__panel js-accordion__panel">
        ...
    </div>
    <h2 id="accordion-header-2" class="c-accordion__header js-accordion__header">Accordion header 2</h2>
    <div id="accordion-panel-2" class="c-accordion__panel js-accordion__panel">
        ...
    </div>
    <h2 id="accordion-header-3" class="c-accordion__header js-accordion__header">Accordion header 3</h2>
    <div id="accordion-panel-3" class="c-accordion__panel js-accordion__panel">
        ...
    </div>
</div>

```

An accordion effect can be achieved with minimal `SCSS` styles.

```scss
.c-accordion__panel {
    &[aria-hidden="true"] {
        height: 0;
        opacity: 0;
        pointer-events: none;
    }

    &[aria-hidden="false"] {
        opacity: 1;
    }
}

.c-accordion--is-ready {
    .c-accordion__header {
        cursor: pointer;
    }

    .c-accordion__panel {
        overflow: hidden;
        will-change: height, opacity;
        transition:
            height 0.25s ease-out,
            opacity 0.25s ease-out;
    }
}
```

## Usage

```js
const myAccordion = new Accordion(document.querySelector('.js-accordion'));
```

## Methods

```js
// remove all bindings and attributes when no longer required
myAccordion.destroy();

// re-initialise if necessary
myAccordion.init();
```

## Options

```js
const accordionContainer = document.querySelector('.js-accordion');
const myAccordion = Fraccordion(accordionContainer, {
    // String - Accordion header elements converted to focusable, togglable elements
    headerSelector: '.js-accordion__header',

    // String - Use header id on element to tie each accordion panel to its header - see panelIdPrefix
    headerIdPrefix: 'accordion-header',

    // String - Accordion panel elements to expand/collapse
    panelSelector: '.js-accordion__panel',

    // String - Use panel id on element to tie each accordion header to its panel - see headerIdPrefix
    panelIdPrefix: 'accordion-panel',

    // Boolean - If set to false, all accordion panels will be closed on init()
    isFirstPanelOpen: true,

    // Boolean - If set to false, each accordion instance will only allow a single panel to be open at a time
    isMultiSelectable: true,

    // String - Class name that will be added to the selector when the component has been initialised
    readyClass: 'c-accordion--is-ready',
});
```

---

> Inspired by [Frend.co](https://frend.co)
