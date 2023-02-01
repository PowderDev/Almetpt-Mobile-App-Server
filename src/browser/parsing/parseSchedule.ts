import { Page } from "puppeteer"
import { getParsedDataBySelector, getParsedDataBySelectorAll } from "../../lib/healpers/parsing"

export default async function parseSchedule(page: Page, groupId: string, date: string) {
  await page.goto(`https://almetpt.ru/2020/site/schedule/group/${groupId}/${date}`)

  const bodies = await page.$$(
    "body > main > div > div.container > div.card.myCard > div.card-body.p-0"
  )

  const res = [] as any[]

  for (const [index, body] of bodies.entries()) {
    const exists = await body.$("div.d-flex.flex-column")

    if (exists) {
      const cardBodyData = await getParsedDataBySelectorAll(body, "div.d-flex.flex-column", [
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
          formatValue: (v) => v.replace("&nbsp;", " "),
        },
      ])

      const cardHeaderData = await getParsedDataBySelector(
        page,
        `div.container > div:nth-child(${
          index + 3
        }) > div.card-header.bg-menu.text-white.pl-4.text-truncate`,
        [
          {
            name: "time",
            selector: "span.pl-2.h4",
            formatValue: (val) =>
              val
                .split(" - ")
                .map((v) => `${v.slice(0, 2)}:${v.slice(2, 4)}`)
                .join(" - "),
          },
          {
            name: "number",
            selector: "span.h3",
          },
        ]
      )

      res.push({
        header: cardHeaderData.reduce((acc, item) => ({ ...acc, ...item }), {}),
        content: cardBodyData,
      })
    }
  }
  return res
}
