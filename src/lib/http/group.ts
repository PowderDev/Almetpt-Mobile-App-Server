import { Group } from "../types/group"
import { useFetch } from "./index"

export type GroupsResponse = { [key: string]: Group }

export async function getGroups(): Promise<GroupsResponse> {
  const res = await useFetch("https://almetpt.ru/2020/json/groups")
  const data = await res.json()
  return data.groups
}
