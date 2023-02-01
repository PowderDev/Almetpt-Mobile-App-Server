import { Request, Response } from "express"

export default async function (req: Request, res: Response) {
  const { name, password } = req.body

  const studentCredentials = new FormData()
  studentCredentials.append("name", name)
  studentCredentials.append("password", password)
  studentCredentials.append("remember", "1")

  const aptLoginRes = await fetch("https://almetpt.ru/2020/json/login", {
    method: "POST",
    body: studentCredentials,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })

  const elco_session = aptLoginRes.headers.get("set-cookie")?.split(";")[0].split("=")[1]!

  return res.json({ elco_session })
}
