import { RequestedDataItem, ResponseDataItem } from "../types/parsing"

const formatShortTeacher = (v: string) => v.replace("&nbsp;", " ")

export const cardContentSelectors: RequestedDataItem[] = [
  {
    name: "auditorium",
    selector:
      "div.d-flex.justify-content-between.font-italic.px-3.pt-1.align-items-baseline.text-truncate > span:nth-child(2) > span > a",
  },
  {
    name: "shortTitle",
    selector: "div.d-md-none.text-center.text-truncate",
  },
  {
    name: "title",
    selector: "div.d-none.d-md-block",
  },
  {
    name: "subgroup",
    selector:
      "div.d-flex.justify-content-between.font-italic.px-3.pt-1.align-items-baseline.text-truncate > span.rounded > span",
  },
  {
    name: "teacher",
    selector:
      "div.d-flex.justify-content-between.font-italic.px-3.pt-1.align-items-baseline.text-truncate > span.d-none.d-md-block > span",
  },
  {
    name: "shortTeacher",
    selector:
      "div.d-flex.justify-content-between.font-italic.px-3.pt-1.align-items-baseline.text-truncate > span.d-md-none.h5 > span",
    formatValue: formatShortTeacher,
  },
]

const formatTime = (v: string) =>
  v
    .split(" - ")
    .map((v) => `${v.slice(0, 2)}:${v.slice(2, 4)}`)
    .join(" - ")

export const cardHeaderSelectors: RequestedDataItem[] = [
  {
    name: "time",
    selector: "span.pl-2.h4",
    formatValue: formatTime,
  },
  {
    name: "number",
    selector: "span.h3",
  },
]

export const combineCardHeaderWithBody = (header: ResponseDataItem[], body: ResponseDataItem[]) => {
  return {
    header: header.reduce((acc, item) => ({ ...acc, ...item }), {}),
    content: body,
  }
}
