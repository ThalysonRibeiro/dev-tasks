"use client"

import { useState } from "react";
import { Header } from "../../_components/header";
import { CalendarContent } from "./calendar/calendar-content";
import { GroupContent, GroupWithItems } from "./main-board/group-content";
import { KanbanContent } from "./kanban/kanbam-content";

interface DesktopContentProps {
  groupsData: GroupWithItems[];
  desktopId: string;
}
export type TabKey = "main-board" | "kanban" | "calendar";
export function DesktopContent({ groupsData, desktopId }: DesktopContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey | string>("main-board");

  const tabsConfig = [
    {
      key:
        "main-board",
      label: "Quadro principal",
      component: <GroupContent groupsData={groupsData} desktopId={desktopId} />
    },
    {
      key:
        "kanban",
      label:
        "Kanban",
      component: groupsData.length === 0 ? <p>Nenhum item encontrado</p> : <KanbanContent groupsData={groupsData} />
    },
    {
      key:
        "calendar",
      label:
        "Calendário",
      component: groupsData.length === 0 ? <p>Nenhum item encontrado</p> : <CalendarContent groupsData={groupsData} />
    }
  ];
  return (
    <section className="space-y-6">
      <Header tabs={tabsConfig} activeTab={activeTab} onTabChange={setActiveTab} />
      {tabsConfig.find(tab => tab.key === activeTab)?.component}
    </section>
  )
}