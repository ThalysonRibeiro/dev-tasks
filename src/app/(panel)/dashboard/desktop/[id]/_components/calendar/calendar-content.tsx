import { GroupWithItems } from "../main-board/group-content";
import { GanttCalendar } from "./calendar-grid";

export function CalendarContent({ groupsData }: { groupsData: GroupWithItems[] }) {
  return (
    <article>
      <GanttCalendar groupsData={groupsData} />
    </article>
  )
}