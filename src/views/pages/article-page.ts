import { html } from "achi-html-stream"
import { byline } from "../components/byline.ts"
import { siteLayout } from "../layouts/site-layout.ts"

export function articlePage({ article }: { article: Article }) {
  return siteLayout({
    title: article.title,
    content: html`<main class="shell">
      <article class="article">
        <a class="back" href="/">← Back to all stories</a>
        <header class="article-header">
          <span class="kicker">${article.category}</span>
          <h1>${article.title}</h1>
          <p>${article.excerpt}</p>
          ${byline({ article })}
        </header>
        <img class="article-cover" src="${article.image}" alt="${article.imageAlt}" />
        <div class="article-body">
          ${article.body.map((paragraph) => html`<p>${paragraph}</p>`)}
          <div class="article-end">Thank you for spending a little time with Morrow.</div>
        </div>
      </article>
    </main>`
  })
}
