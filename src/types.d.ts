
  interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  initials: string
  date: string
  readTime: string
  image: string
  imageAlt: string
  featured?: boolean
  body: string[]
}

type HomePageDataParams = {
  search: string
  category: string
}

type HomePageFilter = {
  name: string
  href: string
  active: boolean
}
