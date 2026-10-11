import { render } from "achi-html-stream";
import { Hono } from "hono";
import { homePage } from "../../views/pages/home-page.ts";
import { articlePage } from "../../views/pages/article-page.ts";
import { notFoundPage } from "../../views/pages/not-found-page.ts";
import { networkCache } from "./strategies.ts";

const app = new Hono().basePath("/");

app.get("/", async (context) => {
  const request = new Request(context.req.raw, {
    headers: { "x-service-worker": "true" },
  });
  const category = context.req.query("category");
  const response = category!==''
    ? await networkCache(request)
    : await fetch(request);

  
  try {
    const data = await response.json();

    return render(homePage(data));
  } catch (error) {
    console.log(error);
    return new Response("error has occurred");
  }
});

app.get("/articles/:slug", async (context) => {
  const request = new Request(context.req.raw, {
    headers: { "x-service-worker": "true" },
  });
  const response = await networkCache(request);
  const article = (await response.json()) as
    | Record<string, unknown>
    | undefined;

  if (!article) {
    return render(notFoundPage(), {}, 404, "Not Found");
  }

  return render(articlePage({ article: article as any }));
});

app.get('*',context=>{
  return networkCache(context.req.raw)
})
export { app };
