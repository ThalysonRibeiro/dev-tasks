import { GroupWithItems } from "../main-board/group-content";
import { GanttCalendar } from "./gantt-calendar";

export function CalendarContent({ groupsData }: { groupsData: GroupWithItems[] }) {
  return (
    <article>
      <GanttCalendar groupsData={groupsData} />
    </article>
  )
}