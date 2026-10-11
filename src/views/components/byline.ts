import { html } from "achi-html-stream"

export function byline({ article }: { article: Article }) {
  return html`<div class="byline">
    <span class="avatar" aria-hidden="true">${article.initials}</span>
    <span><strong>${article.author}</strong><span>${article.date} · ${article.readTime}</span></span>
  </div>`
}
