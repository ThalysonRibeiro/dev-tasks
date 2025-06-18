"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Prisma, Tasks } from "@/generated/prisma"
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { TaskGroup } from "./taskGroup";

export type TasksGroupWithTasks = Prisma.TasksGroupGetPayload<{
  include: {
    tasks: true
  }
}>

interface TasksContentProps {
  tasksData: TasksGroupWithTasks[];
}

export function TasksContent({ tasksData }: TasksContentProps) {

  return (
    <article>
      <div>
        <TaskGroup tasksData={tasksData} />

      </div>
      {/* <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead><Checkbox /> Titulo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Inicio</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead className="text-right">Orçamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell><Checkbox /> {task.title}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{format(task.startDate, "dd/MM/yyyy")}</TableCell>
              <TableCell>{format(task.endDate, "dd/MM/yyyy")}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.notes}</TableCell>
              <TableCell className="text-right">{task.budget}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </article>
  )
}