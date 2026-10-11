import { app } from "./app.ts"

const port = Number(3000)

app.listen(port, () => {
  console.log(`Morrow Journal is now running at http://localhost:${port}`)
})
