
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
        if (!accordionContainer) return;

        this.accordionContainer = accordionContainer;
        this.headers = accordionContainer.querySelectorAll(headerSelector);
        this.panels = accordionContainer.querySelectorAll(panelSelector);

        this.headerIdPrefix = headerIdPrefix;
        this.panelIdPrefix = panelIdPrefix;
        this.isFirstPanelOpen = isFirstPanelOpen;
        this.isMultiSelectable = isMultiSelectable;
        this.readyClass = readyClass;

        this.init();

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
        this.accordionContainer.removeAttribute('aria-multiselectable')

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

    destroy() {
        this.removeAlly();
    }

    init() {
        this.applyAlly();
    }
}

const accordionInstance = new Accordion(document.querySelector('.js-accordion'));
export default Accordion;
