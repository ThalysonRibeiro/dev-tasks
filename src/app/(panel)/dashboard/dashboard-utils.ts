import { Item, Prisma } from "@/generated/prisma";

export type GroupWithItem = Prisma.GroupGetPayload<{
  include: {
    item: true;
  };
}>[];

export function totalItens(group: GroupWithItem): number {
  const count: Item[] = [];
  for (const element of group) {
    element.item.forEach(item => {
      count.push(item);
    });
  }
  return count.length;
}