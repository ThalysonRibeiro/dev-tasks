"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { endOfWeek, startOfWeek } from "date-fns";


export async function getWeekPendingGoal() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

  try {
    const goals = await prisma.goals.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          lte: weekEnd
        }
      },
      include: {
        goalCompletions: {
          where: {
            createdAt: {
              gte: weekStart,
              lte: weekEnd,
            }
          }
        }
      }
    });
    const formattedGoals = goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
      completionCount: goal.goalCompletions.length
    }));
    return formattedGoals
  } catch (error) {
    return [];
  }
}