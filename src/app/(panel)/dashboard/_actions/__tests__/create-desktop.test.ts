import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { createDesktop } from "../create-desktop";


jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  desktop: {
    create: jest.fn(),
  },
}));
jest.mock("next/cache");

const mockAuth = auth as jest.Mock;
const mockPrismaDesktopCreate = prisma.desktop.create as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

const formData = { title: "test desktop" };

const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};

describe("create desktop Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if session is not found", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await createDesktop({ title: "test desktop" });
    expect(result).toEqual({ error: "Falha ao cadastrar Desktop" });
    expect(mockPrismaDesktopCreate).not.toHaveBeenCalled();
  });

  it("should return a validation error for an empty title", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const result = await createDesktop({ title: "" });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("O titulo é obrigatório");
  });

  it("should create a desktop and revalidate the path on success", async () => {
    const newDesktop = {
      id: "desktop-1",
      userId: "user-123",
      title: "test desktop",
    };
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaDesktopCreate.mockResolvedValue(newDesktop);

    const result = await createDesktop(formData);

    expect(mockPrismaDesktopCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-123",
        title: "test desktop",
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(result).toEqual({ newDesktop });
  });
  it("should return an error if prisma create fails", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaDesktopCreate.mockRejectedValue(new Error("Database error"));

    const result = await createDesktop(formData);

    expect(result).toEqual({ error: "Falha ao cadastrar Desktop" });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});