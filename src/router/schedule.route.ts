import { Request, Response } from "express"
import { Page } from "puppeteer"
import parseSchedule from "../browser/parsing/parseSchedule"
import { RedisClient } from "../index"

export default async function (req: Request, res: Response, redis: RedisClient, page: Page) {
  const { groupId, date } = req.params

  try {
    const cachedData = await redis.GET(`schedule/${groupId}/${date}`)
    if (cachedData) return res.setHeader("Content-Type", "application/json").send(cachedData)

    const data = await parseSchedule(page, groupId, date)

    if (new Date(date) >= new Date()) {
      await redis.set(`schedule/${groupId}/${date}`, JSON.stringify(data), {
        EX: 60 * 10,
      })
    } else {
      await redis.set(`schedule/${groupId}/${date}`, JSON.stringify(data))
    }
    return res.json(data)
  } catch {
    return res.status(400).json({ message: "Unknown issue" })
  }
}
