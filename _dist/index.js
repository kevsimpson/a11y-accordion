/* eslint-disable no-param-reassign */

class Accordion {
    constructor(accordionContainer, {
        headerSelector = '.js-accordion__header',
        headerIdPrefix = 'accordion-header',
        panelSelector = '.js-accordion__panel',
        panelIdPrefix = 'accordion-panel',
        isFirstPanelOpen = true,
        isMultiSelectable = true,
        readyClass = 'c-accordion--is-ready',
    } = {}) {
        if (!accordionContainer) {
            console.error('Accordion container node is required'); // eslint-disable-line
            return;
        }

        this.accordionContainer = accordionContainer;
        this.headers = [...accordionContainer.querySelectorAll(headerSelector)];
        this.panels = [...accordionContainer.querySelectorAll(panelSelector)];

        this.headerIdPrefix = headerIdPrefix;
        this.panelIdPrefix = panelIdPrefix;
        this.isFirstPanelOpen = isFirstPanelOpen;
        this.isMultiSelectable = isMultiSelectable;
        this.readyClass = readyClass;

        this.bindMethods();
    }

    static getPanelHeight(panel) {
        panel.style.height = 'auto';
        const panelHeight = panel.offsetHeight;
        panel.style.height = '';
        return panelHeight;
    }

    static setPanelHeight(panel) {
        panel.addEventListener('transitionend', () => {
            panel.style.transition = 'none';
            panel.style.height = '';
            panel.getBoundingClientRect();
            panel.style.transition = '';
        }, {
            once: true,
            passive: true,
            capture: true,
        });

        const panelHeight = this.getPanelHeight(panel);
        panel.getBoundingClientRect();
        panel.style.height = `${panelHeight}px`;
    }

    static unsetPanelHeight(panel) {
        const panelHeight = this.getPanelHeight(panel);
        panel.style.height = `${panelHeight}px`;
        panel.getBoundingClientRect();
        panel.style.height = 0;
    }

    setHeaderFocus(index) {
        // remove focusability from inactive headers
        this.headers.forEach((header) => {
            header.setAttribute('tabindex', -1);
        });
        // set active header focus
        this.headers[index].setAttribute('tabindex', 0);
        this.headers[index].focus();
    }


    eventHeaderClick(event) {
        this.togglePanel(event.target);
    }

    eventHeaderKeyUp(event) {
        const currentHeader = event.target;
        const isModifierKey = event.metaKey || event.altKey;
        const currentHeaderIndex = [].indexOf.call(this.headers, currentHeader);

        // don't catch key events when ⌘ or Alt modifier is present
        if (isModifierKey) return;

        // catch enter/space, left/right and up/down arrow key events
        // if new panel show it, if next/prev move focus
        switch (event.keyCode) {
        case 13:
        case 32:
            this.togglePanel(currentHeader);
            event.preventDefault();
            break;
        case 37:
        case 38: {
            const previousHeaderIndex = (currentHeaderIndex === 0)
                ? this.headers.length - 1
                : currentHeaderIndex - 1;
            this.setHeaderFocus(previousHeaderIndex);
            event.preventDefault();
            break;
        }
        case 39:
        case 40: {
            const nextHeaderIndex = (currentHeaderIndex < this.headers.length - 1)
                ? currentHeaderIndex + 1
                : 0;
            this.setHeaderFocus(nextHeaderIndex);
            event.preventDefault();
            break;
        }
        default:
            break;
        }
    }

    addEventListeners() {
        this.headers.forEach((accordionHeader) => {
            accordionHeader.addEventListener('click', this.eventHeaderClick);
            accordionHeader.addEventListener('keyup', this.eventHeaderKeyUp);
        });
    }

    removeEventListeners() {
        this.headers.forEach((accordionHeader) => {
            accordionHeader.removeEventListener('click', this.eventHeaderClick);
            accordionHeader.removeEventListener('keyup', this.eventHeaderKeyUp);
        });
    }

    bindMethods() {
        this.applyAlly = this.applyAlly.bind(this);
        this.removeAlly = this.removeAlly.bind(this);
        this.togglePanel = this.togglePanel.bind(this);
        this.eventHeaderClick = this.eventHeaderClick.bind(this);
        this.eventHeaderKeyUp = this.eventHeaderKeyUp.bind(this);
        this.setHeaderFocus = this.setHeaderFocus.bind(this);
    }

    applyAlly() {
        this.accordionContainer.setAttribute('role', 'tablist');
        this.accordionContainer.setAttribute('aria-multiselectable', this.isMultiSelectable);

        this.headers.forEach((header) => {
            header.setAttribute('role', 'tab');
            header.setAttribute('aria-controls', header.id.replace(this.headerIdPrefix, this.panelIdPrefix));
            header.setAttribute('tabindex', 0);
        });

        this.panels.forEach((panel) => {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', panel.id.replace(this.panelIdPrefix, this.headerIdPrefix));
            panel.setAttribute('tabindex', 0);
        });
    }

    removeAlly() {
        this.accordionContainer.removeAttribute('role');
        this.accordionContainer.removeAttribute('aria-multiselectable');

        this.headers.forEach((header) => {
            header.removeAttribute('role');
            header.removeAttribute('aria-controls');
            header.removeAttribute('aria-selected');
            header.removeAttribute('aria-expanded');
            header.removeAttribute('tabindex');
        });

        this.panels.forEach((panel) => {
            panel.removeAttribute('role');
            panel.removeAttribute('aria-labelledby');
            panel.removeAttribute('aria-hidden');
            panel.removeAttribute('tabindex');
        });
    }

    getActivePanel(targetPanelId) {
        return this.panels.find(panel => panel.id === targetPanelId);
    }

    hidePanel(target) {
        const targetPanelId = target.getAttribute('aria-controls');
        const activePanel = this.getActivePanel(targetPanelId);
        target.setAttribute('aria-selected', 'false');
        target.setAttribute('aria-expanded', 'false');
        this.constructor.unsetPanelHeight(activePanel);
        activePanel.setAttribute('aria-hidden', 'true');
    }

    showPanel(target) {
        const targetPanelId = target.getAttribute('aria-controls');
        const activePanel = this.getActivePanel(targetPanelId);
        target.setAttribute('tabindex', 0);
        target.setAttribute('aria-selected', 'true');
        target.setAttribute('aria-expanded', 'true');
        this.constructor.setPanelHeight(activePanel);
        activePanel.setAttribute('aria-hidden', 'false');
    }

    togglePanel(target) {
        if (target.getAttribute('aria-selected') === 'true') {
            this.hidePanel(target);
            return;
        }

        if (!this.isMultiSelectable) {
            this.hideAllPanels();
        }
        this.showPanel(target);
    }

    hideAllPanels() {
        this.headers.forEach((header) => {
            header.setAttribute('tabindex', -1);
            header.setAttribute('aria-selected', 'false');
            header.setAttribute('aria-expanded', 'false');
        });
        this.panels.forEach((panel) => {
            if (panel.getAttribute('aria-hidden') === 'false') this.constructor.unsetPanelHeight(panel);
            panel.setAttribute('aria-hidden', 'true');
        });
    }

    showInitialOpenPanels() {
        this.headers.forEach((header) => {
            if (header.getAttribute('data-accordion-is-open') === 'true') {
                this.showPanel(header);
            }
        });
    }

    destroy() {
        this.removeAlly();
        this.removeEventListeners();
        this.accordionContainer.classList.remove(this.readyClass);
    }

    init() {
        if (
            !this.accordionContainer
            || this.accordionContainer.classList.contains(this.readyClass)
        ) return;
        this.applyAlly();
        this.addEventListeners();
        this.hideAllPanels();

        const firstHeader = this.headers[0];
        if (this.isFirstPanelOpen) {
            if (firstHeader.getAttribute('data-accordion-is-open') !== 'false') {
                this.showPanel(firstHeader);
            }
        } else {
            firstHeader.setAttribute('tabindex', 0);
        }

        if (this.isMultiSelectable) {
            this.showInitialOpenPanels();
        }
        this.accordionContainer.classList.add(this.readyClass);
    }
}

export default Accordion;

/* eslint-enable no-param-reassign */
