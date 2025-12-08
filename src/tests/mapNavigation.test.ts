import { describe, it, expect, xit } from "@jest/globals";
import {
  getCharacterIndices,
  getDirection,
  getNeighbors,
  isIndexVisited,
} from "../utils/mapNavigation.js";
import type { Position, Map } from "../types.js";
import { MAP_CHARACTERS } from "../constants.js";
import { isValidForwardCharacter } from "../utils/characterValidation.js";

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
  });

  describe("isIndexVisited", () => {
    it("should return false for empty path", () => {
      const path: Position[] = [];
      expect(isIndexVisited(path, 0, 0)).toBe(false);
    });

    it("should return true when position is in path", () => {
      const path: Position[] = [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 1 },
      ];
      expect(isIndexVisited(path, 0, 1)).toBe(true);
    });

    it("should return false when position is not in path", () => {
      const path: Position[] = [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 1 },
      ];
      expect(isIndexVisited(path, 2, 2)).toBe(false);
    });
  });
});
