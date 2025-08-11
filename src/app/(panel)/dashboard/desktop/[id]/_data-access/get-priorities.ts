import prisma from "@/lib/prisma";
import { Priority } from "@/generated/prisma";

export type PrioritiesCount = {
  priority: Priority;
  count: number;
};

export async function getPriorities(
  desktopId: string
): Promise<PrioritiesCount[]> {
  const items = await prisma.item.findMany({
    where: {
      group: {
        desktopId: desktopId,
      },
    },
    select: {
      priority: true,
    },
  });

  const prioritiesCount = items.reduce((acc, item) => {
    const priority = item.priority;
    const existingPriority = acc.find((p) => p.priority === priority);

    if (existingPriority) {
      existingPriority.count++;
    } else {
      acc.push({ priority, count: 1 });
    }

    return acc;
  }, [] as PrioritiesCount[]);

  return prioritiesCount;
}
