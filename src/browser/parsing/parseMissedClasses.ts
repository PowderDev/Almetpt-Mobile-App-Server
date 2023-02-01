import { Page } from "puppeteer"
import { getParsedDataBySelectorAll } from "../../lib/healpers/parsing"

export default async function parseMissedClasses(page: Page, elco_session: string) {
  const date = new Date()
  const year = date.getFullYear()
  const now = date.getMilliseconds()

  const schoolReportResponse = await fetch(
    `https://almetpt.ru/students/magazine?semestr=2&academicYear=${year - 1}&_=${now}`,
    {
      headers: {
        Cookie: `elco_session=${elco_session}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  )

  const html = await schoolReportResponse.text()
  await page.setContent(html)

  const data = await getParsedDataBySelectorAll(page, "#tableBooks > tbody > tr", [
    {
      name: "date",
      selector: "td:nth-child(1)",
    },
    {
      name: "number",
      selector: "td:nth-child(2)",
    },
    {
      name: "name",
      selector: "td:nth-child(3)",
    },
  ])

  return data
}
