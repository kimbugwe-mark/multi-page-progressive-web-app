import { html } from "achi-html-stream"

type SiteLayoutProps = {
  title: string
  content: ReturnType<typeof html>
  activeNavigation?: string
}

export function siteLayout({ title, content, activeNavigation = "" }: SiteLayoutProps) {
  return html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fbfaf6" />
        <meta name="description" content="Morrow is a journal for a more thoughtful everyday." />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon/favicon.ico">
        <link rel="manifest" href="/manifest.json">
        <title>${title} — Morrow Journal</title>
      </head>
      
      <body>
        <div class="announcement">A little space for a more thoughtful everyday</div>
        <header class="header">
          <div class="shell header-inner">
            <a class="brand" href="/" aria-label="Morrow Journal home">morrow<span>.</span></a>
            <nav class="nav" aria-label="Main navigation">
              <a class="${activeNavigation === "home" ? "active" : ""}" href="/">Journal</a>
              <a href="/?category=Mindful%20living">Mindful living</a>
              <a href="/?category=At%20home">At home</a>
              <a href="/?category=Creativity">Creativity</a>
            </nav>
            <form class="search" action="/" method="get" role="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.2 4.2"/></svg>
              <input name="q" type="search" placeholder="Search stories" aria-label="Search stories" />
            </form>
          </div>
        </header>
        ${content}
        <footer class="footer">
          <div class="shell footer-inner">
            <a href="/" class="footer-brand">morrow.</a>
            <span>A journal for the life you're living. Made with care, in a little corner of the internet.</span>
            <span>© 2025 Morrow Journal</span>
          </div>
        </footer>
      <script src='/js/index.js'></script>
      </body>
    </html>`
}
