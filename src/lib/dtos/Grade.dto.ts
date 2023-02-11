import { Grade } from "../types/journal"

export default class GradeDto {
  day: string
  grade: string
  month: number

  constructor(item: Grade) {
    this.day = item.day
    this.grade = item.grade
    this.month = item.month
  }
}
