"use client"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TasksGroupWithTasks } from "./tasks-content";
import { TaskGroupForm } from "./task-group-form";


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

  return (
    <div className="space-y-6">
      <div>
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
              <h2
                className="font-bold text-lg"
                style={{ color: taskGroup.textColor }}
                onClick={() => handleEditeGroup(taskGroup)}
              >
                {taskGroup.title}
              </h2>
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