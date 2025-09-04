"use client"

import { Button } from "@/components/ui/button"
import { Plus, Trash } from "lucide-react"
import { goalCompletion } from "../_actions/goal-completion"
import { toast } from "react-toastify"
import { deleteGoal } from "../_actions/delete-goal"
import { PendingGoal } from "../_types"
import { cn } from "@/lib/utils"

export function PedingGoals({ data }: { data: PendingGoal[] }) {

  async function handleCompleteGoal(goalId: string) {
    if (!goalId) {
      toast.error("Falha ao completar meta");
      return;
    }
    try {
      const response = await goalCompletion({ goalId });
      if (response.error) {
        toast.error(response.error);
      }
      toast.success(response.data);
    } catch (error) {
      toast.error("Falha ao completar meta");
    }
  }

  async function handleDeleteGoal(goalId: string) {
    if (!goalId) {
      toast.error("Falha ao deletar meta");
      return;
    }
    try {
      const response = await deleteGoal({ goalId });
      if (response.error) {
        toast.error(response.error);
      }
      toast.success(response.data);
    } catch (error) {
      toast.error("Falha ao deletar meta");
    }
  }
  return (
    <div className="flex flex-wrap gap-4">
      {data.map(goal => (
        <div key={goal.id} className={cn("flex items-center border rounded-lg hover:border-primary",
          goal.completionCount >= goal.desiredWeeklyFrequency ? "hover:bg-accent/5" : "hover:bg-accent"
        )}>
          <Button
            disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
            variant={"ghost"}
            className="hover:bg-transparent cursor-pointer"
            onClick={() => handleCompleteGoal(goal.id)}
          >
            <Plus />
            {goal.title}  ({goal.completionCount}/{goal.desiredWeeklyFrequency})
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:bg-transparent cursor-pointer hover:text-zinc-500"
            onClick={() => handleDeleteGoal(goal.id)}
          >
            <Trash />
          </Button>
        </div>
      ))}
    </div>
  )
}
