import { GroupWithItems } from "../main-board/group-content";
import { CalendarGrid } from "./calendar-grid";

export function CalendarContent({ groupsData }: { groupsData: GroupWithItems[] }) {
  return (
    <article>
      <CalendarGrid groupsData={groupsData} />
    </article>
  )
}