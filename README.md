# DreamDesk UI

Vanilla JS Web Components for retro-style windows, controls, and theming.

## CDN Usage (no build tools)

Add the script as a module and pick a theme by setting `data-theme` on `html`.

```html
<!doctype html>
<html data-theme="pastelcore">
  <head>
    <meta charset="utf-8" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/dreamdesk-ui@1/js/dreamdesk.js"></script>
  </head>
  <body>
    <dreamdesk-window title="Hello" width="420" height="260"></dreamdesk-window>
  </body>
  </html>
```

Notes:
- Base styles are auto-injected by the component.
- Themes are controlled via `data-theme` on `html`: `default`, `pastelcore`, `dark`.

## Installing via npm

```bash
npm install dreamdesk-ui
```

Then import in your app:

```html
<script type="module" src="/node_modules/dreamdesk-ui/js/dreamdesk.js"></script>
```

## Components
- `<dreamdesk-window>`: basic window with minimize, fullscreen, close
  - Attributes: `title`, `resizable` (default true), `movable` (default true)
  - Sizing:
    - Tokens: `size="sm|md|lg"`
    - Overrides: `width`, `height` (raw CSS lengths). When either is present the host switches to explicit mode.
    - CSS Vars: `--ddw-w`, `--ddw-h`, `--ddw-min-w`, `--ddw-min-h`, `--ddw-max-w`, `--ddw-max-h`

- `<dreamdesk-button>`: themed button
  - Attributes: `variant` (`primary|ghost|help`), `action`
  - Sizing:
    - Tokens: `size="sm|md|lg"`
    - Overrides: `min-width`, `width`, `height`, `font-size`, `px` (x padding), `py` (y padding)
    - CSS Vars: `--dd-btn-min-w`, `--dd-btn-w`, `--dd-btn-h`, `--dd-btn-fs`, `--dd-btn-px`, `--dd-btn-py`, `--dd-btn-border`

- `<dreamdesk-progress-bar>`: linear progress, solid or blocky
  - Attributes: `value` (0-100), `gradient`, `blocky`
  - Responsive by default (fills container width)
  - Sizing:
    - Token: `size="sm|md|lg"` (via container or custom CSS)
    - Overrides: set `--dd-pb-h` on the element to control height

See `css/*` for available themes.

## Development

```bash
npm install
npm start
```

## License

MIT
