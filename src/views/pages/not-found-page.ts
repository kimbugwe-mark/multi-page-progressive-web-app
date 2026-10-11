import { html } from "achi-html-stream"
import { siteLayout } from "../layouts/site-layout.ts"

export function notFoundPage() {
  return siteLayout({
    title: "Story not found",
    content: html`<main class="not-found shell">
      <span class="eyebrow">A little detour</span>
      <h1>Story not found.</h1>
      <p>That page may have wandered off. Let's find you something good to read.</p>
      <a class="read-link" href="/">Browse all stories <span>→</span></a>
    </main>`
  })
}
