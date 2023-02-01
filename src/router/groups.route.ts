import { Request, Response } from "express"
import { RedisClient } from "../index"

interface Group {
  Name: string
  isCD: "0" | "1" | "2"
  id: string
  Kurs: number
}

class GroupResolver {
  name: string
  id: string

  constructor(group: Group) {
    this.name = group.Name
    this.id = group.id
  }
}

export default async function (req: Request, res: Response, redis: RedisClient) {
  const cachedData = await redis.GET("groups")
  if (cachedData) return res.setHeader("Content-Type", "application/json").send(cachedData)

  let result = [] as GroupResolver[][][]
  let data = {} as { [key: string]: Group }

  await fetch("https://almetpt.ru/2020/json/groups", {
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((res) => res.json())
    .then((json) => (data = json.groups))

  for (const aptGroup of Object.values(data)) {
    if (aptGroup.isCD !== "0" && aptGroup.isCD !== "1") continue
    const group = new GroupResolver(aptGroup)

    let cd = result[parseInt(aptGroup.isCD)]

    if (!cd) {
      let newCD = [] as GroupResolver[][]
      newCD[aptGroup.Kurs - 1] = [group]
      result[parseInt(aptGroup.isCD)] = newCD
      continue
    }

    const course = result[parseInt(aptGroup.isCD)][aptGroup.Kurs - 1]

    if (!course) {
      result[parseInt(aptGroup.isCD)][aptGroup.Kurs - 1] = [group]
    } else {
      course.push(group)
    }
  }

  redis.set("groups", JSON.stringify(result))

  return res.json(result)
}
