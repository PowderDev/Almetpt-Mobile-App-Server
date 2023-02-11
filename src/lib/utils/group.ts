import { GroupDto } from "../dtos/Group.dto"
import { GroupsResponse } from "../http/group"

export const formatGroups = (data: GroupsResponse) => {
  let result = [] as GroupDto[][][]

  for (const aptGroup of Object.values(data)) {
    if (aptGroup.isCD !== "0" && aptGroup.isCD !== "1") continue
    const group = new GroupDto(aptGroup)

    let cd = result[parseInt(aptGroup.isCD)]

    if (!cd) {
      let newCD = [] as GroupDto[][]
      newCD[aptGroup.Kurs - 1] = [group]
      result[parseInt(aptGroup.isCD)] = newCD
      continue
    }

    const course = result[parseInt(aptGroup.isCD)][aptGroup.Kurs - 1]

    if (!course) {
      result[parseInt(aptGroup.isCD)][aptGroup.Kurs - 1] = [group]
    } else {
      course.push(group)
    }
  }

  return result
}
