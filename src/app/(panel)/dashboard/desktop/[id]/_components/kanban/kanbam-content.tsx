import { GroupWithItems } from "../main-board/group-content";
import { KanbanGrid } from "./kanban-grid";
export interface KanbanProps {
  groupsData: GroupWithItems[];
}
export function KanbanContent({ groupsData }: KanbanProps) {
  return (
    <article>
      <KanbanGrid groupsData={groupsData || []} />
    </article>
  )
}