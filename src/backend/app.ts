import express, { type Express } from "express";
import { render } from "achi-html-stream";
import { articles } from "./data.ts";
import { getHomePageData } from "./home-page-data.ts";
import { articlePage } from "../views/pages/article-page.ts";
import { homePage } from "../views/pages/home-page.ts";
import { notFoundPage } from "../views/pages/not-found-page.ts";
import path from "path";

const app: Express = express();

app.use(express.static(path.join(import.meta.dirname, "public")));

app.get("/", (req, res) => {
  const search = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const category =
    typeof req.query.category === "string" ? req.query.category : "";
  const homeData = getHomePageData({ search, category });

  if (req.headers['x-service-worker'] !== undefined) {
    res.json(homeData);
  } else {
    render(res, homePage(homeData));
  }
});

app.get("/articles/:slug", (req, res) => {
  const article = articles.find((item) => item.slug === req.params.slug);

  if (req.headers['x-service-worker'] !== undefined) {
    res.json(article);
    return;
  }
  if (!article) {
    render(res, notFoundPage(), {}, 404, "Not Found");
    return;
  }

  render(res, articlePage({ article }));
});

export { app };
