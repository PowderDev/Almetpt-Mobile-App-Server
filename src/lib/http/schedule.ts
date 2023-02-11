import { useFetch } from "./index"

export const getScheduleHTML = async (groupId: string, date: string) => {
  const pageRes = await useFetch(`http://almetpt.ru/2020/site/schedule/group/${groupId}/${date}`)
  return await pageRes.text()
}
