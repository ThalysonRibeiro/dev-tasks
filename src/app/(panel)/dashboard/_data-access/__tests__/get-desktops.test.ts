import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { getDesktops } from "../get-desktops";
import { Prisma } from "@/generated/prisma";

jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  desktop: { findMany: jest.fn() },
  group: { findMany: jest.fn() },
}));



const mockAuth = auth as jest.Mock;
const mockPrismaDesktopFindMany = prisma.desktop.findMany as jest.Mock;
const mockPrismaGroupFindMany = prisma.group.findMany as jest.Mock;


const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};


describe("getDesktops", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty array if session is not found", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await getDesktops();
    expect(result).toEqual([]);
    expect(mockPrismaDesktopFindMany).not.toHaveBeenCalled();
  });

  it("should return an empty array if prisma query fails", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaDesktopFindMany.mockRejectedValue(new Error("Database error"));
    const result = await getDesktops();
    expect(result).toEqual([]);
  });

  it("should return desktop summaries with groupsCount and itemsCount", async () => {
    mockAuth.mockResolvedValue(mockSession);

    // mock da primeira query: desktops
    mockPrismaDesktopFindMany.mockResolvedValue([
      { id: "d1", title: "Desktop 1", _count: { groups: 2 } },
      { id: "d2", title: "Desktop 2", _count: { groups: 1 } },
    ]);

    mockPrismaGroupFindMany.mockResolvedValue([
      { desktopId: "d1", _count: { item: 3 } },
      { desktopId: "d1", _count: { item: 2 } },
      { desktopId: "d2", _count: { item: 4 } },
    ]);

    const result = await getDesktops();

    expect(mockPrismaDesktopFindMany).toHaveBeenCalled();
    expect(mockPrismaGroupFindMany).toHaveBeenCalledWith({
      where: { desktopId: { in: ["d1", "d2"] } },
      select: { desktopId: true, _count: { select: { item: true } } },
    });

    expect(result).toEqual([
      { id: "d1", title: "Desktop 1", groupsCount: 2, itemsCount: 5 },
      { id: "d2", title: "Desktop 2", groupsCount: 1, itemsCount: 4 },
    ]);
  });

});