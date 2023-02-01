import { Page } from "puppeteer"
import { getParsedDataBySelector } from "../../lib/healpers/parsing"

export default async function parseOverallGrades(page: Page, elco_session: string) {
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

  const data = await getParsedDataBySelector(page, "body > table:nth-child(3) > tbody", [
    {
      name: "yellows",
      selector: "tr:nth-child(4) > th",
    },
    {
      name: "reds",
      selector: "tr:nth-child(6) > th",
    },
    {
      name: "blues",
      selector: "tr:nth-child(8) > th",
    },
  ])

  const dataToOneObject = data.reduce((acc, item) => ({ ...acc, ...item }), {})
  return dataToOneObject
}
