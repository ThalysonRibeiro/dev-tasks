import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateAvatar } from "./update-avatar";
import { Session } from "next-auth";

// Mock dependencies
jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  user: {
    update: jest.fn(),
  },
}));
jest.mock("next/cache");

const mockAuth = auth as jest.Mock;
const mockPrismaUserUpdate = prisma.user.update as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};

describe("updateAvatar Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if session is not found", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await updateAvatar({ avatarUrl: "http://example.com/avatar.png" });
    expect(result).toEqual({ error: "Usuário não encontrado" });
    expect(mockPrismaUserUpdate).not.toHaveBeenCalled();
  });

  it("should return an error if avatarUrl is empty", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const result = await updateAvatar({ avatarUrl: "" });
    expect(result).toEqual({ error: "Flaha ao alterar imagem." });
    expect(mockPrismaUserUpdate).not.toHaveBeenCalled();
  });

  it("should update the user avatar and revalidate the path on success", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaUserUpdate.mockResolvedValue({
      id: "user-123",
      image: "http://example.com/new-avatar.png",
    });

    const avatarUrl = "http://example.com/new-avatar.png";
    const result = await updateAvatar({ avatarUrl });

    expect(mockPrismaUserUpdate).toHaveBeenCalledWith({
      where: { id: "user-123" },
      data: { image: avatarUrl },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/profile");
    expect(result).toEqual({ success: "Imagem alterada com sucesso!" });
  });

  it("should return an error if prisma update fails", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaUserUpdate.mockRejectedValue(new Error("Database error"));

    const avatarUrl = "http://example.com/new-avatar.png";
    const result = await updateAvatar({ avatarUrl });

    expect(result).toEqual({ error: "Falha ao alterar imagem." });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
