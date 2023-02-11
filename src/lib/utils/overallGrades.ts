import { RequestedDataItem, ResponseDataItem } from "../types/parsing"

export const overallGradesSelectors: RequestedDataItem[] = [
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
]

export const formatOverallGrades = (data: ResponseDataItem[]) =>
  data.reduce((acc, item) => ({ ...acc, ...item }), {})
