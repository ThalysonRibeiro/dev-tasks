"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GoalMetrics } from "../_types";
import { startOfWeek, endOfWeek, eachWeekOfInterval, format, getMonth } from "date-fns";

export async function getGoalsMetrics(): Promise<GoalMetrics | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    const goals = await prisma.goals.findMany({
      where: { userId: session.user.id },
      include: {
        goalCompletions: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (goals.length === 0) {
      return null;
    }

    const firstCompletion = await prisma.goalCompletions.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    const lastCompletion = await prisma.goalCompletions.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!firstCompletion || !lastCompletion) {
      return null;
    }

    const weeks = eachWeekOfInterval(
      {
        start: firstCompletion.createdAt,
        end: lastCompletion.createdAt,
      },
      { weekStartsOn: 1 }
    );

    const weeklyProgress = weeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekLabel = format(weekStart, "dd/MM");

      let completed = 0;
      let total = 0;

      goals.forEach((goal) => {
        const completionsInWeek = goal.goalCompletions.filter(
          (c) => c.createdAt >= weekStart && c.createdAt <= weekEnd
        ).length;
        completed += completionsInWeek;
        total += goal.desiredWeeklyFrequency;
      });

      return { week: weekLabel, completed, total };
    });

    const completedWeeks: string[] = [];
    const incompletedWeeks: string[] = [];

    weeklyProgress.forEach((weekData) => {
      if (weekData.completed >= weekData.total) {
        completedWeeks.push(weekData.week);
      } else {
        incompletedWeeks.push(weekData.week);
      }
    });

    const monthlyProgress = Array.from({ length: 12 }).map((_, i) => {
      const monthLabel = format(new Date(0, i), "MMMM");
      let completed = 0;
      let total = 0;

      goals.forEach((goal) => {
        const completionsInMonth = goal.goalCompletions.filter(
          (c) => getMonth(c.createdAt) === i
        ).length;
        completed += completionsInMonth;
        total += goal.desiredWeeklyFrequency * 4; // Approximate monthly frequency
      });

      return { month: monthLabel, completed, total };
    });

    return {
      weeklyProgress,
      monthlyProgress,
      completedWeeks,
      incompletedWeeks,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
