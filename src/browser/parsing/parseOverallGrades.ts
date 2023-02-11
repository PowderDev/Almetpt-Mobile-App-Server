import { Page } from "puppeteer"
import { getSchoolReportHTML } from "../../lib/http/overallGrades"
import { getDate } from "../../lib/utils/journal"
import { formatOverallGrades, overallGradesSelectors } from "../../lib/utils/overallGrades"
import { getParsedDataBySelector } from "../../lib/utils/parsing"

export default async function parseOverallGrades(page: Page, elco_session: string) {
  const { year, now, semestr } = getDate()

  const html = await getSchoolReportHTML(year - 1, now, semestr, elco_session)
  await page.setContent(html)

  const data = await getParsedDataBySelector(
    page,
    "body > table:nth-child(3) > tbody",
    overallGradesSelectors
  )

  return formatOverallGrades(data)
}
