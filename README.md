# Morrow Journal

A small, dynamic server-rendered editorial blog built with Express and
[`achi-html-stream`](https://www.npmjs.com/package/achi-html-stream). It's a
reference app for building **multi-page, offline-capable, installable PWAs**
with streamed HTML and service workers.

All content is fictional (stories and author profiles). There is no
authentication and no database.

## Features

- **Streaming server rendering**: pages are rendered with `achi-html-stream`
  and sent to the browser as they're produced
- **Offline support**: a service worker lets pages keep working without a
  network connection
- **Installable**: ships as a PWA that can be added to the home screen or desktop
- **Category filters and search** across titles, excerpts, topics, and authors
- **Typed end to end**: TypeScript views, props, and routes

## Quick start

Requires Node.js 22.6 or newer and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm build
pnpm start
```

Open <http://localhost:3000>
```

## Scripts

| Command          | Description                                   |
| ---------------- | --------------------------------------------- |
| `pnpm start`     | Builds the app and starts the compiled server |
| `pnpm build`     | Compiles the TypeScript only                  |
| `pnpm test`      | Runs the route and rendering tests            |
| `pnpm typecheck` | Type-checks the project without emitting      |

## Routes

| Route                    | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `/`                      | Featured story, story listing, category filters, and search  |
| `/?category=At%20home`   | Filter the listing by topic                                  |
| `/?q=morning`            | Search titles, excerpts, topics, and authors                 |
| `/articles/:slug`        | Full story page                                              |

Unknown routes render the not-found page.

## Project structure

```text
src/
├── app.ts             # Express app and routes
└── views/
    ├── layouts/       # Document shell, navigation, footer
    ├── pages/         # Homepage, article, and not-found templates
    ├── components/    # Reusable bylines and article cards
    └── styles.ts      # Shared stylesheet included by the layout
```

## How rendering works

Every template is a named function that takes a props object and returns an
`achi-html-stream` `html` template:

```ts
import { html } from "achi-html-stream";

export function byline({ name, date }: { name: string; date: string }) {
  return html`<p class="byline">By ${name} · ${date}</p>`;
}
```

Routes in `src/app.ts` pick a page view, pass it the data it needs, and hand
the result to the streaming renderer, which writes HTML to the response as
it's generated.

## Why streaming?

Traditional server rendering builds the entire page as one string and sends
it only when every piece of data is ready. This app streams HTML instead, in
two places: on the server and inside the service worker.

### On the server

- **Faster first paint**: the document head, navigation, and shell are
  flushed immediately, so the browser can start fetching CSS and fonts while
  the rest of the page is still being produced.
- **Slow data doesn't block the page**: the layout renders first and content
  that depends on slower work follows as soon as it's ready.
- **Lower memory per request**: chunks are written to the response as they
  are generated instead of buffering the full page in memory.
- **Progressive parsing**: browsers parse and paint streamed HTML
  incrementally, so long pages feel responsive even on slow connections.

### In the service worker

- **Instant navigations**: the worker answers immediately with the cached
  shell (head, navigation, footer) and streams the page content in behind it
  from the network or cache.
- **Offline pages that are still real pages**: the worker composes a full
  document from cached parts when the network is unavailable, with no
  client-side framework or hydration step.
- **Multi-page, not an SPA**: every route is a real navigation with its own
  URL, working back button, and shareable links, while still feeling as quick
  as an app shell.
- **One set of templates**: the same view functions can render in Node and in
  the worker, so there's no separate offline version of the UI to maintain.

### Comparison

| | Traditional SSR | Streaming (server) | Streaming (service worker) |
| --- | --- | --- | --- |
| First byte | After the whole page is built | As soon as the shell is ready | Immediately, from cache |
| Slow data | Blocks the entire response | Only delays its own section | Shell shows while content loads |
| Memory use | Full page buffered | Chunks written as produced | Chunks passed through |
| Offline | Not available | Not available | Pages composed from cache |
| Client JS needed | None | None | None |

## One set of templates, two runtimes

The same view functions render in Node and in the service worker. There is no
separate "offline UI" and no client-side framework or hydration step. Only the
code that streams the result differs.

```text
src/views/  ──►  Express (Node)         → streams HTML to the response
            └──►  Service worker        → streams HTML from cache and network
```

```ts
// src/views/pages/home.ts: shared, runtime-agnostic
import { html } from "achi-html-stream";
import { layout } from "../layouts/layout.ts";
import { articleCard } from "../components/article-card.ts";

export function homePage({ stories }: { stories: Story[] }) {
  return layout({
    title: "Morrow Journal",
    body: html`<main>${stories.map((s) => articleCard(s))}</main>`,
  });
}
```

```ts
// src/app.ts: Node
import { render } from "achi-html-stream";

app.get("/", (req, res) => {
  render(res,homePage({ stories: listStories(req.query) }));
});
```

```ts
// src/sw.ts: service worker
import { render } from "achi-html-stream";

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === "/") {
    event.respondWith(
      render(homePage({ stories: cachedStories() }))
    );
  }
});
```

### What this gives you

- **No drift**: a layout or component change updates the online and offline
  pages together.
- **Less code**: bylines, cards, and the layout are written once and tested
  once.
- **Same output everywhere**: escaping, async values, and streaming behave
  identically in Node and in the browser.
- **Plain HTML out**: the worker returns a normal `Response`, so navigation,
  caching, and the back button work like any other page.

> Templates must stay free of Node-only APIs (`fs`, `process`, `Buffer`) so
> they can be bundled into the service worker.

## Related

- [`achi-html-stream`](https://www.npmjs.com/package/achi-html-stream): the
  templating library this app is built on