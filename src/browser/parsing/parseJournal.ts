import { Page } from "puppeteer"
import { getParsedDataBySelector, getParsedGradesTable, Grade } from "../../lib/healpers/parsing"
import { JournalItem } from "../../lib/types/index"
import { formatZippedClassesAndGrades } from "../../lib/utils/index"

export default async function parseJournal(page: Page, elco_session: string) {
  let allGrades = [] as Grade[]

  const date = new Date()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const now = date.getMilliseconds()

  let semestr = 2

  if (month >= 9) semestr = 1

  let aYear = semestr == 1 ? year : year - 1

  const monthsToLookAt = semestr == 1 ? month - (month - 9) + 1 : month

  let currMonth = semestr == 1 ? 9 : 1

  for (; currMonth <= monthsToLookAt; currMonth++) {
    const tableOfGradesByMonthResponse = await fetch(
      `https://almetpt.ru/students/monMagazine?month=${currMonth}&year=${year}&academicYear=${aYear}&semestr=${semestr}&_now=${now}`,
      {
        headers: {
          Cookie: `elco_session=${elco_session}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    )

    const html = await tableOfGradesByMonthResponse.text()
    await page.setContent(`<table>${html}</table>`)

    const gradesByMonth = await getParsedGradesTable(page, "body > table > tbody > tr", currMonth)

    allGrades = allGrades.concat(gradesByMonth)
  }

  const schoolReportResponse = await fetch(
    `https://almetpt.ru/students/magazine?semestr=${semestr}&academicYear=${aYear}&_=${now}`,
    {
      headers: {
        Cookie: `elco_session=${elco_session}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  )

  const html = await schoolReportResponse.text()
  await page.setContent(html)

  const classNames = await getParsedDataBySelector(page, "table.outborder > thead > tr", [
    {
      name: "className",
      selector: "td",
      prop: "title",
    },
  ])

  const zippedClassesAndGrades = classNames.map((c, i) => {
    const grades = allGrades.filter((g) => g.classIndex === i)
    return { ...c, grades } as JournalItem
  })

  return formatZippedClassesAndGrades(zippedClassesAndGrades)
}
