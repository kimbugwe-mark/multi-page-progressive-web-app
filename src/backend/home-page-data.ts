import { articles, categories, } from "./data.ts"



export type HomePageData = {
  heading: string
  storyCountMessage: string
  filters: HomePageFilter[]
  featuredArticle?: Article
  stories: Article[]
}

export function getHomePageData({ search, category }: HomePageDataParams): HomePageData {
  const featuredArticle = articles.find((article) => article.featured)
  const filteredStories = articles.filter((article) => {
    const matchesCategory = !category || category === "All stories" || article.category === category
    const searchText = `${article.title} ${article.excerpt} ${article.category} ${article.author}`.toLowerCase()
    return matchesCategory && searchText.includes(search.toLowerCase())
  })
  const showFeaturedStory = !search && (!category || category === "All stories")
  const stories = filteredStories.filter(
    (article) => !showFeaturedStory || article.slug !== featuredArticle?.slug
  )
  const heading = search
    ? `Search results for “${search}”`
    : category && category !== "All stories"
      ? category
      : "The latest stories"

  return {
    heading,
    storyCountMessage: `${stories.length} ${stories.length === 1 ? "story" : "stories"} to spend a little time with`,
    filters: categories.map((name) => ({
      name,
      href: name === "All stories" ? "/" : `/?category=${encodeURIComponent(name)}`,
      active: (!category && name === "All stories") || category === name
    })),
    featuredArticle: showFeaturedStory ? featuredArticle : undefined,
    stories
  }
}
