import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { Prisma } from "@/generated/prisma";
import { getDetailUser } from "../get-detail-user";

jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

const mockAuth = auth as jest.Mock;
const mockPrismaUserFindUnique = prisma.user.findUnique as jest.Mock;

const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};

type UserWithCountUserSettingsAndGols = Prisma.UserGetPayload<{
  include: {
    _count: { select: { sessions: true, } },
    goals: {
      include: {
        goalCompletions: true
      }
    },
    UserSettings: true,
  }
}>;

const mockUser = {
  _count: {
    sessions: 3,
  },
  goals: [
    {
      id: "g-01",
      title: "test goal 01",
      userId: "user-123",
      desiredWeeklyFrequency: 4,
      createdAt: "2025-09-25T14:05:53.526Z",
      updatedAt: "2025-09-25T14:05:53.526Z",
      goalCompletions: [
        {
          id: "gc-01",
          createdAt: "2025-09-25T14:05:53.526Z",
          updatedAt: "2025-09-25T14:05:53.526Z",
          goalId: "g-01",
        }
      ]
    }
  ]
} as unknown as UserWithCountUserSettingsAndGols;

describe("getDetailUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null if session is not found", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await getDetailUser();
    expect(result).toEqual(null);
    expect(mockPrismaUserFindUnique).not.toHaveBeenCalled();
  });

  it("should return details user", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaUserFindUnique.mockResolvedValue(mockUser);

    const result = await getDetailUser();

    expect(mockPrismaUserFindUnique).toHaveBeenCalledWith({
      where: { id: mockSession.user!.id },
      include: {
        _count: { select: { sessions: true, } },
        goals: {
          include: {
            goalCompletions: true
          }
        },
        UserSettings: true,
      }
    });
    expect(result).toEqual(mockUser);
  });

  it("should return null if prisma query fails", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaUserFindUnique.mockRejectedValue(new Error("Database error"));
    const result = await getDetailUser();

    expect(result).toEqual(null);
  });
});