import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { getDesktops } from "../get-desktops";
import { Prisma } from "@/generated/prisma";

jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  desktop: {
    findMany: jest.fn(),
  },
}));


const mockAuth = auth as jest.Mock;
const mockPrismaDesktopFindMany = prisma.desktop.findMany as jest.Mock;

const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};

type DesktopWithGroupAndItem = Prisma.DesktopGetPayload<{
  include: {
    groupe: {
      include: {
        item: true
      }
    }
  },
  orderBy: {
    createdAt: "desc"
  }
}>;

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

  it("should return desktop with group and item", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const mockDesktops = [
      {
        id: "d-01",
        title: "test desktop 01",
        userId: "user-01",
        createdAt: "2025-09-25T14:05:53.526Z",
        updatedAt: "2025-09-25T14:05:53.526Z",
        groupe: [
          {
            id: "g-01",
            title: "test group 01",
            createdAt: "2025-09-25T14:05:53.526Z",
            updatedAt: "2025-09-25T14:05:53.526Z",
            textColor: "#fff",
            desktopId: "d-01",
            item: [
              {
                id: "i-01",
                title: "test item 01",
                status: "DONE",
                term: "2025-09-25T14:05:53.526Z",
                priority: "CRITICAL",
                notes: "test note 01",
                description: "",
                groupId: "g-01",
                createdAt: "2025-09-25T14:05:53.526Z",
                updatedAt: "2025-09-25T14:05:53.526Z"
              }
            ]
          }
        ]
      },
      {
        id: "d-02",
        title: "test desktop 02",
        userId: "user-02",
        createdAt: "2025-09-25T14:05:53.526Z",
        updatedAt: "2025-09-25T14:05:53.526Z",
        groupe: [
          {
            id: "g-02",
            title: "test group 02",
            createdAt: "2025-09-25T14:05:53.526Z",
            updatedAt: "2025-09-25T14:05:53.526Z",
            textColor: "#fff",
            desktopId: "d-02",
            item: [
              {
                id: "i-02",
                title: "test item 02",
                status: "DONE",
                term: "2025-09-25T14:05:53.526Z",
                priority: "CRITICAL",
                notes: "test note 02",
                description: "",
                groupId: "g-02",
                createdAt: "2025-09-25T14:05:53.526Z",
                updatedAt: "2025-09-25T14:05:53.526Z"
              }
            ]
          }
        ]
      },
    ] as unknown as DesktopWithGroupAndItem[];

    mockPrismaDesktopFindMany.mockResolvedValue(mockDesktops);

    const result = await getDesktops();

    console.log(result);

    expect(result).toEqual([
      {
        id: "d-01",
        title: "test desktop 01",
        userId: "user-01",
        createdAt: "2025-09-25T14:05:53.526Z",
        updatedAt: "2025-09-25T14:05:53.526Z",
        groupe: [
          {
            id: "g-01",
            title: "test group 01",
            createdAt: "2025-09-25T14:05:53.526Z",
            updatedAt: "2025-09-25T14:05:53.526Z",
            textColor: "#fff",
            desktopId: "d-01",
            item: [
              {
                id: "i-01",
                title: "test item 01",
                status: "DONE",
                term: "2025-09-25T14:05:53.526Z",
                priority: "CRITICAL",
                notes: "test note 01",
                description: "",
                groupId: "g-01",
                createdAt: "2025-09-25T14:05:53.526Z",
                updatedAt: "2025-09-25T14:05:53.526Z"
              }
            ]
          }
        ]
      },
      {
        id: "d-02",
        title: "test desktop 02",
        userId: "user-02",
        createdAt: "2025-09-25T14:05:53.526Z",
        updatedAt: "2025-09-25T14:05:53.526Z",
        groupe: [
          {
            id: "g-02",
            title: "test group 02",
            createdAt: "2025-09-25T14:05:53.526Z",
            updatedAt: "2025-09-25T14:05:53.526Z",
            textColor: "#fff",
            desktopId: "d-02",
            item: [
              {
                id: "i-02",
                title: "test item 02",
                status: "DONE",
                term: "2025-09-25T14:05:53.526Z",
                priority: "CRITICAL",
                notes: "test note 02",
                description: "",
                groupId: "g-02",
                createdAt: "2025-09-25T14:05:53.526Z",
                updatedAt: "2025-09-25T14:05:53.526Z"
              }
            ]
          }
        ]
      },
    ] as unknown as DesktopWithGroupAndItem[]);
  });

  // it("",async()=>{});
});