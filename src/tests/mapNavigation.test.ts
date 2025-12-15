import { describe, it, expect, xit } from "@jest/globals";
import {
  getCharacterIndices,
  getDirection,
  getNeighbors,
  isIndexVisited,
  isValidNeighborForDirection,
  getCharacterAtPosition,
} from "../utils/mapNavigation";
import type { Position, Map, Direction } from "../types";
import { MAP_CHARACTERS } from "../constants";
import { isValidForwardCharacter } from "../utils/characterValidation";

describe("mapNavigation", () => {
  describe("getCharacterIndices", () => {
    it("should return empty array for empty map", () => {
      const map: Map = [];
      expect(getCharacterIndices(map, MAP_CHARACTERS.START)).toEqual([]);
    });

    it("should return empty array for map with no matching character", () => {
      const map: Map = [["A", "B", "C"]];
      expect(getCharacterIndices(map, MAP_CHARACTERS.START)).toEqual([]);
    });

    it("should find single character in map", () => {
      const map: Map = [["@", "-", "A"]];
      const result = getCharacterIndices(map, MAP_CHARACTERS.START);
      expect(result).toEqual([{ row: 0, column: 0 }]);
    });

    it("should find multiple occurrences of character", () => {
      const map: Map = [
        ["@", "-", "A"],
        ["B", "@", "C"],
      ];
      const result = getCharacterIndices(map, MAP_CHARACTERS.START);
      expect(result).toEqual([
        { row: 0, column: 0 },
        { row: 1, column: 1 },
      ]);
    });

    it("should handle jagged arrays (different row lengths)", () => {
      const map: Map = [["@", "-"], ["A", "B", "C", "@"], ["x"]];
      const result = getCharacterIndices(map, MAP_CHARACTERS.START);
      expect(result).toEqual([
        { row: 0, column: 0 },
        { row: 1, column: 3 },
      ]);
    });

    it("should return empty array for empty rows", () => {
      const map: Map = [[], [], []];
      expect(getCharacterIndices(map, MAP_CHARACTERS.START)).toEqual([]);
    });

    it("should return empty array when character is invalid", () => {
      const map: Map = [["@", "-", "x"]];
      expect(getCharacterIndices(map, "")).toEqual([]); // Empty string
      expect(getCharacterIndices(map, "ab" as any)).toEqual([]); // Multiple characters
      expect(getCharacterIndices(map, null as any)).toEqual([]); // null
      expect(getCharacterIndices(map, undefined as any)).toEqual([]); // undefined
    });
  });

  describe("getDirection", () => {
    it("should return direction for vertical movement down", () => {
      const from: Position = { row: 0, column: 0 };
      const to: Position = { row: 1, column: 0 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 1, horizontal: 0 });
    });

    it("should return direction for vertical movement up", () => {
      const from: Position = { row: 2, column: 0 };
      const to: Position = { row: 0, column: 0 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: -2, horizontal: 0 });
    });

    it("should return direction for horizontal movement right", () => {
      const from: Position = { row: 0, column: 0 };
      const to: Position = { row: 0, column: 1 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 0, horizontal: 1 });
    });

    it("should return direction for horizontal movement left", () => {
      const from: Position = { row: 0, column: 2 };
      const to: Position = { row: 0, column: 0 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 0, horizontal: -2 });
    });

    it("should return direction for diagonal movement", () => {
      const from: Position = { row: 0, column: 0 };
      const to: Position = { row: 2, column: 3 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 2, horizontal: 3 });
    });

    it("should return zero direction for same position", () => {
      const from: Position = { row: 1, column: 1 };
      const to: Position = { row: 1, column: 1 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 0, horizontal: 0 });
    });

    it("should throw error when from position is invalid", () => {
      const from: Position = { row: -1, column: 0 };
      const to: Position = { row: 0, column: 0 };
      expect(() => getDirection(from, to)).toThrow("Invalid position");
    });

    it("should throw error when to position is invalid", () => {
      const from: Position = { row: 0, column: 0 };
      const to: Position = { row: 0, column: -1 };
      expect(() => getDirection(from, to)).toThrow("Invalid position");
    });
  });

  describe("getNeighbors", () => {
    it("should return all valid neighbors", () => {
      const map: Map = [
        [" ", "-", " "],
        ["-", "@", "-"],
        [" ", "-", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getNeighbors(map, position, isValidForwardCharacter);
      expect(result).toHaveLength(2);
      expect(result).not.toContainEqual({ row: 0, column: 1 });
      expect(result).not.toContainEqual({ row: 2, column: 1 });
      expect(result).toContainEqual({ row: 1, column: 0 });
      expect(result).toContainEqual({ row: 1, column: 2 });
    });

    it("should return all valid neighbors", () => {
      const map: Map = [
        [" ", "|", " "],
        ["|", "@", "|"],
        [" ", "|", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getNeighbors(map, position, isValidForwardCharacter);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ row: 0, column: 1 });
      expect(result).toContainEqual({ row: 2, column: 1 });
      expect(result).not.toContainEqual({ row: 1, column: 0 });
      expect(result).not.toContainEqual({ row: 1, column: 2 });
    });

    it("should return only valid neighbors (filter invalid characters)", () => {
      const map: Map = [
        [" ", " ", " "],
        [" ", "@", "-"],
        [" ", " ", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getNeighbors(map, position, isValidForwardCharacter);
      expect(result).toHaveLength(1);
      expect(result).toContainEqual({ row: 1, column: 2 });
    });

    it("should return empty array when no valid neighbors", () => {
      const map: Map = [
        [" ", " ", " "],
        [" ", "@", " "],
        [" ", " ", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getNeighbors(map, position, isValidForwardCharacter);
      expect(result).toEqual([]);
    });

    it("should handle edge positions (top-left corner)", () => {
      const map: Map = [
        ["@", "-", "A"],
        ["|", " ", " "],
      ];
      const position: Position = { row: 0, column: 0 };
      const result = getNeighbors(map, position, isValidForwardCharacter);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ row: 0, column: 1 });
      expect(result).toContainEqual({ row: 1, column: 0 });
    });

    it("should handle edge positions (bottom-right corner)", () => {
      const map: Map = [
        [" ", " ", " "],
        [" ", " ", "-"],
        [" ", "|", "x"],
      ];
      const position: Position = { row: 2, column: 2 };
      const result = getNeighbors(map, position, isValidForwardCharacter);
      expect(result).toHaveLength(0);
      expect(result).not.toContainEqual({ row: 1, column: 2 });
      expect(result).not.toContainEqual({ row: 2, column: 1 });
    });

    it("should include letter characters as valid neighbors", () => {
      const map: Map = [
        [" ", "A", " "],
        ["B", "@", "C"],
        [" ", "D", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getNeighbors(map, position, isValidForwardCharacter);
      expect(result).toHaveLength(4);
      expect(result).toContainEqual({ row: 0, column: 1 });
      expect(result).toContainEqual({ row: 2, column: 1 });
      expect(result).toContainEqual({ row: 1, column: 0 });
      expect(result).toContainEqual({ row: 1, column: 2 });
    });

    it("should handle jagged arrays (out of bounds)", () => {
      const map: Map = [["@", "-"], ["|"]];
      const position: Position = { row: 0, column: 1 };
      const result = getNeighbors(map, position, isValidForwardCharacter);
      // Should not crash, should handle undefined gracefully
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array when position is invalid", () => {
      const map: Map = [["@", "-", "x"]];
      const position: Position = { row: -1, column: 0 };
      const result = getNeighbors(map, position, isValidForwardCharacter);
      expect(result).toEqual([]);
    });
  });

  describe("getCharacterAtPosition", () => {
    it("should return character at valid position", () => {
      const map: Map = [["@", "-", "A", "x"]];
      const position: Position = { row: 0, column: 2 };
      const result = getCharacterAtPosition(map, position);
      expect(result).toBe("A");
    });

    it("should return undefined when position is out of bounds", () => {
      const map: Map = [["@", "-", "x"]];
      const position: Position = { row: 0, column: 10 };
      const result = getCharacterAtPosition(map, position);
      expect(result).toBeUndefined();
    });

    it("should return undefined when position is invalid", () => {
      const map: Map = [["@", "-", "x"]];
      const position: Position = { row: -1, column: 0 };
      const result = getCharacterAtPosition(map, position);
      expect(result).toBeUndefined();
    });

    it("should return undefined for invalid row", () => {
      const map: Map = [["@", "-", "x"]];
      const position: Position = { row: 5, column: 0 };
      const result = getCharacterAtPosition(map, position);
      expect(result).toBeUndefined();
    });
  });

  describe("isIndexVisited", () => {
    it("should return false for empty path", () => {
      const path: Position[] = [];
      expect(isIndexVisited(path, {row: 0, column: 0})).toBe(false);
    });

    it("should return true when position is in path", () => {
      const path: Position[] = [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 1 },
      ];
      expect(isIndexVisited(path, {row: 0, column: 1})).toBe(true);
    });

    it("should return false when position is not in path", () => {
      const path: Position[] = [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 1 },
      ];
      expect(isIndexVisited(path, {row: 2, column: 2})).toBe(false);
    });
  });

  describe("isValidNeighborForDirection", () => {
    const horizontalRight: Direction = { vertical: 0, horizontal: 1 };
    const horizontalLeft: Direction = { vertical: 0, horizontal: -1 };
    const verticalDown: Direction = { vertical: 1, horizontal: 0 };
    const verticalUp: Direction = { vertical: -1, horizontal: 0 };

    describe("special characters (valid in any direction)", () => {
      it("should return true for intersection (+) in horizontal direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.INTERSECTION, horizontalRight)).toBe(true);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.INTERSECTION, horizontalLeft)).toBe(true);
      });

      it("should return true for intersection (+) in vertical direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.INTERSECTION, verticalDown)).toBe(true);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.INTERSECTION, verticalUp)).toBe(true);
      });

      it("should return true for end character (x) in horizontal direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.END, horizontalRight)).toBe(true);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.END, horizontalLeft)).toBe(true);
      });

      it("should return true for end character (x) in vertical direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.END, verticalDown)).toBe(true);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.END, verticalUp)).toBe(true);
      });

      it("should return true for capital letters in horizontal direction", () => {
        expect(isValidNeighborForDirection("A", horizontalRight)).toBe(true);
        expect(isValidNeighborForDirection("Z", horizontalRight)).toBe(true);
        expect(isValidNeighborForDirection("M", horizontalLeft)).toBe(true);
      });

      it("should return true for capital letters in vertical direction", () => {
        expect(isValidNeighborForDirection("A", verticalDown)).toBe(true);
        expect(isValidNeighborForDirection("Z", verticalDown)).toBe(true);
        expect(isValidNeighborForDirection("M", verticalUp)).toBe(true);
      });
    });

    describe("horizontal direction validation", () => {
      it("should return true for horizontal character (-) in horizontal direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.HORIZONTAL, horizontalRight)).toBe(true);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.HORIZONTAL, horizontalLeft)).toBe(true);
      });

      it("should return false for horizontal character (-) in vertical direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.HORIZONTAL, verticalDown)).toBe(false);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.HORIZONTAL, verticalUp)).toBe(false);
      });

      it("should return false for vertical character (|) in horizontal direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.VERTICAL, horizontalRight)).toBe(false);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.VERTICAL, horizontalLeft)).toBe(false);
      });
    });

    describe("vertical direction validation", () => {
      it("should return true for vertical character (|) in vertical direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.VERTICAL, verticalDown)).toBe(true);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.VERTICAL, verticalUp)).toBe(true);
      });

      it("should return false for vertical character (|) in horizontal direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.VERTICAL, horizontalRight)).toBe(false);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.VERTICAL, horizontalLeft)).toBe(false);
      });
    });

    describe("invalid characters", () => {
      it("should return false for space character in any direction", () => {
        expect(isValidNeighborForDirection(" ", horizontalRight)).toBe(false);
        expect(isValidNeighborForDirection(" ", verticalDown)).toBe(false);
      });

      it("should return false for lowercase letters in any direction", () => {
        expect(isValidNeighborForDirection("a", horizontalRight)).toBe(false);
        expect(isValidNeighborForDirection("z", verticalDown)).toBe(false);
      });

      it("should return false for start character (@) in any direction", () => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.START, horizontalRight)).toBe(false);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.START, verticalDown)).toBe(false);
      });

      it("should return false for numbers in any direction", () => {
        expect(isValidNeighborForDirection("0", horizontalRight)).toBe(false);
        expect(isValidNeighborForDirection("9", verticalDown)).toBe(false);
      });

      it("should return false for special symbols in any direction", () => {
        expect(isValidNeighborForDirection("#", horizontalRight)).toBe(false);
        expect(isValidNeighborForDirection("$", verticalDown)).toBe(false);
        expect(isValidNeighborForDirection(".", horizontalRight)).toBe(false);
      });
    });

    describe("edge cases", () => {
      it("should handle zero direction (no movement)", () => {
        const zeroDirection: Direction = { vertical: 0, horizontal: 0 };
        // Zero direction should not match horizontal or vertical
        expect(isValidNeighborForDirection(MAP_CHARACTERS.HORIZONTAL, zeroDirection)).toBe(false);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.VERTICAL, zeroDirection)).toBe(false);
        //TODO: check and re-think // But special characters should still be valid
        expect(isValidNeighborForDirection(MAP_CHARACTERS.INTERSECTION, zeroDirection)).toBe(true);
        expect(isValidNeighborForDirection("A", zeroDirection)).toBe(true);
        expect(isValidNeighborForDirection(MAP_CHARACTERS.END, zeroDirection)).toBe(true);
      });
    });
  });
});
