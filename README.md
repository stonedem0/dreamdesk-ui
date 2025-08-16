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
  - Attributes: `title`, `width`, `height`, `resizable` (default true; set `resizable="false"` to disable)
- See `css/*` for available themes.

## Development

```bash
npm install
npm start
```

## License

MIT
