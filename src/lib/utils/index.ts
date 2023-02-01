import { Grade } from "../healpers/parsing"
import { JournalItem } from "../types/index"
import GradeDto from "./Grade.dto"

export function zipObjects(...rows: any[][]) {
  return rows[0].map(
    (_, i) => rows.map((row) => row[i]).reduce((acc, item) => ({ ...acc, ...item })),
    {}
  )
}

export function formatZippedClassesAndGrades(zipped: JournalItem[]) {
  return zipped.map((c) => ({
    ...c,
    grades: c.grades.reduce(gradesReducer, []).filter(Boolean),
  }))
}

function gradesReducer(acc: GradeDto[][], item: Grade, i: number, gs: Grade[]) {
  if (i == 0 || item.month != gs[i - 1].month) {
    acc[item.month - 1] = [new GradeDto(item)]
  } else {
    acc[item.month - 1].push(new GradeDto(item))
  }
  return acc
}
