import { describe, it, expect, jest, xit } from "@jest/globals";
import { validateMapStartAndEnd, isValidString, isValidMap, isValidPosition } from "../utils/validation";
import type { Map, Position } from "../types";
import { ERROR_MESSAGES } from "../constants";

describe("validation", () => {
  describe("validateMapStartAndEnd", () => {
    it("should return error when start or end not found", () => {
      const map: Map = [[" ", " ", " "]];
      const result = validateMapStartAndEnd(map);
      expect({
        success: result.success,
        errorMessage: (result as { success: false; error: Error }).error.message,
      }).toEqual({
        success: false,
        errorMessage: ERROR_MESSAGES.START_OR_END_NOT_FOUND,
      });
    });

    it("should return error when multiple start or end characters found", () => {
      const map: Map = [
        ["@", "-", "@"],
        [" ", " ", "x"],
      ];
      const result = validateMapStartAndEnd(map);
      expect({
        success: result.success,
        errorMessage: (result as { success: false; error: Error }).error.message,
      }).toEqual({
        success: false,
        errorMessage: ERROR_MESSAGES.MULTIPLE_START_OR_END,
      });
    });

    it("should return success when start and end are found", () => {
      const map: Map = [["@", "-", "x"]];
      const result = validateMapStartAndEnd(map);
      const value = (result as { success: true; value: { start: Position; end: Position } }).value;
      expect({
        success: result.success,
        start: value.start,
        end: value.end,
      }).toEqual({
        success: true,
        start: { row: 0, column: 0 },
        end: { row: 0, column: 2 },
      });
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

      expect({
        success: result.success,
        errorMessage: (result as { success: false; error: Error }).error.message,
      }).toEqual({
        success: false,
        errorMessage: ERROR_MESSAGES.START_OR_END_NOT_FOUND,
      });

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

      expect({
        success: result.success,
        errorMessage: (result as { success: false; error: Error }).error.message,
      }).toEqual({
        success: false,
        errorMessage: "Invalid position",
      });

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

      expect({
        success: result.success,
        errorMessage: (result as { success: false; error: Error }).error.message,
      }).toEqual({
        success: false,
        errorMessage: "Invalid position",
      });

      getCharacterPositionsSpy.mockRestore();
    });
  });

  describe("isValidString", () => {
    it.each([
      ["a"],
      ["A"],
      ["@"],
      ["-"],
      [" "],
    ])("should return true for single character string: %s", (input) => {
      expect(isValidString(input)).toBe(true);
    });

    it("should return false for empty string", () => {
      expect(isValidString("")).toBe(false);
    });

    it.each([
      ["ab"],
      ["ABC"],
      ["--"],
    ])("should return false for string with multiple characters: %s", (input) => {
      expect(isValidString(input)).toBe(false);
    });

    it.each([
      [null],
      [undefined],
      [123],
      [{}],
      [[]],
    ])("should return false for non-string types: %s", (input) => {
      expect(isValidString(input as any)).toBe(false);
    });

    it.each([
      ["@"],
      ["x"],
      ["-"],
      ["|"],
      ["+"],
      ["A"],
      ["Z"],
    ])("should return true for valid path character: %s", (input) => {
      expect(isValidString(input)).toBe(true);
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

    it.each([
      [null],
      [undefined],
      ["string"],
      [123],
      [{}],
    ])("should return false for non-array type: %s", (input) => {
      expect(isValidMap(input as any)).toBe(false);
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

    it.each([
      ["string"],
      [123],
      [true],
      [[]],
    ])("should return false for non-object type: %s", (input) => {
      expect(isValidPosition(input as any)).toBe(false);
    });

    it("should return false for object without row property", () => {
      expect(isValidPosition({ column: 0 } as any)).toBe(false);
    });

    it("should return false for object without column property", () => {
      expect(isValidPosition({ row: 0 } as any)).toBe(false);
    });

    it.each([
      [{ row: "0", column: 0 }],
      [{ row: null, column: 0 }],
      [{ row: undefined, column: 0 }],
      [{ row: {}, column: 0 }],
    ])("should return false for object with non-number row: %s", (input) => {
      expect(isValidPosition(input as any)).toBe(false);
    });

    it.each([
      [{ row: 0, column: "0" }],
      [{ row: 0, column: null }],
      [{ row: 0, column: undefined }],
      [{ row: 0, column: {} }],
    ])("should return false for object with non-number column: %s", (input) => {
      expect(isValidPosition(input as any)).toBe(false);
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
