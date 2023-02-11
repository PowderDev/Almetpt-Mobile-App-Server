import { Group } from "../types/group"

export class GroupDto {
  name: string
  id: string

  constructor(group: Group) {
    this.name = group.Name
    this.id = group.id
  }
}
