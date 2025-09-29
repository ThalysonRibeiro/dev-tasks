import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteDesktop } from "../delete-desktop";

jest.mock('@/lib/prisma', () => ({
  desktop: {
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock('next/cache');

const mockPrismaDesktopFindFirst = prisma.desktop.findFirst as jest.Mock;
const mockPrismaDesktopDelete = prisma.desktop.delete as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

const existingDesktop = { id: "123" };


describe("delete desktop Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if the desktop not found", async () => {
    mockPrismaDesktopFindFirst.mockResolvedValue(null);
    const result = await deleteDesktop('non-existent-id');
    expect(result).toEqual({ error: "Desktop não encontrada" });
    expect(mockPrismaDesktopDelete).not.toHaveBeenCalled();
  });
  it("should delete a desktop and revalidate the path on success", async () => {
    mockPrismaDesktopFindFirst.mockResolvedValue(existingDesktop);
    mockPrismaDesktopDelete.mockResolvedValue({});
    const result = await deleteDesktop(existingDesktop.id);

    expect(mockPrismaDesktopFindFirst).toHaveBeenCalledWith({
      where: { id: existingDesktop.id },
    })
    expect(mockPrismaDesktopDelete).toHaveBeenCalledWith({
      where: { id: existingDesktop.id },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(result).toEqual({ data: "Desktop deletada com sucesso!" });
  });

  it("should return an error if prisma delete fails", async () => {
    mockPrismaDesktopFindFirst.mockResolvedValue(existingDesktop);
    mockPrismaDesktopDelete.mockRejectedValue(new Error('Database error'));

    const result = await deleteDesktop(existingDesktop.id);

    expect(result).toEqual({ error: "Falha ao deletar Desktop" });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});