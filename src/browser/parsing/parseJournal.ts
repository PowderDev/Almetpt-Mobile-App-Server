import { Page } from "puppeteer"
import { getParsedDataBySelector, getParsedGradesTable } from "../../lib/utils/parsing"
import { formatZippedClassesAndGrades, zipClassesAndGrades } from "../../lib/utils/index"
import { Grade } from "../../lib/types/journal"
import { getDate } from "../../lib/utils/journal"
import { getGradesTableHTML } from "../../lib/http/journal"
import { getSchoolReportHTML } from "../../lib/http/overallGrades"

export default async function parseJournal(page: Page, elco_session: string) {
  let allGrades = [] as Grade[]

  const { year, monthsToLookAt, academicYear, semestr, now } = getDate()

  let currMonth = semestr == 1 ? 9 : 1

  for (; currMonth <= monthsToLookAt; currMonth++) {
    const html = await getGradesTableHTML(year, now, currMonth, academicYear, semestr, elco_session)
    await page.setContent(`<table>${html}</table>`)

    const gradesByMonth = await getParsedGradesTable(page, "body > table > tbody > tr", currMonth)

    allGrades = allGrades.concat(gradesByMonth)
  }

  const html = await getSchoolReportHTML(year - 1, now, semestr, elco_session)
  await page.setContent(html)

  const classNames = await getParsedDataBySelector(page, "table.outborder > thead > tr", [
    {
      name: "className",
      selector: "td",
      prop: "title",
    },
  ])

  const zippedClassesAndGrades = zipClassesAndGrades(classNames, allGrades)
  return formatZippedClassesAndGrades(zippedClassesAndGrades)
}
