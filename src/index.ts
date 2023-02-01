import { getBrowser } from "./browser/config"
import express from "express"
import bodyParser from "body-parser"

import { createClient } from "redis"
import scheduleRoute from "./router/schedule.route"
import journalRoute from "./router/journal.route"
import overallGradesRoute from "./router/overallGrades.route"
import missedClassesRoute from "./router/missedClasses.route"
import loginRoute from "./router/login.route"
import groupsRoute from "./router/groups.route"

const redis = createClient()
const app = express()

app.use(bodyParser.json())

export type RedisClient = typeof redis

async function bootstrap() {
  await redis.connect()
  redis.on("error", (err) => console.log("Redis Client Error", err))

  const browser = await getBrowser()
  const page = await browser.newPage()
  page.setRequestInterception(true)

  const block_ressources = ["image", "stylesheet", "media", "font"]
  page.on("request", (request) => {
    if (block_ressources.includes(request.resourceType())) request.abort()
    else request.continue()
  })

  app.get("/groups", (req, res) => groupsRoute(req, res, redis))
  app.get("/schedule/:groupId/:date", (req, res) => scheduleRoute(req, res, redis, page))
  app.get("/journal/:name", (req, res) => journalRoute(req, res, redis, page))
  app.get("/overall/:name", (req, res) => overallGradesRoute(req, res, redis, page))
  app.get("/missed/:name", (req, res) => missedClassesRoute(req, res, redis, page))
  app.post("/login", (req, res) => loginRoute(req, res))

  app.listen(4000, () => console.log("The App is up and running"))
  process.on("exit", async () => await browser.close())
}

bootstrap()
