import { minimize, unminimize, fullscreen, unfullscreen, unsnap, close, type PreviousState } from './animations';
import { setupDrag } from './drag';
import { setupResize } from './resize';
import { defaultWindowManager } from './windowManager';
import { snapRect, type SnapZone } from './snap';
import { setupProgressBar, type ProgressBarHandle } from './progressBar';

// Derive the directory of this script once — plain string op, Vite won't treat it as an asset URL
const _moduleUrl: string = import.meta.url;
const _moduleDir: string = _moduleUrl.slice(0, _moduleUrl.lastIndexOf('/') + 1);
const _cssBase: string = `${_moduleDir}../css/`;

let _winCounter = 0;

function sanitizeSvg(raw: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'image/svg+xml');
    if (doc.querySelector('parsererror')) return '';
    const walk = (node: Element) => {
      if (node.tagName.toLowerCase() === 'script') { node.parentNode?.removeChild(node); return; }
      for (const attr of Array.from(node.attributes)) {
        if (attr.name.startsWith('on') || attr.value.toLowerCase().includes('javascript:')) {
          node.removeAttribute(attr.name);
        }
      }
      Array.from(node.children).forEach(walk);
    };
    walk(doc.documentElement);
    return new XMLSerializer().serializeToString(doc.documentElement);
  } catch { return ''; }
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

interface WindowState {
  isMinimized: boolean;
  isFullscreen: boolean;
  previousState: PreviousState | null;
}

declare global {
  interface Window {
    DreamDeskAnimations?: Record<string, Function>;
    DreamDeskIcons?: Record<string, string>;
  }
}

class DreamDeskComponent extends HTMLElement {
  protected _theme: string;
  protected _prefix: string;
  protected _container: HTMLDivElement;
  protected _eventController: AbortController | null;
  protected _initialized = false;
  protected _resizeObserver: ResizeObserver | null = null;
  private _onThemeChange: () => void;

  constructor() {
    super();
    this._theme = document.documentElement.getAttribute('data-theme') || 'default';
    this._prefix = this._getThemePrefix(this._theme);
    this.attachShadow({ mode: 'open' });

    this._container = document.createElement('div');
    this._container.classList.add('component-root');
    this._eventController = new AbortController();

    this._injectBaseStyles();
    this.shadowRoot!.appendChild(this._container);

    this._onThemeChange = () => {
      this._theme = document.documentElement.getAttribute('data-theme') || 'default';
      this._prefix = this._getThemePrefix(this._theme);
      this._updateThemeStyles(() => { (this as any).themeChanged?.(); });
    };
    document.addEventListener('dreamdesk-theme-changed', this._onThemeChange, {
      signal: this._eventController.signal,
    });
  }

  connectedCallback(): void {
    if (!this._eventController) {
      this._eventController = new AbortController();
      document.addEventListener('dreamdesk-theme-changed', this._onThemeChange, {
        signal: this._eventController.signal,
      });
    }
    if (this._initialized) return;
    this._updateThemeStyles(() => {
      this._container.innerHTML = this.template();
      (this as any).setup?.();
    });
    this._initialized = true;
  }

  disconnectedCallback(): void {
    if (this._eventController) { this._eventController.abort(); this._eventController = null; }
    if (this._resizeObserver) {
      try { this._resizeObserver.disconnect(); } catch (_) {}
      this._resizeObserver = null;
    }
  }

  protected _injectBaseStyles(): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${_cssBase}base.css`;
    this.shadowRoot!.appendChild(link);
  }

  protected _updateThemeStyles(callback?: () => void): void {
    callback?.();
  }

  protected template(): string { return ''; }

  protected _getThemePrefix(theme: string): string {
    switch (theme) {
      case 'pastelcore': return 'pc';
      case 'dark': return 'bl';
      default: return '';
    }
  }

  get theme(): string { return this._theme; }
  get prefix(): string { return this._prefix; }
}

class DreamDeskWindow extends DreamDeskComponent {
  private _winId: string;
  private _resizable: boolean;
  private _movable: boolean;
  private widthAttr: string | null;
  private heightAttr: string | null;
  private state: WindowState;
  private _resizeHandleBound = false;
  private _dragController: AbortController | null = null;
  private _observedScrollables: Element[] = [];
  private _snapOverlay: HTMLElement | null = null;
  private _preSnapState: { left: string; top: string; width: string; height: string } | null = null;

  static get observedAttributes() {
    return ['title', 'width', 'height', 'resizable', 'movable',
      'minimize-icon', 'fullscreen-icon', 'close-icon',
      'disable-minimize', 'disable-fullscreen', 'disable-close'];
  }

  constructor() {
    super();
    this.setAttribute('data-dd-role', 'window');
    this._winId = `dd-win-${++_winCounter}`;
    this.widthAttr = this.getAttribute('width');
    this.heightAttr = this.getAttribute('height');
    const resizableAttr = this.getAttribute('resizable');
    this._resizable = resizableAttr === null || resizableAttr === '' || resizableAttr === 'true' || resizableAttr === '1';
    const movableAttr = this.getAttribute('movable');
    this._movable = movableAttr === null || movableAttr === '' || movableAttr === 'true' || movableAttr === '1';
    this.state = { isMinimized: false, isFullscreen: false, previousState: null };
  }

  template(): string {
    return `
      <div class="win">
        <div class="win-header">
          <span class="win-title">${escapeHtml(this.getAttribute('title') || 'Window')}</span>
          <div class="win-controls">
            <button class="btn--minimize" data-action="minimize" aria-label="minimize"></button>
            <button class="btn--fullscreen" data-action="fullscreen" aria-label="fullscreen"></button>
            <button class="btn--close" data-action="close" aria-label="close"></button>
          </div>
        </div>
        <div class="win-body"><slot></slot></div>
      </div>`;
  }

  setup(): void {
    defaultWindowManager.register(this._winId, this, this.getAttribute('title') ?? 'Window');
    this._syncSizeFromAttributes();
    this._setupResizeObserver();
    this._bindButtons();
    this._setupResizeHandle();
    this._setupDragging();
    this._applyControlIcons();
    this._applyControlsDisabled();
    this._bindFocusRaise();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    defaultWindowManager.unregister(this._winId);
    if (this._dragController) { this._dragController.abort(); this._dragController = null; }
    this._snapOverlay?.remove();
    this._snapOverlay = null;
  }

  private _syncSizeFromAttributes(): void {
    const w = this.widthAttr, h = this.heightAttr;
    if (w || h) this.setAttribute('data-ddw-explicit', '');
    if (w) this.style.setProperty('--ddw-w', w);
    if (h) this.style.setProperty('--ddw-h', h);
  }

  private _bindButtons(): void {
    const root = this.shadowRoot!;
    const onClick = (fn: () => void) => (e: Event) => {
      const target = e.currentTarget as Element;
      if (target?.getAttribute('aria-disabled') === 'true') { e.preventDefault(); e.stopPropagation(); return; }
      fn();
    };
    root.querySelector('[data-action="minimize"]')?.addEventListener('click', onClick(() => this.minimize()));
    root.querySelector('[data-action="fullscreen"]')?.addEventListener('click', onClick(() => this.fullscreen()));
    root.querySelector('[data-action="close"]')?.addEventListener('click', onClick(() => this.close()));
  }

  minimize(): void {
    const win = this.shadowRoot!.querySelector<HTMLElement>('.win')!;
    const customId = this.getAttribute('minimize-animation');
    const customFn = customId ? window.DreamDeskAnimations?.[customId] : undefined;
    const done = () => {
      this.state.isMinimized = !this.state.isMinimized;
      this.state.isMinimized ? this.setAttribute('minimized', '') : this.removeAttribute('minimized');
      this.state.isMinimized
        ? defaultWindowManager.minimize(this._winId)
        : defaultWindowManager.restore(this._winId);
      this.dispatchEvent(new CustomEvent('minimize', { detail: { isMinimized: this.state.isMinimized } }));
    };
    if (typeof customFn === 'function') {
      Promise.resolve(customFn(win, { defaultFns: { minimize, unminimize }, previousState: this.state.previousState })).then(done);
    } else {
      const goingMinimized = !this.state.isMinimized;
      goingMinimized ? minimize(win) : unminimize(win);
      done();
    }
  }

  fullscreen(): void {
    const win = this as unknown as HTMLElement;
    // If snapped, restore to pre-snap position instead of toggling fullscreen
    if (!this.state.isFullscreen && this._preSnapState) {
      const pre = this._preSnapState;
      this._preSnapState = null;
      const fromRect = this.getBoundingClientRect();
      this.style.left = pre.left;
      this.style.top = pre.top;
      this.style.setProperty('--ddw-w', pre.width);
      this.style.setProperty('--ddw-h', pre.height);
      unsnap(this, fromRect);
      return;
    }
    const goingFull = !this.state.isFullscreen;
    if (goingFull) {
      this._freezeWindowState();
      this.setAttribute('data-ddw-explicit', '');
    }
    const customId = this.getAttribute(goingFull ? 'fullscreen-animation' : 'unfullscreen-animation');
    let customFn = customId ? window.DreamDeskAnimations?.[customId] : undefined;
    if (!goingFull && typeof customFn !== 'function') {
      const fallbackId = this.getAttribute('fullscreen-animation');
      customFn = fallbackId ? window.DreamDeskAnimations?.[fallbackId] : undefined;
    }
    const after = () => {
      this.state.isFullscreen = !this.state.isFullscreen;
      this.dispatchEvent(new CustomEvent('fullscreen', { detail: { isFullscreen: this.state.isFullscreen } }));
    };
    if (typeof customFn === 'function') {
      Promise.resolve(customFn(win, { previousState: this.state.previousState, isFullscreen: this.state.isFullscreen, defaultFns: { fullscreen, unfullscreen } })).then(after);
    } else {
      goingFull ? fullscreen(win, this.state.previousState!) : unfullscreen(win, this.state.previousState!);
      after();
    }
  }

  close(): void {
    const win = this.shadowRoot!.querySelector<HTMLElement>('.win')!;
    const customId = this.getAttribute('close-animation');
    const customFn = customId ? window.DreamDeskAnimations?.[customId] : undefined;
    const finalize = () => { this.style.display = 'none'; this.dispatchEvent(new CustomEvent('close')); };
    if (typeof customFn === 'function') {
      Promise.resolve(customFn(win, { defaultFns: { close } })).then(finalize);
    } else { close(win, finalize); }
  }

  private _freezeWindowState(): void {
    const rect = this.getBoundingClientRect();
    const scrollTop = window.scrollY || 0;
    const scrollLeft = window.scrollX || 0;
    const cs = getComputedStyle(this);
    this.state.previousState = {
      top: rect.top + scrollTop, left: rect.left + scrollLeft,
      width: rect.width, height: rect.height,
      position: cs.position || 'relative',
      zIndex: cs.zIndex === 'auto' ? '' : cs.zIndex,
    };
  }

  private _setupResizeObserver(): void {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => this._checkOverflow(entry.target as HTMLElement));
    });
    const slot = this.shadowRoot!.querySelector('slot');
    const assignedElements = slot?.assignedElements({ flatten: true }) ?? [];
    const setupScrollableElements = () => {
      const selector = '.win-content[scrollable], [scrollable], p.scrollable, .scrollable';
      this._observedScrollables.forEach((el) => observer.unobserve(el));
      this._observedScrollables = [];
      assignedElements.forEach((node) => {
        const selfMatches = (node as Element).matches?.(selector) ? [node as Element] : [];
        const descendants = (node as Element).querySelectorAll?.(selector) ?? [];
        [...selfMatches, ...Array.from(descendants)].forEach((el) => {
          el.classList.forEach((c) => { if (c.endsWith('-scroll')) el.classList.remove(c); });
          observer.observe(el);
          this._observedScrollables.push(el);
          this._checkOverflow(el as HTMLElement);
        });
      });
    };
    setupScrollableElements();
    document.addEventListener('dreamdesk-theme-changed', () => {
      this._theme = document.documentElement.getAttribute('data-theme') || 'default';
      this._prefix = this._getThemePrefix(this._theme);
      setupScrollableElements();
    }, { signal: this._eventController?.signal ?? undefined });
    slot?.addEventListener('slotchange', setupScrollableElements, { signal: this._eventController?.signal ?? undefined });
    this._resizeObserver = observer;
  }

  private _checkOverflow(el: HTMLElement): void {
    el.classList.toggle('overflowing', el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth);
  }

  private _setupResizeHandle(): void {
    const win = this.shadowRoot!.querySelector<HTMLElement>('.win');
    if (!win) return;
    let handle = win.querySelector<HTMLElement>('.win-resize-handle');
    if (!this._resizable) { handle?.remove(); this._resizeHandleBound = false; return; }
    if (!handle) { handle = document.createElement('div'); handle.className = 'win-resize-handle'; win.appendChild(handle); }
    if (this._resizeHandleBound) return;
    this._resizeHandleBound = true;
    setupResize({
      handle,
      host: this,
      signal: this._eventController?.signal,
      disabled: () => !!this.state?.isFullscreen,
      explicitAttr: 'data-ddw-explicit',
    });
  }

  private _setupDragging(): void {
    const header = this.shadowRoot!.querySelector<HTMLElement>('.win-header');
    if (!header) return;
    if (!this._movable) {
      header.style.cursor = 'default';
      this._dragController?.abort(); this._dragController = null;
      return;
    }
    if (this._dragController) return;
    this._dragController = new AbortController();
    header.style.cursor = 'move';

    const container = this.parentElement as HTMLElement | null;

    if (!this._snapOverlay && container) {
      this._snapOverlay = this._createSnapOverlay();
      container.appendChild(this._snapOverlay);
    }

    setupDrag({
      handle: header,
      host: this,
      container,
      signal: this._dragController.signal,
      exclude: '.win-controls',
      disabled: () => !this._movable || (!!this.state?.isFullscreen && this.getAttribute('fullscreen-mode') !== 'expand'),
      onStart: (hostRect) => {
        this._preSnapState = null;
        this.setAttribute('data-ddw-explicit', '');
        this.style.setProperty('--ddw-w', `${hostRect.width}px`);
        this.style.setProperty('--ddw-h', `${hostRect.height}px`);
        const pos = getComputedStyle(this).position;
        if (pos === 'static' || pos === 'relative') {
          this.style.position = 'absolute';
          this.style.left = `${hostRect.left + (window.scrollX || 0)}px`;
          this.style.top = `${hostRect.top + (window.scrollY || 0)}px`;
        }
        defaultWindowManager.raise(this._winId);
      },
      onSnap: (zone) => {
        const overlay = this._snapOverlay;
        if (!overlay || !container) return;
        if (zone === 'none') { overlay.style.display = 'none'; return; }
        const cr = container.getBoundingClientRect();
        const rect = snapRect(zone, cr.width, cr.height);
        if (!rect) { overlay.style.display = 'none'; return; }
        overlay.style.display = 'block';
        overlay.style.left = `${rect.left}px`;
        overlay.style.top = `${rect.top}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
      },
      onSnapCommit: (zone) => {
        if (this._snapOverlay) this._snapOverlay.style.display = 'none';
        if (!container) return;
        const cr = container.getBoundingClientRect();
        const rect = snapRect(zone, cr.width, cr.height);
        if (!rect) return;
        this._preSnapState = {
          left: this.style.left || `${this.getBoundingClientRect().left}px`,
          top: this.style.top || `${this.getBoundingClientRect().top}px`,
          width: this.style.getPropertyValue('--ddw-w'),
          height: this.style.getPropertyValue('--ddw-h'),
        };
        this.style.left = `${rect.left}px`;
        this.style.top = `${rect.top}px`;
        this.style.setProperty('--ddw-w', `${rect.width}px`);
        this.style.setProperty('--ddw-h', `${rect.height}px`);
      },
    });
  }

  private _createSnapOverlay(): HTMLElement {
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;pointer-events:none;background:rgba(100,150,255,0.18);border:2px solid rgba(100,150,255,0.45);border-radius:4px;z-index:9998;transition:top 0.08s,left 0.08s,width 0.08s,height 0.08s;display:none;box-sizing:border-box';
    return el;
  }

  private _bindFocusRaise(): void {
    this.shadowRoot!.querySelector('.win')?.addEventListener('pointerdown', () => defaultWindowManager.raise(this._winId), {
      signal: this._eventController?.signal ?? undefined,
    });
  }

  private _applyControlIcons(): void {
    const root = this.shadowRoot!;
    const apply = (selector: string, attrName: string) => {
      const btn = root.querySelector<HTMLElement>(selector);
      if (!btn) return;
      const iconVal = this.getAttribute(attrName);
      if (!iconVal) return;
      const trimmed = iconVal.trim();
      let svgMarkup = '';
      if (trimmed.startsWith('<svg')) {
        svgMarkup = sanitizeSvg(trimmed);
      } else if (window.DreamDeskIcons?.[trimmed]) {
        svgMarkup = sanitizeSvg(window.DreamDeskIcons[trimmed]);
      }
      if (!svgMarkup) return;
      btn.innerHTML = svgMarkup;
      btn.style.backgroundImage = 'none';
      const svgEl = btn.querySelector('svg');
      if (svgEl) { svgEl.setAttribute('aria-hidden', 'true'); svgEl.setAttribute('focusable', 'false'); }
    };
    apply('.btn--minimize', 'minimize-icon');
    apply('.btn--fullscreen', 'fullscreen-icon');
    apply('.btn--close', 'close-icon');
  }

  private _applyControlsDisabled(): void {
    const root = this.shadowRoot!;
    const setDisabled = (selector: string, attrName: string) => {
      const btn = root.querySelector<HTMLElement>(selector);
      if (!btn) return;
      const v = this.getAttribute(attrName);
      const isDisabled = v !== null && v !== 'false' && v !== '0';
      btn.setAttribute('aria-disabled', String(isDisabled));
      if (isDisabled) {
        btn.setAttribute('tabindex', '-1');
        const tooltip = (v && v !== 'true' && v !== '1') ? v : this.getAttribute(`${attrName}-tooltip`);
        tooltip ? btn.setAttribute('data-tooltip', tooltip) : btn.removeAttribute('data-tooltip');
      } else {
        btn.removeAttribute('tabindex'); btn.removeAttribute('data-tooltip');
      }
    };
    setDisabled('.btn--minimize', 'disable-minimize');
    setDisabled('.btn--fullscreen', 'disable-fullscreen');
    setDisabled('.btn--close', 'disable-close');
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    if (oldVal === newVal) return;
    const boolAttr = (v: string | null) => v === null || v === '' || v === 'true' || v === '1';
    if (name === 'resizable') { this._resizable = boolAttr(newVal); if (this._initialized) this._setupResizeHandle(); }
    if (name === 'movable') { this._movable = boolAttr(newVal); if (this._initialized) this._setupDragging(); }
    if (name === 'width') { this.widthAttr = newVal; if (this._initialized) this._syncSizeFromAttributes(); }
    if (name === 'height') { this.heightAttr = newVal; if (this._initialized) this._syncSizeFromAttributes(); }
    if (['minimize-icon', 'fullscreen-icon', 'close-icon'].includes(name)) this._applyControlIcons();
    if (['disable-minimize', 'disable-fullscreen', 'disable-close'].includes(name)) this._applyControlsDisabled();
  }
}

class DreamDeskProgressBar extends DreamDeskComponent {
  private _value: number;
  private _handle: ProgressBarHandle | null = null;

  static get observedAttributes() { return ['value', 'gradient', 'blocky']; }

  constructor() {
    super();
    this.setAttribute('data-dd-role', 'progressbar');
    this._value = parseFloat(this.getAttribute('value') ?? '0') || 0;
  }

  template(): string {
    const trackClass = ['progress-track', this.hasAttribute('blocky') ? 'progress-track--blocky' : ''].filter(Boolean).join(' ');
    const barClass = ['progress-bar', this.hasAttribute('gradient') ? 'progress-bar--gradient' : ''].filter(Boolean).join(' ');
    return `<div class="${trackClass}">${this.hasAttribute('blocky') ? '' : `<div class="${barClass}"></div>`}</div>`;
  }

  connectedCallback(): void { super.connectedCallback(); this._init(); }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    if (oldVal === newVal) return;
    if (name === 'value') { this._value = parseFloat(newVal ?? '0'); this._handle?.update(this._value); }
    if (name === 'gradient' || name === 'blocky') { this._container.innerHTML = this.template(); this._init(); }
  }

  themeChanged(): void { this._handle?.rebuild(); }

  private _init(): void {
    const track = this.shadowRoot!.querySelector<HTMLElement>('.progress-track');
    if (!track) return;
    this._handle?.destroy();
    this._handle = setupProgressBar({
      track,
      getValue: () => this._value,
      isBlocky: () => this.hasAttribute('blocky'),
      isGradient: () => this.hasAttribute('gradient'),
    });
    this._handle.rebuild();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._handle?.destroy();
    this._handle = null;
  }

  get value(): number { return this._value; }
  set value(val: number) { this.setAttribute('value', String(val)); }
}

class DreamDeskTabs extends DreamDeskComponent {
  private tabs: Element[] = [];
  private panels: Element[] = [];
  private activeIndex = 0;
  private _tabListenerBound = false;

  connectedCallback(): void { super.connectedCallback(); this._initializeSlots(); }

  private _initializeSlots(): void {
    const slotTabs = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="tab"]');
    const slotPanels = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="panel"]');
    if (slotTabs && slotPanels) {
      this.tabs = slotTabs.assignedElements() ?? [];
      this.panels = slotPanels.assignedElements() ?? [];
      this._activateTab(this.activeIndex);
      this._setupEventListeners();
    } else { setTimeout(() => this._initializeSlots(), 0); }
  }

  template(): string {
    return `<div class="tabs"><div class="tab-list"><slot name="tab"></slot></div><div class="tab-panels"><slot name="panel"></slot></div></div>`;
  }

  private _setupEventListeners(): void {
    if (this._tabListenerBound) return;
    this._tabListenerBound = true;
    this.addEventListener('click', (e: Event) => {
      const tab = (e.target as Element).closest('[data-tab-index]');
      if (tab) this._activateTab(parseInt(tab.getAttribute('data-tab-index') ?? '0', 10));
    }, { signal: this._eventController?.signal ?? undefined });
  }

  disconnectedCallback(): void { super.disconnectedCallback(); this._tabListenerBound = false; }

  private _activateTab(index: number): void {
    this.tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
    this.panels.forEach((panel, i) => panel.classList.toggle('active', i === index));
    this.activeIndex = index;
  }
}

class DreamDeskTab extends HTMLElement {
  connectedCallback(): void {
    this.setAttribute('slot', 'tab');
    this.setAttribute('data-tab', '');
    this.setAttribute('data-tab-index', this.getAttribute('index') ?? '0');
  }
}

class DreamDeskTabPanel extends DreamDeskComponent {
  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('slot', 'panel');
    this.setAttribute('data-panel', '');
    this.querySelector('p')?.classList.add('win-content');
  }

  template(): string {
    return `<style>:host{display:none}:host(.active){display:block}</style><slot></slot>`;
  }
}

class DreamDeskButton extends DreamDeskComponent {
  private variant: string;
  private action: string | null;

  static get observedAttributes() {
    return ['variant', 'action', 'size', 'min-width', 'width', 'height', 'font-size', 'px', 'py', 'disabled'];
  }

  static readonly sizeVarMap: Record<string, string> = {
    'min-width': '--dd-btn-min-w', 'width': '--dd-btn-w', 'height': '--dd-btn-h',
    'font-size': '--dd-btn-fs', 'px': '--dd-btn-px', 'py': '--dd-btn-py',
  };

  constructor() {
    super();
    this.variant = this.getAttribute('variant') || 'primary';
    this.action = this.getAttribute('action');
    this.setAttribute('data-dd-role', 'button');
  }

  template(): string {
    const actionAttr = this.action ? `data-action="${escapeHtml(this.action)}"` : '';
    const ariaLabel = this.action ? `aria-label="${escapeHtml(this.action)}"` : '';
    const v = this.getAttribute('disabled');
    const disabledAttr = v !== null && v !== 'false' && v !== '0' ? 'disabled aria-disabled="true"' : '';
    return `<button class="btn btn--${escapeHtml(this.variant)}" ${actionAttr} ${ariaLabel} ${disabledAttr}><slot></slot></button>`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._applyButtonSizeOverrides();
    this._syncDisabled();
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    if (oldVal === newVal) return;
    if (name === 'size') return;
    if (name === 'disabled') { this._syncDisabled(); return; }
    if (name === 'variant') {
      this.variant = newVal ?? 'primary';
      const btn = this.shadowRoot?.querySelector('button');
      if (btn) btn.className = `btn btn--${this.variant}`;
      return;
    }
    if (name === 'action') {
      this.action = newVal;
      const btn = this.shadowRoot?.querySelector('button');
      if (btn) {
        if (newVal) { btn.setAttribute('data-action', newVal); btn.setAttribute('aria-label', newVal); }
        else { btn.removeAttribute('data-action'); btn.removeAttribute('aria-label'); }
      }
      return;
    }
    const cssVar = DreamDeskButton.sizeVarMap[name];
    if (cssVar) newVal == null ? this.style.removeProperty(cssVar) : this.style.setProperty(cssVar, newVal);
  }

  private _applyButtonSizeOverrides(): void {
    Object.entries(DreamDeskButton.sizeVarMap).forEach(([attr, cssVar]) => {
      const val = this.getAttribute(attr);
      if (val != null) this.style.setProperty(cssVar, val);
    });
  }

  private _syncDisabled(): void {
    const btn = this.shadowRoot?.querySelector<HTMLButtonElement>('button');
    if (!btn) return;
    const isDisabled = this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false' && this.getAttribute('disabled') !== '0';
    btn.disabled = isDisabled;
    btn.setAttribute('aria-disabled', String(isDisabled));
    btn.classList.toggle('btn--disable', isDisabled);
    isDisabled ? btn.setAttribute('tabindex', '-1') : btn.removeAttribute('tabindex');
  }
}

class DreamDeskToast extends DreamDeskComponent {
  private _type: string;
  private _message: string;

  static get observedAttributes() { return ['type', 'message']; }

  constructor() {
    super();
    this._type = this.getAttribute('type') || 'notification';
    this._message = this.getAttribute('message') || '';
  }

  template(): string {
    return `<div class="toast toast-${escapeHtml(this._type)}">
      <button class="toast-btn--close" data-action="close" aria-label="close">&times;</button>
      ${escapeHtml(this._message)}
    </div>`;
  }

  setup(): void {
    this.shadowRoot!.querySelector('[data-action="close"]')?.addEventListener('click', () => {
      this.style.display = 'none';
    });
  }

  show(): void { this.style.display = 'block'; }
  hide(): void { this.style.display = 'none'; }
}

class DreamDeskInput extends DreamDeskComponent {
  private _type: string;
  private _label: string;
  private _inputId: string;
  private _value: string;
  private _placeholder: string;

  static get observedAttributes() { return ['type', 'label', 'id', 'value', 'placeholder']; }

  constructor() {
    super();
    this._type = this.getAttribute('type') || 'text';
    this._label = this.getAttribute('label') || '';
    this._inputId = this.getAttribute('id') || '';
    this._value = this.getAttribute('value') || '';
    this._placeholder = this.getAttribute('placeholder') || '';
  }

  template(): string {
    const wrap = this._label ? 'display:flex;align-items:center;gap:0.5rem' : '';
    return `<div style="${wrap}">
      ${this._label ? `<label class="input-label" for="${escapeHtml(this._inputId)}">${escapeHtml(this._label)}</label>` : ''}
      <input type="${escapeHtml(this._type)}" id="${escapeHtml(this._inputId)}" class="dreamdesk-input"
        value="${escapeHtml(this._value)}" placeholder="${escapeHtml(this._placeholder)}" />
    </div>`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.shadowRoot!.querySelector('input')?.addEventListener('input', (e: Event) => {
      this._value = (e.target as HTMLInputElement).value;
      this.dispatchEvent(new CustomEvent('input', { detail: { value: this._value } }));
    });
  }

  get value(): string { return this._value; }
  set value(val: string) {
    this._value = val;
    const input = this.shadowRoot?.querySelector<HTMLInputElement>('input');
    if (input) input.value = val;
  }
}

class DreamDeskToggle extends DreamDeskComponent {
  template(): string {
    const checked = this.theme === 'dark' ? 'checked' : '';
    return `<label class="toggle">
      <input type="checkbox" ${checked}>
      <span class="slider"><span class="knob"></span></span>
    </label>`;
  }

  setup(): void {
    this.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')
      ?.addEventListener('change', (e: Event) => {
        this.dispatchEvent(new CustomEvent('toggle-changed', {
          detail: { checked: (e.target as HTMLInputElement).checked },
        }));
      });
  }
}

class DreamDeskTerminalWindow extends DreamDeskWindow {
  template(): string {
    return `<div class="win terminal-win">
      <div class="win-header">
        <span class="win-title">${escapeHtml(this.getAttribute('title') || 'Terminal')}</span>
        <div class="win-controls">
          <button class="btn--minimize" data-action="minimize"></button>
          <button class="btn--fullscreen" data-action="fullscreen"></button>
          <button class="btn--close" data-action="close"></button>
        </div>
      </div>
      <div class="win-body terminal-win-body"><slot></slot></div>
    </div>`;
  }
}

customElements.define('dreamdesk-tab', DreamDeskTab);
customElements.define('dreamdesk-tab-panel', DreamDeskTabPanel);
customElements.define('dreamdesk-tabs', DreamDeskTabs);
customElements.define('dreamdesk-window', DreamDeskWindow);
customElements.define('dreamdesk-progress-bar', DreamDeskProgressBar);
customElements.define('dreamdesk-button', DreamDeskButton);
customElements.define('dreamdesk-toast', DreamDeskToast);
customElements.define('dreamdesk-input', DreamDeskInput);
customElements.define('dreamdesk-toggle', DreamDeskToggle);
customElements.define('dreamdesk-terminal-window', DreamDeskTerminalWindow);
