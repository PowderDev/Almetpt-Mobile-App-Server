import { Page } from "puppeteer"
import { getSchoolReportHTML } from "../../lib/http/overallGrades"
import { getDate } from "../../lib/utils/journal"
import { missedClassesSelectors } from "../../lib/utils/missedClasses"
import { getParsedDataBySelectorAll } from "../../lib/utils/parsing"

export default async function parseMissedClasses(page: Page, elco_session: string) {
  const { year, now, semestr } = getDate()

  const html = await getSchoolReportHTML(year - 1, now, semestr, elco_session)
  await page.setContent(html)

  const data = await getParsedDataBySelectorAll(
    page,
    "#tableBooks > tbody > tr",
    missedClassesSelectors
  )

  return data
}
