import { Request, Response } from "express"
import { Page } from "puppeteer"
import parseMissedClasses from "../browser/parsing/parseMissedClasses"
import { RedisClient } from "../index"

export default async function (req: Request, res: Response, redis: RedisClient, page: Page) {
  const { name, password } = req.params
  const { elco_session } = req.query

  if (typeof elco_session == "string") {
    const cachedData = await redis.GET(`missedClasses/${name}/${password}`)
    if (cachedData) return res.setHeader("Content-Type", "application/json").send(cachedData)

    const data = await parseMissedClasses(page, elco_session)

    await redis.set(`missedClasses/${name}/${password}`, JSON.stringify(data), {
      EX: 60 * 10,
    })

    return res.json(data)
  } else {
    return res.status(401).json({ message: "elco_session is not provided" })
  }
}
