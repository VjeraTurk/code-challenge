import { describe, it, expect } from "@jest/globals";
import { traversePath } from "../utils/pathTraversal";
import type { Position, Map } from "../types";
import { ERROR_MESSAGES } from "../constants";
import {
  mapBasicExample,
  mapGoStraightThroughIntersections,
  mapLettersMayBeFoundOnTurns,
  mapDoNotCollectALetterFromTheSameLocationTwice,
  mapKeepDirectionEvenInACompactSpace,
  mapIgnoreStuffAfterEndOfPath,
  mapFirstStepIntersection,
  mapBrokenPath,
  mapForkInPath,
  mapFakeTurn,
} from "../tests/data/mock";
import { getCharacterPositions } from "../utils/mapNavigation";

describe("pathTraversal", () => {
  describe("traversePath", () => {
    describe("successful path traversal", () => {
      it("should traverse a basic example path correctly", () => {
        const start = getCharacterPositions(mapBasicExample, "@")[0];
        const end = getCharacterPositions(mapBasicExample, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapBasicExample, start!, end!);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          characterPath: value.characterPath.join(""),
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          characterPath: "@---A---+|C|+---+|+-B-x",
          letters: "ACB",
        });
      });

      it("should go straight through intersections", () => {
        const start = getCharacterPositions(mapGoStraightThroughIntersections, "@")[0];
        const end = getCharacterPositions(mapGoStraightThroughIntersections, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapGoStraightThroughIntersections, start!, end!);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          characterPath: value.characterPath.join(""),
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          characterPath: "@|A+---B--+|+--C-+|-||+---D--+|x",
          letters: "ABCD",
        });
      });

      it("should find letters on turns", () => {
        const start = getCharacterPositions(mapLettersMayBeFoundOnTurns, "@")[0];
        const end = getCharacterPositions(mapLettersMayBeFoundOnTurns, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapLettersMayBeFoundOnTurns, start!, end!);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          characterPath: value.characterPath.join(""),
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          characterPath: "@---A---+|||C---+|+-B-x",
          letters: "ACB",
        });
      });

      it("should not collect a letter from the same location twice", () => {
        const start = getCharacterPositions(mapDoNotCollectALetterFromTheSameLocationTwice, "@")[0];
        const end = getCharacterPositions(mapDoNotCollectALetterFromTheSameLocationTwice, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapDoNotCollectALetterFromTheSameLocationTwice, start!, end!);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          characterPath: value.characterPath.join(""),
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          characterPath: "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x",
          letters: "GOONIES",
        });
      });

      it("should keep direction even in a compact space", () => {
        const start = getCharacterPositions(mapKeepDirectionEvenInACompactSpace, "@")[0];
        const end = getCharacterPositions(mapKeepDirectionEvenInACompactSpace, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapKeepDirectionEvenInACompactSpace, start!, end!);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          characterPath: value.characterPath.join(""),
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          characterPath: "@B+++B|+-L-+A+++A-+Hx",
          letters: "BLAH",
        });
      });

      it("should ignore stuff after end of path", () => {
        const start = getCharacterPositions(mapIgnoreStuffAfterEndOfPath, "@")[0];
        const end = getCharacterPositions(mapIgnoreStuffAfterEndOfPath, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapIgnoreStuffAfterEndOfPath, start!, end!);
        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          characterPath: value.characterPath.join(""),
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          characterPath: "@-A--+|+-B--x",
          letters: "AB",
        });
      });

      it("should handle first step intersection", () => {
        const start = getCharacterPositions(mapFirstStepIntersection, "@")[0];
        const end = getCharacterPositions(mapFirstStepIntersection, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapFirstStepIntersection, start!, end!);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          characterPath: value.characterPath.join(""),
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          characterPath: "@+||+-A||x",
          letters: "A",
        });
      });

      it("should include start and end characters in path", () => {
        const simpleMap: Map = [
          ["@", "-", "x"],
        ];
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 0, column: 2 };

        const result = traversePath(simpleMap, start, end);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          firstChar: value.characterPath[0],
          lastChar: value.characterPath[value.characterPath.length - 1],
        }).toEqual({
          success: true,
          firstChar: "@",
          lastChar: "x",
        });
      });

      it("should return empty letters array when no letters in path", () => {
        const simpleMap: Map = [
          ["@", "-", "-", "x"],
        ];
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 0, column: 3 };

        const result = traversePath(simpleMap, start, end);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          letters: value.letters,
          characterPath: value.characterPath.join(""),
        }).toEqual({
          success: true,
          letters: [],
          characterPath: "@--x",
        });
      });
    });

    describe("error handling", () => {
      it("should return error when path is broken", () => {
        const start = getCharacterPositions(mapBrokenPath, "@")[0];
        const end = getCharacterPositions(mapBrokenPath, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapBrokenPath, start!, end!);
        expect({
          success: result.success,
          errorMessage: (result as { success: false; error: Error }).error.message,
        }).toEqual({
          success: false,
          errorMessage: "Broken path",
        });
      });

      it("should return error when fork in path", () => {
        const start = getCharacterPositions(mapForkInPath, "@")[0];
        const end = getCharacterPositions(mapForkInPath, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapForkInPath, start!, end!);
        expect({
          success: result.success,
          errorMessage: (result as { success: false; error: Error }).error.message,
        }).toEqual({
          success: false,
          errorMessage: "Fork in path",
        });
      });

      it("should return error when fake turn encountered", () => {
        const start = getCharacterPositions(mapFakeTurn, "@")[0];
        const end = getCharacterPositions(mapFakeTurn, "x")[0];

        expect(start).toBeDefined();
        expect(end).toBeDefined();

        const result = traversePath(mapFakeTurn, start!, end!);
        expect({
          success: result.success,
          errorMessage: (result as { success: false; error: Error }).error.message,
        }).toEqual({
          success: false,
          errorMessage: "Fake turn",
        });
        traversePath(mapFakeTurn, start!, end!);
      });

      it("should return error when startPosition is invalid", () => {
        const map: Map = [["@", "-", "x"]];
        const invalidStart: Position = { row: -1, column: 0 };
        const end: Position = { row: 0, column: 2 };
        const result = traversePath(map, invalidStart, end);
        expect({
          success: result.success,
          errorMessage: (result as { success: false; error: Error }).error.message,
        }).toEqual({
          success: false,
          errorMessage: "Invalid position",
        });
      });

      it("should return error when endPosition is invalid", () => {
        const map: Map = [["@", "-", "x"]];
        const start: Position = { row: 0, column: 0 };
        const invalidEnd: Position = { row: 0, column: -1 };
        const result = traversePath(map, start, invalidEnd);
        expect({
          success: result.success,
          errorMessage: (result as { success: false; error: Error }).error.message,
        }).toEqual({
          success: false,
          errorMessage: "Invalid position",
        });
      });
    });

    describe("edge cases", () => {
        it("should return error when start equals end (no valid path)", () => {
        const map: Map = [["@"]];
        const position: Position = { row: 0, column: 0 };

        const result = traversePath(map, position, position);
        expect({
          success: result.success,
          errorMessage: (result as { success: false; error: Error }).error.message,
        }).toEqual({
          success: false,
          errorMessage: "Broken path",
        });
        traversePath(map, position, position);
      });

      it("should handle vertical path", () => {
        const map: Map = [
          ["@"],
          ["|"],
          ["A"],
          ["|"],
          ["x"],
        ];
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 4, column: 0 };

        const result = traversePath(map, start, end);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          characterPath: value.characterPath.join(""),
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          characterPath: "@|A|x",
          letters: "A",
        });
      });

      it("should handle horizontal path", () => {
        const map: Map = [
          ["@", "-", "-", "A", "-", "x"],
        ];
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 0, column: 5 };

        const result = traversePath(map, start, end);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          characterPath: value.characterPath.join(""),
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          characterPath: "@--A-x",
          letters: "A",
        });
      });

      it("should collect multiple letters in order", () => {
        const map: Map = [
          ["@", "-", "A", "-", "B", "-", "C", "-", "x"],
        ];
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 0, column: 8 };

        const result = traversePath(map, start, end);

        const value = (result as { success: true; value: { characterPath: string[]; letters: string[] } }).value;
        expect({
          success: result.success,
          letters: value.letters.join(""),
        }).toEqual({
          success: true,
          letters: "ABC",
        });
      });
      it("should throw error when character not found at start position", () => {
        // Create a map where the start position has no character (undefined or empty row)
        const map: Map = [[]]; // Empty row - position (0,0) has no character
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 0, column: 0 };

        expect(() => traversePath(map, start, end)).toThrow(ERROR_MESSAGES.CHARACTER_NOT_FOUND_AT_CURRENT_POSITION);
      });
    });
  });
});
