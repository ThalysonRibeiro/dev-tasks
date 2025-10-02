"use client"

import { useState } from "react";
import { Header } from "../../_components/header";
import { GroupContent, GroupWithItems } from "./main-board/group-content";
import { KanbanContent } from "./kanban/kanban-content";
import { PrioritiesCount } from "../_data-access/get-priorities";
import { StatusCount } from "../_data-access/get-status";

interface DesktopContentProps {
  groupsData: GroupWithItems[];
  desktopId: string;
  prioritiesData: PrioritiesCount[];
  statusData: StatusCount[];
}
export type TabKey = "main-board" | "kanban" | "calendar";
export function DesktopContent({ groupsData, desktopId, prioritiesData, statusData }: DesktopContentProps) {
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
  ];
  return (
    <section className="space-y-6">
      <Header tabs={tabsConfig} activeTab={activeTab} onTabChange={setActiveTab} prioritiesData={prioritiesData} statusData={statusData} />
      {tabsConfig.find(tab => tab.key === activeTab)?.component}
    </section>
  )
}