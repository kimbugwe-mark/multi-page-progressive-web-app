import { html } from "achi-html-stream"
import { articleCard } from "../components/article-card.ts"
import { byline } from "../components/byline.ts"
import { siteLayout } from "../layouts/site-layout.ts"
import type { HomePageData } from "../../backend/home-page-data.ts"

function featuredStory(article: Article) {
  return html`<section class="feature shell" aria-label="Featured story">
    <img class="feature-image" src="${article.image}" alt="${article.imageAlt}" />
    <div class="feature-copy">
      <span class="kicker">The Sunday Edit · ${article.category}</span>
      <h2><a href="/articles/${article.slug}">${article.title}</a></h2>
      <p>${article.excerpt}</p>
      ${byline({ article })}
      <a class="read-link" href="/articles/${article.slug}">Read the story <span>→</span></a>
    </div>
  </section>`
}

function storyFilters(filters: HomePageData["filters"]) {
  return html`<nav class="filters" aria-label="Filter stories by topic">
    ${filters.map(({ name, href, active }) =>
      html`<a class="filter ${active ? "active" : ""}" href="${href}">${name}</a>`
    )}
  </nav>`
}

function emptyStories() {
  return html`<div class="empty">
    <h3>No stories found just yet.</h3>
    <p>Try another search or browse all of our notes.</p>
    <a class="read-link" href="/">See all stories <span>→</span></a>
  </div>`
}

function newsletter() {
  return html`<aside class="newsletter shell">
    <span class="eyebrow">A note for your inbox</span>
    <h2>Make a little room for Morrow.</h2>
    <p>Thoughtful reads for your slower Sunday. No noise, just the good stuff.</p>
  </aside>`
}

export function homePage({ heading, storyCountMessage, filters, featuredArticle, stories }: HomePageData) {
  return siteLayout({
    title: "A slower kind of everyday",
    activeNavigation: "home",
    content: html`<main>
      <section class="hero shell">
        <span class="eyebrow">Notes for the everyday</span>
        <h1>A slower kind of<br />everyday.</h1>
        <p>Stories, ideas, and little reminders for living with more intention and a little less hurry.</p>
      </section>
      ${featuredArticle ? featuredStory(featuredArticle) : ""}
      <section class="stories shell">
        <div class="section-heading">
          <div><h2>${heading}</h2><p>${storyCountMessage}</p></div>
        </div>
        ${storyFilters(filters)}
        <div class="grid">
          ${stories.length ? stories.map((article) => articleCard({ article })) : emptyStories()}
        </div>
      </section>
      ${newsletter()}
    </main>`
  })
}
