import { Grade } from "./journal"

export interface JournalItem {
  className: string
  grades: Grade[]
}
