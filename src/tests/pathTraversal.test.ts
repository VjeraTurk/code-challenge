import { describe, it, expect } from "@jest/globals";
import { traversePath } from "../utils/pathTraversal";
import type { Position, Map } from "../types";
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
import { getCharacterIndices } from "../utils/mapNavigation";

describe("pathTraversal", () => {
  describe("traversePath", () => {
    describe("successful path traversal", () => {
      it("should traverse a basic example path correctly", () => {
        const start = getCharacterIndices(mapBasicExample, "@")[0];
        const end = getCharacterIndices(mapBasicExample, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        const result = traversePath(mapBasicExample, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath.join("")).toBe("@---A---+|C|+---+|+-B-x");
          expect(result.value.letters.join("")).toBe("ACB");
        }
      });

      it("should go straight through intersections", () => {
        const start = getCharacterIndices(mapGoStraightThroughIntersections, "@")[0];
        const end = getCharacterIndices(mapGoStraightThroughIntersections, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        const result = traversePath(mapGoStraightThroughIntersections, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath.join("")).toBe(
            "@|A+---B--+|+--C-+|-||+---D--+|x"
          );
          expect(result.value.letters.join("")).toBe("ABCD");
        }
      });

      it("should find letters on turns", () => {
        const start = getCharacterIndices(mapLettersMayBeFoundOnTurns, "@")[0];
        const end = getCharacterIndices(mapLettersMayBeFoundOnTurns, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        const result = traversePath(mapLettersMayBeFoundOnTurns, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath.join("")).toBe("@---A---+|||C---+|+-B-x");
          expect(result.value.letters.join("")).toBe("ACB");
        }
      });

      it("should not collect a letter from the same location twice", () => {
        const start = getCharacterIndices(mapDoNotCollectALetterFromTheSameLocationTwice, "@")[0];
        const end = getCharacterIndices(mapDoNotCollectALetterFromTheSameLocationTwice, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        const result = traversePath(mapDoNotCollectALetterFromTheSameLocationTwice, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath.join("")).toBe(
            "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x"
          );
          expect(result.value.letters.join("")).toBe("GOONIES");
        }
      });

      it("should keep direction even in a compact space", () => {
        const start = getCharacterIndices(mapKeepDirectionEvenInACompactSpace, "@")[0];
        const end = getCharacterIndices(mapKeepDirectionEvenInACompactSpace, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        const result = traversePath(mapKeepDirectionEvenInACompactSpace, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath.join("")).toBe("@B+++B|+-L-+A+++A-+Hx");
          expect(result.value.letters.join("")).toBe("BLAH");
        }
      });

      it("should ignore stuff after end of path", () => {
        const start = getCharacterIndices(mapIgnoreStuffAfterEndOfPath, "@")[0];
        const end = getCharacterIndices(mapIgnoreStuffAfterEndOfPath, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        const result = traversePath(mapIgnoreStuffAfterEndOfPath, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath.join("")).toBe("@-A--+|+-B--x");
          expect(result.value.letters.join("")).toBe("AB");
        }
      });

      it("should handle first step intersection", () => {
        const start = getCharacterIndices(mapFirstStepIntersection, "@")[0];
        const end = getCharacterIndices(mapFirstStepIntersection, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        const result = traversePath(mapFirstStepIntersection, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath.join("")).toBe("@+||+-A||x");
          expect(result.value.letters.join("")).toBe("A");
        }
      });

      it("should include start and end characters in path", () => {
        const simpleMap: Map = [
          ["@", "-", "x"],
        ];
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 0, column: 2 };

        const result = traversePath(simpleMap, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath[0]).toBe("@");
          expect(result.value.characterPath[result.value.characterPath.length - 1]).toBe("x");
        }
      });

      it("should return empty letters array when no letters in path", () => {
        const simpleMap: Map = [
          ["@", "-", "-", "x"],
        ];
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 0, column: 3 };

        const result = traversePath(simpleMap, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.letters).toEqual([]);
          expect(result.value.characterPath.join("")).toBe("@--x");
        }
      });
    });

    describe("error handling", () => {
      it("should throw error when path is broken", () => {
        const start = getCharacterIndices(mapBrokenPath, "@")[0];
        const end = getCharacterIndices(mapBrokenPath, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        expect(() => {
          traversePath(mapBrokenPath, start, end);
        }).toThrow();
      });

      it("should throw error when fork in path", () => {
        const start = getCharacterIndices(mapForkInPath, "@")[0];
        const end = getCharacterIndices(mapForkInPath, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        expect(() => {
          traversePath(mapForkInPath, start, end);
        }).toThrow();
      });

      it("should throw error when fake turn encountered", () => {
        const start = getCharacterIndices(mapFakeTurn, "@")[0];
        const end = getCharacterIndices(mapFakeTurn, "x")[0];

        if (!start || !end) {
          throw new Error("Start or end not found in map");
        }

        expect(() => {
          traversePath(mapFakeTurn, start, end);
        }).toThrow();
      });

      it("should throw error when character not found at position", () => {
        const map: Map = [
          ["@", "-"],
        ];
        const start: Position = { row: 0, column: 0 };
        const invalidPosition: Position = { row: 0, column: 5 }; // Out of bounds

        expect(() => {
          traversePath(map, start, invalidPosition);
        }).toThrow();
      });

      it("should return error when startPosition is invalid", () => {
        const map: Map = [["@", "-", "x"]];
        const invalidStart: Position = { row: -1, column: 0 };
        const end: Position = { row: 0, column: 2 };
        const result = traversePath(map, invalidStart, end);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.message).toBe("Invalid start or end position");
        }
      });

      it("should return error when endPosition is invalid", () => {
        const map: Map = [["@", "-", "x"]];
        const start: Position = { row: 0, column: 0 };
        const invalidEnd: Position = { row: 0, column: -1 };
        const result = traversePath(map, start, invalidEnd);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.message).toBe("Invalid start or end position");
        }
      });
    });

    describe("edge cases", () => {
        it("should throw error when start equals end (no valid path)", () => {
        const map: Map = [["@"]];
        const position: Position = { row: 0, column: 0 };

        expect(() => {
          traversePath(map, position, position);
        }).toThrow();
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

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath.join("")).toBe("@|A|x");
          expect(result.value.letters.join("")).toBe("A");
        }
      });

      it("should handle horizontal path", () => {
        const map: Map = [
          ["@", "-", "-", "A", "-", "x"],
        ];
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 0, column: 5 };

        const result = traversePath(map, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.characterPath.join("")).toBe("@--A-x");
          expect(result.value.letters.join("")).toBe("A");
        }
      });

      it("should collect multiple letters in order", () => {
        const map: Map = [
          ["@", "-", "A", "-", "B", "-", "C", "-", "x"],
        ];
        const start: Position = { row: 0, column: 0 };
        const end: Position = { row: 0, column: 8 };

        const result = traversePath(map, start, end);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.value.letters.join("")).toBe("ABC");
        }
      });
    });
  });
});
