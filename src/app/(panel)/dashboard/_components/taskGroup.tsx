"use client"
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import { TasksGroupWithTasks } from "./tasks-content";
import { TaskGroupForm } from "./task-group-form";
import { deleteTaskGroup } from "../_actions/delete-taskGroup";
import { toast } from "react-toastify";


export function TaskGroup({ tasksData }: { tasksData: TasksGroupWithTasks[]; }) {
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addTaskGroup, setAddTaskGroup] = useState<boolean>(false);
  const [editingGroupInline, setEditingGroupInline] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<null | TasksGroupWithTasks>(null);

  function handleEditeGroup(group: TasksGroupWithTasks) {
    setEditingGroupInline(true);
    setEditingGroup(group);
  }

  function updateAddTaskGroup(newValue: boolean): boolean {
    setAddTaskGroup(newValue);
    return newValue;
  }
  function updateEditingGroupInline(newValue: boolean): boolean {
    setEditingGroupInline(newValue);
    return newValue;
  }

  function handleDeleteTaskGroup(id: string) {
    deleteTaskGroup(id);
    toast.success("Grupo deletado com sucesso!")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {tasksData.map((taskGroup) => (
          <div key={taskGroup.id}>

            {editingGroupInline && editingGroup?.id === taskGroup.id ? (
              <TaskGroupForm
                setAddTaskGroup={updateEditingGroupInline}
                groupId={editingGroup ? editingGroup.id : undefined}
                initialValues={editingGroup ? {
                  title: editingGroup.title,
                  textColor: editingGroup.textColor
                } : undefined}
              />
            ) : (
              <div>
                <div className="flex gap-4 items-center">
                  <h2
                    className="font-bold text-lg"
                    style={{ color: taskGroup.textColor }}
                    onClick={() => handleEditeGroup(taskGroup)}
                  >
                    {taskGroup.title}
                  </h2>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    className="border-dashed cursor-pointer"
                    onClick={() => handleDeleteTaskGroup(taskGroup.id)}
                  >
                    <Trash />
                  </Button>
                </div>
                <h3>13</h3>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div>
          {addTaskGroup && (
            <TaskGroupForm
              setAddTaskGroup={updateAddTaskGroup}
            />
          )}
        </div>
        {!addTaskGroup && (
          <Button onClick={() => setAddTaskGroup(true)} variant={"outline"} className="border-dashed">
            Adicionar <Plus />
          </Button>
        )}
      </div>
    </div>
  )
}