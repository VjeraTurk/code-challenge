import { describe, it, expect, jest, xit } from "@jest/globals";
import { validateMapStartAndEnd, isValidString, isValidMap, isValidPosition } from "../utils/validation";
import type { Map, Position } from "../types";
import { ERROR_MESSAGES } from "../constants";

describe("validation", () => {
  describe("validateMapStartAndEnd", () => {
    it("should return error when start or end not found", () => {
      const map: Map = [[" ", " ", " "]];
      const result = validateMapStartAndEnd(map);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(
          ERROR_MESSAGES.START_OR_END_NOT_FOUND
        );
      }
    });

    it("should return error when multiple start or end characters found", () => {
      const map: Map = [
        ["@", "-", "@"],
        [" ", " ", "x"],
      ];
      const result = validateMapStartAndEnd(map);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.MULTIPLE_START_OR_END);
      }
    });

    it("should return success when start and end are found", () => {
      const map: Map = [["@", "-", "x"]];
      const result = validateMapStartAndEnd(map);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.start).toEqual({ row: 0, column: 0 });
        expect(result.value.end).toEqual({ row: 0, column: 2 });
      }
    });

    it("should return error when startPosition is undefined after length check", () => {
      // we need getCharacterPositions to return array with undefined element
      // We'll mock getCharacterPositions to return [undefined]
      const getCharacterPositionsSpy = jest.spyOn(
        require("../utils/mapNavigation"),
        "getCharacterPositions"
      );

      getCharacterPositionsSpy
        .mockReturnValueOnce([undefined as any]) // start returns [undefined]
        .mockReturnValueOnce([{ row: 0, column: 2 }]); // end returns valid position

      const map: Map = [["@", "-", "x"]];
      const result = validateMapStartAndEnd(map);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(
          ERROR_MESSAGES.START_OR_END_NOT_FOUND
        );
      }

      getCharacterPositionsSpy.mockRestore();
    });

    it("should return error when startPosition is invalid", () => {
      const getCharacterPositionsSpy = jest.spyOn(
        require("../utils/mapNavigation"),
        "getCharacterPositions"
      );

      getCharacterPositionsSpy
        .mockReturnValueOnce([{ row: -1, column: 0 }]) // start returns invalid position (negative row)
        .mockReturnValueOnce([{ row: 0, column: 2 }]); // end returns valid position

      const map: Map = [["@", "-", "x"]];
      const result = validateMapStartAndEnd(map);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe("Invalid position");
      }

      getCharacterPositionsSpy.mockRestore();
    });

    it("should return error when endPosition is invalid", () => {
      const getCharacterPositionsSpy = jest.spyOn(
        require("../utils/mapNavigation"),
        "getCharacterPositions"
      );

      getCharacterPositionsSpy
        .mockReturnValueOnce([{ row: 0, column: 0 }]) // start returns valid position
        .mockReturnValueOnce([{ row: 0, column: -1 }]); // end returns invalid position (negative column)

      const map: Map = [["@", "-", "x"]];
      const result = validateMapStartAndEnd(map);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe("Invalid position");
      }

      getCharacterPositionsSpy.mockRestore();
    });
  });

  describe("isValidString", () => {
    it("should return true for single character string", () => {
      expect(isValidString("a")).toBe(true);
      expect(isValidString("A")).toBe(true);
      expect(isValidString("@")).toBe(true);
      expect(isValidString("-")).toBe(true);
      expect(isValidString(" ")).toBe(true);
    });

    it("should return false for empty string", () => {
      expect(isValidString("")).toBe(false);
    });

    it("should return false for string with multiple characters", () => {
      expect(isValidString("ab")).toBe(false);
      expect(isValidString("ABC")).toBe(false);
      expect(isValidString("--")).toBe(false);
    });

    it("should return false for non-string types", () => {
      expect(isValidString(null as any)).toBe(false);
      expect(isValidString(undefined as any)).toBe(false);
      expect(isValidString(123 as any)).toBe(false);
      expect(isValidString({} as any)).toBe(false);
      expect(isValidString([] as any)).toBe(false);
    });

    it("should return true for valid path characters", () => {
      expect(isValidString("@")).toBe(true);
      expect(isValidString("x")).toBe(true);
      expect(isValidString("-")).toBe(true);
      expect(isValidString("|")).toBe(true);
      expect(isValidString("+")).toBe(true);
      expect(isValidString("A")).toBe(true);
      expect(isValidString("Z")).toBe(true);
    });
  });

  describe("isValidMap", () => {
    it("should return true for non-empty array", () => {
      const map: Map = [["@", "-", "x"]];
      expect(isValidMap(map)).toBe(true);
    });

    it("should return true for array with multiple rows", () => {
      const map: Map = [
        ["@", "-"],
        ["|", "x"],
      ];
      expect(isValidMap(map)).toBe(true);
    });

    it("should return true for jagged array", () => {
      const map: Map = [
        ["@", "-"],
        ["A", "B", "C", "x"],
      ];
      expect(isValidMap(map)).toBe(true);
    });

    it("should return false for empty array", () => {
      const map: Map = [];
      expect(isValidMap(map)).toBe(false);
    });

    it("should return false for non-array types", () => {
      expect(isValidMap(null as any)).toBe(false);
      expect(isValidMap(undefined as any)).toBe(false);
      expect(isValidMap("string" as any)).toBe(false);
      expect(isValidMap(123 as any)).toBe(false);
      expect(isValidMap({} as any)).toBe(false);
    });

    it("should return true for array with empty rows", () => {
      const map: Map = [[], ["@", "-", "x"]];
      expect(isValidMap(map)).toBe(true);
    });
  });

  describe("isValidPosition", () => {
    it("should return true for valid position with zero coordinates", () => {
      const position: Position = { row: 0, column: 0 };
      expect(isValidPosition(position)).toBe(true);
    });

    it("should return true for valid position with positive coordinates", () => {
      const position: Position = { row: 5, column: 10 };
      expect(isValidPosition(position)).toBe(true);
    });

    it("should return true for valid position with large coordinates", () => {
      const position: Position = { row: 100, column: 200 };
      expect(isValidPosition(position)).toBe(true);
    });

    it("should return false for position with negative row", () => {
      const position: Position = { row: -1, column: 0 };
      expect(isValidPosition(position)).toBe(false);
    });

    it("should return false for position with negative column", () => {
      const position: Position = { row: 0, column: -1 };
      expect(isValidPosition(position)).toBe(false);
    });

    it("should return false for position with negative row and column", () => {
      const position: Position = { row: -5, column: -10 };
      expect(isValidPosition(position)).toBe(false);
    });

    it("should return false for null", () => {
      expect(isValidPosition(null as any)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isValidPosition(undefined as any)).toBe(false);
    });

    it("should return false for non-object types", () => {
      expect(isValidPosition("string" as any)).toBe(false);
      expect(isValidPosition(123 as any)).toBe(false);
      expect(isValidPosition(true as any)).toBe(false);
      expect(isValidPosition([] as any)).toBe(false);
    });

    it("should return false for object without row property", () => {
      expect(isValidPosition({ column: 0 } as any)).toBe(false);
    });

    it("should return false for object without column property", () => {
      expect(isValidPosition({ row: 0 } as any)).toBe(false);
    });

    it("should return false for object with non-number row", () => {
      expect(isValidPosition({ row: "0", column: 0 } as any)).toBe(false);
      expect(isValidPosition({ row: null, column: 0 } as any)).toBe(false);
      expect(isValidPosition({ row: undefined, column: 0 } as any)).toBe(false);
      expect(isValidPosition({ row: {}, column: 0 } as any)).toBe(false);
    });

    it("should return false for object with non-number column", () => {
      expect(isValidPosition({ row: 0, column: "0" } as any)).toBe(false);
      expect(isValidPosition({ row: 0, column: null } as any)).toBe(false);
      expect(isValidPosition({ row: 0, column: undefined } as any)).toBe(false);
      expect(isValidPosition({ row: 0, column: {} } as any)).toBe(false);
    });

    it("should return false for object with NaN row", () => {
      expect(isValidPosition({ row: NaN, column: 0 } as any)).toBe(false);
    });

    it("should return false for object with NaN column", () => {
      expect(isValidPosition({ row: 0, column: NaN } as any)).toBe(false);
    });

    it("should return false for empty object", () => {
      expect(isValidPosition({} as any)).toBe(false);
    });
  });
});
