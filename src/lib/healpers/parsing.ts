import { ElementHandle, Page } from "puppeteer"

interface RequestedDataItem {
  prop?: "textContent" | "src" | "title"
  selector: string
  name: string
  formatValue?: (val: string) => string
}

type ResponseDataItem = { [key: string]: string | number }
type ResponseData = ResponseDataItem[]

export interface Grade {
  day: string
  classIndex?: number
  grade: string
  month: number
}

export async function getParsedDataBySelectorAll(
  page: ElementHandle | Page,
  rootSelector: string,
  data: RequestedDataItem[]
) {
  // await page.waitForSelector(rootSelector)
  const elements = await page.$$(rootSelector)

  let res = [] as ResponseData

  for (const [index, element] of elements.entries()) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const itemsHandles = await element.$$(item.selector)

      for (const handle of itemsHandles) {
        let value = await getProperty(handle, item.prop)
        value = item.formatValue ? item.formatValue(value) : value

        const obj = {
          [item.name]: value || "Нет данных",
        }

        res[index] = res[index] ? { ...res[index], ...obj } : obj
      }
    }
  }

  return res.filter(Boolean)
}

export async function getParsedDataBySelector(
  page: ElementHandle | Page,
  rootSelector: string,
  data: RequestedDataItem[]
) {
  const element = await page.$(rootSelector)

  if (element) {
    let res = [] as ResponseData

    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const itemsHandles = await element.$$(item.selector)

      for (const handle of itemsHandles) {
        let value = await getProperty(handle, item.prop)
        value = item.formatValue ? item.formatValue(value) : value

        const obj = {
          [item.name]: value || "Нет данных",
        }

        res.push(obj)
      }
    }

    return res.filter(Boolean)
  } else {
    return []
  }
}

export async function getParsedGradesTable(
  page: ElementHandle | Page,
  rootSelector: string,
  month: number
) {
  const elements = await page.$$(rootSelector)

  let res = [] as Grade[]

  for (const element of elements) {
    const gradesByDay = (await element.$$eval("td", (els) => {
      return els.map((el) => el.textContent)
    })) as string[]

    const day = gradesByDay[0]

    for (let i = 1; i < gradesByDay.length; i++) {
      const grade = gradesByDay[i]

      if (grade) {
        res.push({ day, grade, classIndex: i, month })
      }
    }
  }
  return res
}

export async function getProperty(handle: ElementHandle, prop = "textContent"): Promise<string> {
  let content = await handle.getProperty(prop || "textContent")
  return (await content.jsonValue()) as string
}
