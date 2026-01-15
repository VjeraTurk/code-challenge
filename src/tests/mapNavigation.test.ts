import { describe, it, expect } from "@jest/globals";
import {
  getCharacterPositions,
  getDirection,
  getNeighbors,
  isPositionVisited,
  isValidNeighborForDirection,
  getCharacterAtPosition,
} from "../utils/mapNavigation";
import type { Position, Map, Direction } from "../types";
import { MAP_CHARACTERS } from "../constants";
import { isValidForwardCharacter } from "../utils/characterValidation";

describe("mapNavigation", () => {
  describe("getCharacterPositions", () => {
    it("should return empty array for empty map", () => {
      const map: Map = [];
      expect(() => getCharacterPositions(map, MAP_CHARACTERS.START)).toThrow("Invalid map");
    });

    it("should return empty array for map with no matching character", () => {
      const map: Map = [["A", "B", "C"]];
      expect(getCharacterPositions(map, MAP_CHARACTERS.START)).toEqual([]);
    });

    it("should find single character in map", () => {
      const map: Map = [["@", "-", "A"]];
      const result = getCharacterPositions(map, MAP_CHARACTERS.START);
      expect(result).toEqual([{ row: 0, column: 0 }]);
    });

    it("should find multiple occurrences of character", () => {
      const map: Map = [
        ["@", "-", "A"],
        ["B", "@", "C"],
      ];
      const result = getCharacterPositions(map, MAP_CHARACTERS.START);
      expect(result).toEqual([
        { row: 0, column: 0 },
        { row: 1, column: 1 },
      ]);
    });

    it("should handle jagged arrays (different row lengths)", () => {
      const map: Map = [["@", "-"], ["A", "B", "C", "@"], ["x"]];
      const result = getCharacterPositions(map, MAP_CHARACTERS.START);
      expect(result).toEqual([
        { row: 0, column: 0 },
        { row: 1, column: 3 },
      ]);
    });

    it("should return empty array for empty rows", () => {
      const map: Map = [[], [], []];
      expect(getCharacterPositions(map, MAP_CHARACTERS.START)).toEqual([]);
    });

    it.each([
      [""],
      ["ab"],
      [null],
      [undefined],
    ])("should throw error when character is invalid: %s", (char) => {
      const map: Map = [["@", "-", "x"]];
      expect(() => getCharacterPositions(map, char as any)).toThrow("Invalid character");
    });
  });

  describe("getDirection", () => {
    it("should return direction for vertical movement up", () => {
      const from: Position = { row: 2, column: 0 };
      const to: Position = { row: 0, column: 0 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: -2, horizontal: 0 });
    });

    it("should return direction for vertical movement down", () => {
      const from: Position = { row: 0, column: 0 };
      const to: Position = { row: 1, column: 0 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 1, horizontal: 0 });
    });

    it("should return direction for horizontal movement left", () => {
      const from: Position = { row: 0, column: 2 };
      const to: Position = { row: 0, column: 0 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 0, horizontal: -2 });
    });

    it("should return direction for horizontal movement right", () => {
      const from: Position = { row: 0, column: 0 };
      const to: Position = { row: 0, column: 1 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 0, horizontal: 1 });
    });

    it("should return zero direction for same position", () => {
      const from: Position = { row: 1, column: 1 };
      const to: Position = { row: 1, column: 1 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 0, horizontal: 0 });
    });

    it("should return direction for diagonal movement", () => {
      const from: Position = { row: 0, column: 0 };
      const to: Position = { row: 2, column: 3 };
      const result = getDirection(from, to);
      expect(result).toEqual({ vertical: 2, horizontal: 3 });
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
      expect(result).toContainEqual({ row: 1, column: 0 });
      expect(result).toContainEqual({ row: 1, column: 2 });
    });

    it("should return all valid neighbors (vertical)", () => {
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

  describe("isPositionVisited", () => {
    it("should return false for empty path", () => {
      const path: Position[] = [];
      expect(isPositionVisited(path, {row: 0, column: 0})).toBe(false);
    });

    it("should return true when position is in path", () => {
      const path: Position[] = [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 1 },
      ];
      expect(isPositionVisited(path, {row: 0, column: 1})).toBe(true);
    });

    it("should return false when position is not in path", () => {
      const path: Position[] = [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 1 },
      ];
      expect(isPositionVisited(path, {row: 2, column: 2})).toBe(false);
    });
  });

  describe("isValidNeighborForDirection", () => {
    const horizontalRight: Direction = { vertical: 0, horizontal: 1 };
    const horizontalLeft: Direction = { vertical: 0, horizontal: -1 };
    const verticalDown: Direction = { vertical: 1, horizontal: 0 };
    const verticalUp: Direction = { vertical: -1, horizontal: 0 };

    describe("special characters (valid in any direction)", () => {
      it.each([
        [horizontalRight],
        [horizontalLeft],
      ])("should return true for intersection (+) in horizontal direction: %s", (direction) => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.INTERSECTION, direction)).toBe(true);
      });

      it.each([
        [verticalDown],
        [verticalUp],
      ])("should return true for intersection (+) in vertical direction: %s", (direction) => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.INTERSECTION, direction)).toBe(true);
      });

      it.each([
        [horizontalRight],
        [horizontalLeft],
      ])("should return true for end character (x) in horizontal direction: %s", (direction) => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.END, direction)).toBe(true);
      });

      it.each([
        [verticalDown],
        [verticalUp],
      ])("should return true for end character (x) in vertical direction: %s", (direction) => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.END, direction)).toBe(true);
      });

      it.each([
        ["A", horizontalRight],
        ["Z", horizontalRight],
        ["M", horizontalLeft],
      ])("should return true for capital letter %s in horizontal direction", (char, direction) => {
        expect(isValidNeighborForDirection(char, direction)).toBe(true);
      });

      it.each([
        ["A", verticalDown],
        ["Z", verticalDown],
        ["M", verticalUp],
      ])("should return true for capital letter %s in vertical direction", (char, direction) => {
        expect(isValidNeighborForDirection(char, direction)).toBe(true);
      });
    });

    describe("horizontal direction validation", () => {
      it.each([
        [horizontalRight],
        [horizontalLeft],
      ])("should return true for horizontal character (-) in horizontal direction: %s", (direction) => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.HORIZONTAL, direction)).toBe(true);
      });

      it.each([
        [horizontalRight],
        [horizontalLeft],
      ])("should return false for vertical character (|) in horizontal direction: %s", (direction) => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.VERTICAL, direction)).toBe(false);
      });
    });

    describe("vertical direction validation", () => {
      it.each([
        [verticalDown],
        [verticalUp],
      ])("should return true for vertical character (|) in vertical direction: %s", (direction) => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.VERTICAL, direction)).toBe(true);
      });
      it.each([
        [verticalDown],
        [verticalUp],
      ])("should return false for horizontal character (-) in vertical direction: %s", (direction) => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.HORIZONTAL, direction)).toBe(false);
      });
    });

    describe("invalid characters", () => {
      it.each([
        [horizontalRight],
        [verticalDown],
      ])("should return false for space character in direction: %s", (direction) => {
        expect(isValidNeighborForDirection(" ", direction)).toBe(false);
      });

      it.each([
        ["a", horizontalRight],
        ["z", verticalDown],
      ])("should return false for lowercase letter %s in direction", (char, direction) => {
        expect(isValidNeighborForDirection(char, direction)).toBe(false);
      });

      it.each([
        [horizontalRight],
        [verticalDown],
      ])("should return false for start character (@) in direction: %s", (direction) => {
        expect(isValidNeighborForDirection(MAP_CHARACTERS.START, direction)).toBe(false);
      });

      it.each([
        ["0", horizontalRight],
        ["9", verticalDown],
      ])("should return false for number %s in direction", (char, direction) => {
        expect(isValidNeighborForDirection(char, direction)).toBe(false);
      });

      it.each([
        ["#", horizontalRight],
        ["$", verticalDown],
        [".", horizontalRight],
      ])("should return false for special symbol %s in direction", (char, direction) => {
        expect(isValidNeighborForDirection(char, direction)).toBe(false);
      });
    });

    describe("edge cases", () => {
      it.each([
        [MAP_CHARACTERS.HORIZONTAL],
        [MAP_CHARACTERS.VERTICAL],
        [MAP_CHARACTERS.INTERSECTION],
        ["A"],
        [MAP_CHARACTERS.END],
      ])("should return false for character %s with zero direction (no movement)", (char) => {
        const zeroDirection: Direction = { vertical: 0, horizontal: 0 };
        expect(isValidNeighborForDirection(char, zeroDirection)).toBe(false);
      });
      it.each([
        [MAP_CHARACTERS.HORIZONTAL],
        [MAP_CHARACTERS.VERTICAL],
        [MAP_CHARACTERS.INTERSECTION],
        ["A"],
        [MAP_CHARACTERS.END],
      ])("should return false for character %s with diagonal direction", (char) => {
        const diagonalDirection: Direction = { vertical: 1, horizontal: 1 };
        expect(isValidNeighborForDirection(char, diagonalDirection)).toBe(false);
      });
      it.each([
        [MAP_CHARACTERS.HORIZONTAL],
        [MAP_CHARACTERS.VERTICAL],
        [MAP_CHARACTERS.INTERSECTION],
        ["A"],
        [MAP_CHARACTERS.END],
      ])("should return false for character %s with direction > 1", (char) => {
        const direction: Direction = { vertical: 2, horizontal: 0 };
        expect(isValidNeighborForDirection(char, direction)).toBe(false);
      });
    });
  });
});
