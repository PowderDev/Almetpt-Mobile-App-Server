import { Page } from "puppeteer"
import { getParsedDataBySelector, getParsedDataBySelectorAll } from "../../lib/utils/parsing"
import { getScheduleHTML } from "../../lib/http/schedule"
import {
  cardContentSelectors,
  cardHeaderSelectors,
  combineCardHeaderWithBody,
} from "../../lib/utils/schedule"

export default async function parseSchedule(page: Page, groupId: string, date: string) {
  const html = await getScheduleHTML(groupId, date)
  await page.setContent(html)

  const cardBodySelector = "body > main > div > div.container > div.card.myCard > div.card-body.p-0"
  const bodies = await page.$$(cardBodySelector)

  const res = [] as any[]

  for (const [index, body] of bodies.entries()) {
    const exists = await body.$("div.d-flex.flex-column")

    if (exists) {
      const cardContent = await getParsedDataBySelectorAll(
        body,
        "div.d-flex.flex-column",
        cardContentSelectors
      )

      const cardHeader = await getParsedDataBySelector(
        page,
        `div.container > div:nth-child(${
          index + 3
        }) > div.card-header.bg-menu.text-white.pl-4.text-truncate`,
        cardHeaderSelectors
      )

      res.push(combineCardHeaderWithBody(cardHeader, cardContent))
    } else if (!exists && index > 2) {
      break
    }
  }
  return res
}
