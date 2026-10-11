import { html } from "achi-html-stream"
import { byline } from "./byline.ts"

export function articleCard({ article }: { article: Article }) {
  return html`<article class="card">
    <a href="/articles/${article.slug}" aria-label="Read ${article.title}">
      <img class="card-image" src="${article.image}" alt="${article.imageAlt}" loading="lazy" />
    </a>
    <span class="card-category">${article.category}</span>
    <h3><a href="/articles/${article.slug}">${article.title}</a></h3>
    <p>${article.excerpt}</p>
    ${byline({ article })}
  </article>`
}
