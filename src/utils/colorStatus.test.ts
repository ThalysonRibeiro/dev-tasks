import {
  colorStatus,
  borderColorStatus,
  statusMap,
  statusKeys,
  colorPriority,
  borderColorPriority,
  priorityMap,
  priorityKeys,
} from "./colorStatus";

describe("Utils - colorStatus-priority", () => {
  describe("colorStatus", () => {
    it("should return green for DONE", () => {
      expect(colorStatus("DONE")).toBe("bg-green-500 dark:bg-green-500 text-white");
    });

    it("should return blue for IN_PROGRESS", () => {
      expect(colorStatus("IN_PROGRESS")).toBe("bg-blue-500 dark:bg-blue-500 text-white");
    });

    it("should return red for STOPPED", () => {
      expect(colorStatus("STOPPED")).toBe("bg-red-500 dark:bg-red-500 text-white");
    });

    it("should return zinc for default", () => {
      expect(colorStatus("ANYTHING_ELSE")).toBe("bg-zinc-400 dark:bg-zinc-400 text-white");
    });
  });

  describe("borderColorStatus", () => {
    it("should return green for DONE", () => {
      expect(borderColorStatus("DONE")).toBe("border-green-500 dark:border-green-500");
    });

    it("should return blue for IN_PROGRESS", () => {
      expect(borderColorStatus("IN_PROGRESS")).toBe("border-blue-500 dark:border-blue-500");
    });

    it("should return red for STOPPED", () => {
      expect(borderColorStatus("STOPPED")).toBe("border-red-500 dark:border-red-500");
    });

    it("should return zinc for default", () => {
      expect(borderColorStatus("ANYTHING_ELSE")).toBe("border-zinc-400 dark:border-zinc-400");
    });
  });

  describe("colorPriority", () => {
    it("should return red for CRITICAL", () => {
      expect(colorPriority("CRITICAL")).toBe("bg-red-500 dark:bg-red-500 text-white");
    });

    it("should return orange for HIGH", () => {
      expect(colorPriority("HIGH")).toBe("bg-orange-500 dark:bg-orange-500 text-white");
    });

    it("should return yellow for MEDIUM", () => {
      expect(colorPriority("MEDIUM")).toBe("bg-yellow-500 dark:bg-yellow-500 text-white");
    });

    it("should return green for LOW", () => {
      expect(colorPriority("LOW")).toBe("bg-green-500 dark:bg-green-500 text-white");
    });

    it("should return zinc for default", () => {
      expect(colorPriority("ANYTHING_ELSE")).toBe("bg-zinc-400 dark:bg-zinc-400 text-white");
    });
  });

  describe("borderColorPriority", () => {
    it("should return red for CRITICAL", () => {
      expect(borderColorPriority("CRITICAL")).toBe("border-red-500 dark:border-red-500");
    });

    it("should return orange for HIGH", () => {
      expect(borderColorPriority("HIGH")).toBe("border-orange-500 dark:border-orange-500");
    });

    it("should return yellow for MEDIUM", () => {
      expect(borderColorPriority("MEDIUM")).toBe("border-yellow-500 dark:border-yellow-500");
    });

    it("should return green for LOW", () => {
      expect(borderColorPriority("LOW")).toBe("border-green-500 dark:border-green-500");
    });

    it("should return zinc for default", () => {
      expect(borderColorPriority("ANYTHING_ELSE")).toBe("border-zinc-400 dark:border-zinc-400");
    });
  });

  describe("Constants", () => {
    it("should have the correct statusMap", () => {
      expect(statusMap).toEqual({
        DONE: "CONCLUÍDO",
        IN_PROGRESS: "EM ANDAMENTO",
        STOPPED: "INTERROMPIDO",
        NOT_STARTED: "NÃO INICIADO",
      });
    });

    it("should have the correct statusKeys", () => {
      expect(statusKeys).toEqual(["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"]);
    });

    it("should have the correct priorityMap", () => {
      expect(priorityMap).toEqual({
        CRITICAL: "CRÍTICO",
        HIGH: "ALTO",
        MEDIUM: "MÉDIO",
        LOW: "BAIXO",
        STANDARD: "PADRÃO",
      });
    });

    it("should have the correct priorityKeys", () => {
      expect(priorityKeys).toEqual(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]);
    });
  });
});
