"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { format, startOfWeek, endOfWeek, addDays, getDay } from "date-fns";
import { GoalCompletionItem, GoalCompletionWithGoal, GoalsPerDay, WeekSummaryResponse } from "../_types";

export async function GetWeekSummary(): Promise<WeekSummaryResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Nenhum meta completa"
    };
  }

  try {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const allGoals = await prisma.goals.findMany({
      where: { userId: session.user.id },
      include: {
        goalCompletions: {
          where: {
            createdAt: {
              gte: weekStart,
              lte: weekEnd,
            }
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            goal: true
          }
        }
      }
    });

    const dayNames = {
      1: "Segunda-feira",
      2: "Terça-feira",
      3: "Quarta-feira",
      4: "Quinta-feira",
      5: "Sexta-feira",
      6: "Sábado",
      0: "Domingo",
    };

    const goalsPerDay: GoalsPerDay[] = Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(weekStart, i);
      const dayOfWeek = getDay(date);
      return {
        date: format(date, "yyyy-MM-dd"),
        dayOfWeek: dayNames[dayOfWeek as keyof typeof dayNames],
        goals: [] as GoalCompletionItem[],
      };
    });

    let totalCompleted = 0;

    const allCompletions: GoalCompletionWithGoal[] = [];
    allGoals.forEach((goal) => {
      if (Array.isArray(goal.goalCompletions)) {
        allCompletions.push(...goal.goalCompletions);
      }
    });

    allCompletions.forEach((completion) => {
      const completedAtDateStr = format(completion.createdAt, "yyyy-MM-dd");
      const dayData = goalsPerDay.find(d => d.date === completedAtDateStr);

      if (dayData) {
        dayData.goals.push({
          id: completion.id,
          title: completion.goal.title,
          completedAt: completion.createdAt,
        });
        totalCompleted++;
      }
    });

    const todayDateStr = format(new Date(), "yyyy-MM-dd");
    const todayIndex = goalsPerDay.findIndex(d => d.date === todayDateStr);

    let orderedGoalsPerDay = goalsPerDay;
    if (todayIndex !== -1) {
      orderedGoalsPerDay = [
        ...goalsPerDay.slice(todayIndex),
        ...goalsPerDay.slice(0, todayIndex),
      ];
    }

    const totalDesiredFrequency = allGoals.reduce(
      (sum, goal) => sum + goal.desiredWeeklyFrequency, 0
    );

    return {
      summary: {
        completed: totalCompleted,
        total: totalDesiredFrequency,
        goalsPerDay: orderedGoalsPerDay,
      }
    }

  } catch (error) {
    return {
      error: "Nenhum meta completa"
    };
  }
}