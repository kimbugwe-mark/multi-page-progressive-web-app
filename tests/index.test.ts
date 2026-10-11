import { afterEach, describe, expect, it } from "vitest"
import type { Server } from "node:http"
import { app } from "../src/app.ts"

let server: Server | undefined

async function openSite() {
  server = app.listen(0)
  await new Promise<void>((resolve) => server?.once("listening", resolve))
  const address = server.address()
  if (!address || typeof address === "string") throw new Error("Could not start test server")
  return `http://127.0.0.1:${address.port}`
}

afterEach(async () => {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => (error ? reject(error) : resolve()))
    })
    server = undefined
  }
})

describe("Morrow Journal", () => {
  it("renders the homepage with fake stories", async () => {
    const response = await fetch(await openSite())
    const body = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    expect(body).toContain("A slower kind of")
    expect(body).toContain("Making room for slower mornings")
  })

  it("filters stories by category and search query", async () => {
    const baseUrl = await openSite()
    const categoryResponse = await fetch(`${baseUrl}/?category=At%20home`)
    const categoryBody = await categoryResponse.text()
    const searchResponse = await fetch(`${baseUrl}/?q=noticing`)
    const searchBody = await searchResponse.text()

    expect(categoryBody).toContain("A home that grows with you")
    expect(categoryBody).not.toContain("The joy of making something just because")
    expect(searchBody).toContain("The art of noticing what is already here")
    expect(searchBody).not.toContain("A home that grows with you")
  })

  it("renders article details and returns a proper 404 for unknown stories", async () => {
    const baseUrl = await openSite()
    const articleResponse = await fetch(`${baseUrl}/articles/making-room-for-slower-mornings`)
    const articleBody = await articleResponse.text()
    const missingResponse = await fetch(`${baseUrl}/articles/not-a-story`)
    const missingBody = await missingResponse.text()

    expect(articleResponse.status).toBe(200)
    expect(articleBody).toContain("Put the kettle on.")
    expect(missingResponse.status).toBe(404)
    expect(missingBody).toContain("Story not found.")
  })
})
