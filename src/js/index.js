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
            console.error('Accordion container node is required');
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
        this.init();
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

    addEventListeners() {
        this.headers.forEach((accordionHeader) => {
            accordionHeader.addEventListener('click', event => this.togglePanel(event.target));
        });
    }

    removeEventListeners() {
    }

    bindMethods() {
        this.applyAlly = this.applyAlly.bind(this);
        this.removeAlly = this.removeAlly.bind(this);
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

    destroy() {
        this.removeAlly();
        // remove ready class
        this.accordionContainer.classList.remove(this.readyClass);
    }

    init() {
        this.applyAlly();
        this.addEventListeners();
        this.hideAllPanels();
        this.accordionContainer.classList.add(this.readyClass);
    }
}

const accordionInstance = new Accordion(document.querySelector('.js-accordion'));

// ////////////////////
// https://www.youtube.com/watch?v=hw4mo7EALOw
// ///////////////////

export default Accordion;

/* eslint-enable no-param-reassign */
