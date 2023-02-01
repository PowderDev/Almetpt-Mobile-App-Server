import { Request, Response } from "express"
import { Page } from "puppeteer"
import parseOverallGrades from "../browser/parsing/parseOverallGrades"
import { RedisClient } from "../index"

export default async function (req: Request, res: Response, redis: RedisClient, page: Page) {
  const { name } = req.params
  const { elco_session } = req.query

  if (typeof elco_session == "string") {
    const cachedData = await redis.GET(`overallGrades/${name}`)
    if (cachedData) return res.setHeader("Content-Type", "application/json").send(cachedData)

    const data = await parseOverallGrades(page, elco_session)

    await redis.set(`overallGrades/${name}`, JSON.stringify(data), {
      EX: 60 * 10,
    })
    return res.json(data)
  } else {
    return res.status(401).json({ message: "elco_session is not provided" })
  }
}
