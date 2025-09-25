import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateDesktop } from "../update-desktop";


jest.mock('@/lib/prisma', () => ({
  desktop: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock('next/cache');

const mockPrismaDesktopFindFirst = prisma.desktop.findFirst as jest.Mock;
const mockPrismaDesktopUpdate = prisma.desktop.update as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;


const formData = { desktopId: "test-123", title: "test desktop" };

describe("update desktop Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error id the desktop not found", async () => {
    mockPrismaDesktopFindFirst.mockResolvedValue(null);
    const result = await updateDesktop(formData);

    expect(result).toEqual({ error: "Desktop não encontrada" });
    expect(mockPrismaDesktopUpdate).not.toHaveBeenCalled();
  });
  it("should return a validation error for an empty id", async () => {
    const result = await updateDesktop({ desktopId: "", title: "test desktop" });

    expect(result.error).toBeDefined();
    expect(result.error).toContain("O id é obrigatório");
  });

  it("should return a validation error for an empty title", async () => {
    const result = await updateDesktop({ desktopId: "test-123", title: "" });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("O titulo é obrigatório");
  });

  it("should update a desktop and revalidate the path on success", async () => {
    mockPrismaDesktopFindFirst.mockResolvedValue({ id: formData.desktopId });
    mockPrismaDesktopUpdate.mockResolvedValue({
      where: { id: formData.desktopId, },
      data: { title: formData.title }
    });

    const result = await updateDesktop(formData);

    expect(mockPrismaDesktopFindFirst).toHaveBeenCalledWith({
      where: { id: formData.desktopId }
    })
    expect(mockPrismaDesktopUpdate).toHaveBeenCalledWith({
      where: { id: formData.desktopId },
      data: { title: formData.title }
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(result).toEqual({ data: "Desktop atualizada com sucesso!" })
  });

  it("should return an error if prisma update fails", async () => {
    mockPrismaDesktopFindFirst.mockResolvedValue({ id: formData.desktopId });
    mockPrismaDesktopUpdate.mockRejectedValue(new Error("Database error"));

    const result = await updateDesktop(formData);

    expect(result).toEqual({ error: "Falha ao atualizar Desktop" });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});