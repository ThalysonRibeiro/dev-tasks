"use client"
import { ItemsTables } from "./items-tables";
import { GroupWithItems } from "./group-content";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, ChevronsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CompletedItems({ groupsData }: { groupsData: GroupWithItems[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const completedItems = groupsData.flatMap(group =>
    group.item.filter(item => item.status === 'DONE')
  );

  if (completedItems.length === 0) {
    return (
      <p>Nenhum item concluído</p>
    )
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-green-500 text-lg font-bold">Concluídos: <span className="text-sm font-normal">({completedItems.length})</span></h3>
        <button className="cursor-pointer" onClick={() => setIsOpen(prev => !prev)}>
          <ChevronDown className={cn("cursor-pointer transition-all duration-300", isOpen && "-rotate-90")} />
        </button>
      </div>
      <Collapsible
        open={isOpen}
        className="ml-6 space-y-4 border-l border-green-500 pl-4">
        <CollapsibleContent>
          <ItemsTables items={completedItems} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}