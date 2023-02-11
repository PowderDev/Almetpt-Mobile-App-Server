import { useFetch } from "./index"

export const getGradesTableHTML = async (
  year: number,
  now: number,
  currMonth: number,
  academicYear: number,
  semestr: number,
  elco_session: string
) => {
  const pageRes = await useFetch(
    `https://almetpt.ru/students/monMagazine?month=${currMonth}&year=${year}&academicYear=${academicYear}&semestr=${semestr}&_now=${now}`,
    elco_session
  )
  return await pageRes.text()
}
