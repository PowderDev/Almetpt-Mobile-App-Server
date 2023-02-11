import { Request, Response } from "express"
import { RedisClient } from "../index"
import { getGroups } from "../lib/http/group"
import { formatGroups } from "../lib/utils/group"

export default async function (_: Request, res: Response, redis: RedisClient) {
  const cachedData = await redis.GET("groups")
  if (cachedData) return res.setHeader("Content-Type", "application/json").send(cachedData)

  let data = await getGroups()
  let groups = formatGroups(data)

  redis.set("groups", JSON.stringify(groups))
  return res.json(groups)
}
