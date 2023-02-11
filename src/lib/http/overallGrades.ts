import { useFetch } from "./index"

export const getSchoolReportHTML = async (
  year: number,
  now: number,
  semestr: number,
  elco_session: string
) => {
  const pageRes = await useFetch(
    `https://almetpt.ru/students/magazine?semestr=${semestr}&academicYear=${year}&_=${now}`,
    elco_session
  )
  return await pageRes.text()
}
