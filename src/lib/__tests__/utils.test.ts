import { cn } from "../utils";
import { ClassValue } from "clsx"; // Import ClassValue for type hinting

// Mock the entire "clsx" module
jest.mock("clsx", () => ({
  clsx: jest.fn(),
}));


// Import the mocked functions
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

describe("cn", () => {
  beforeEach(() => {
    // Clear mocks before each test
    (clsx as jest.Mock).mockClear();

    // Provide a default implementation for clsx:
    // It receives a single array argument from cn, so it should process that array.
    (clsx as jest.Mock).mockImplementation((...inputs: ClassValue[]) => {
      // Simulate clsx behavior: flatten and join with spaces
      // return inputs.flat(Infinity).filter(Boolean).join(" ");
      return inputs.flat().filter(Boolean).join(" ");
    });
  });

  it("should call clsx with the spread inputs as a single array argument", () => {
    const input1 = "class1";
    const input2 = "class2";
    const input3 = { "class3": true, "class4": false };

    cn(input1, input2, input3);

    // clsx is called with a single array containing all inputs
    expect(clsx).toHaveBeenCalledWith([input1, input2, input3]);
  });



  it("should return the merged class names", () => {
    const result = cn("px-2", "py-1", "bg-red-500", "py-2", "bg-blue-500");
    expect(result).toBe("px-2 py-2 bg-blue-500");
  });

  it("should handle empty inputs and return an empty string", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle single input", () => {
    const result = cn("text-red-500");
    expect(result).toBe("text-red-500");
  });

  it("should handle boolean inputs", () => {
    const result = cn("text-red-500", false, "font-bold", null, undefined, true && "underline");
    expect(result).toBe("text-red-500 font-bold underline");
  });
});
