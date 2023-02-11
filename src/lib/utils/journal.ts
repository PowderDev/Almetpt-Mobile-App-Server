export const getDate = () => {
  const date = new Date()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const now = date.getMilliseconds()
  const semestr = month >= 9 ? 1 : 2

  let academicYear = semestr == 1 ? year : year - 1
  const monthsToLookAt = semestr == 1 ? month - (month - 9) + 1 : month

  return {
    date,
    month,
    year,
    now,
    academicYear,
    monthsToLookAt,
    semestr,
  }
}
