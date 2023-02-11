import { RequestedDataItem } from "../types/parsing"

export const missedClassesSelectors: RequestedDataItem[] = [
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
]
