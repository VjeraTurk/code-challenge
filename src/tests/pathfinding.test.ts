import { describe, it, expect, xit } from "@jest/globals";
import {
  isMovingHorizontally,
  isMovingVertically,
  getFirstStepIndices,
  getIntersectionStep,
  getStepForwardIndices,
  getNextStepIndices,
} from "../utils/pathfinding.js";
import type { Position, Map } from "../types.js";
import { MAP_CHARACTERS, ERROR_MESSAGES } from "../constants.js";

describe("pathfinding", () => {
  describe("isMovingHorizontally", () => {
    it("should return true when moving horizontally (same row)", () => {
      const previous: Position = { row: 0, column: 0 };
      const next: Position = { row: 0, column: 1 };
      expect(isMovingHorizontally(previous, next)).toBe(true);
    });

    it("should return false when moving vertically (different row)", () => {
      const previous: Position = { row: 0, column: 0 };
      const next: Position = { row: 1, column: 0 };
      expect(isMovingHorizontally(previous, next)).toBe(false);
    });

    // TODO: fix this
    it("should return true when same position (same row)", () => {
      const position: Position = { row: 1, column: 1 };
      expect(isMovingHorizontally(position, position)).toBe(true);
    });
  });

  describe("isMovingVertically", () => {
    it("should return true when moving vertically (same column)", () => {
      const previous: Position = { row: 0, column: 0 };
      const next: Position = { row: 1, column: 0 };
      expect(isMovingVertically(previous, next)).toBe(true);
    });

    it("should return false when moving horizontally (different column)", () => {
      const previous: Position = { row: 0, column: 0 };
      const next: Position = { row: 0, column: 1 };
      expect(isMovingVertically(previous, next)).toBe(false);
    });
 // TODO: fix this
    it("should return true when same position (same column)", () => {
      const position: Position = { row: 1, column: 1 };
      expect(isMovingVertically(position, position)).toBe(true);
    });
  });

  describe("getFirstStepIndices", () => {
    it("should return error when no valid neighbors found", () => {
      const map: Map = [
        ["@", " "],
        [" ", " "],
      ];
      const position: Position = { row: 0, column: 0 };
      const result = getFirstStepIndices(map, position);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.BROKEN_PATH);
      }
    });

    it("should return error when multiple valid neighbors found", () => {
      const map: Map = [
        [" ", "-", " "],
        ["-", "@", "-"],
        [" ", "-", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getFirstStepIndices(map, position);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(
          ERROR_MESSAGES.MULTIPLE_STARTING_PATHS
        );
      }
    });

    it("should not find any neighbours", () => {
      const map: Map = [
        [" ", " ", " "],
        [" ", "@", "|"],
        [" ", " ", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getFirstStepIndices(map, position);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.BROKEN_PATH);
      }
    });

    it("should return single valid neighbor", () => {
      const map: Map = [
        [" ", " ", " "],
        [" ", "@", "-"],
        [" ", " ", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getFirstStepIndices(map, position);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 1, column: 2 });
      }
    });

    it("should accept letter as valid neighbor", () => {
      const map: Map = [
        [" ", "A", " "],
        [" ", "@", " "],
        [" ", " ", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getFirstStepIndices(map, position);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 0, column: 1 });
      }
    });

    it("should accept end character as valid neighbor", () => {
      const map: Map = [
        [" ", " ", " "],
        [" ", "@", MAP_CHARACTERS.END],
        [" ", " ", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getFirstStepIndices(map, position);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 1, column: 2 });
      }
    });
  });

  describe("getIntersectionStep", () => {
    it("should return error when no valid turns found (fake turn)", () => {
      const map: Map = [["@", "-", MAP_CHARACTERS.INTERSECTION, "-", " "]];
      const current: Position = { row: 0, column: 2 };
      const previous: Position = { row: 0, column: 1 };
      const result = getIntersectionStep(map, current, previous);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.FAKE_TURN);
      }
    });

    it("should return error when multiple valid turns found (fork)", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", MAP_CHARACTERS.INTERSECTION, "-"],
        [" ", "|", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };
      const result = getIntersectionStep(map, current, previous);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.FORK_IN_PATH);
      }
    });

    it("should return valid turn when coming from horizontal (should go vertical)", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", MAP_CHARACTERS.INTERSECTION, "-"],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };
      const result = getIntersectionStep(map, current, previous);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 0, column: 1 });
      }
    });

    it("should return valid turn when coming from vertical (should go horizontal)", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", MAP_CHARACTERS.INTERSECTION, " "],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 0, column: 1 };
      const result = getIntersectionStep(map, current, previous);
      expect(result.success).toBe(true);
      // Should go horizontal (left), since right is empty
      if (result.success) {
        expect(result.value).toEqual({ row: 1, column: 0 });
      }
    });

    it("should handle letter as intersection", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", "A", "-"],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };
      const result = getIntersectionStep(map, current, previous);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 0, column: 1 });
      }
    });

    it("should handle upward movement from horizontal", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", MAP_CHARACTERS.INTERSECTION, " "],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };
      const result = getIntersectionStep(map, current, previous);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 0, column: 1 });
      }
    });

    it("should handle downward movement from horizontal", () => {
      const map: Map = [
        [" ", " ", " "],
        ["-", MAP_CHARACTERS.INTERSECTION, " "],
        [" ", "|", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };
      const result = getIntersectionStep(map, current, previous);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 2, column: 1 });
      }
    });
  });

  describe("getStepForwardIndices", () => {
    it("should return next position when continuing in same direction", () => {
      const map: Map = [["@", "-", "-", "A"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardIndices(map, current, previous);
      expect(result).toEqual({ row: 0, column: 2 });
    });

    it("should return next position when moving vertically", () => {
      const map: Map = [["@"], ["|"], ["A"]];
      const current: Position = { row: 1, column: 0 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardIndices(map, current, previous);
      expect(result).toEqual({ row: 2, column: 0 });
    });

    it("should return undefined when next position is invalid", () => {
      const map: Map = [["@", "-", " "]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardIndices(map, current, previous);
      expect(result).toBeUndefined();
    });

    it("should return undefined when next position is out of bounds", () => {
      const map: Map = [["@", "-"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardIndices(map, current, previous);
      expect(result).toBeUndefined();
    });

    it("should accept letter as valid forward step", () => {
      const map: Map = [["@", "-", "A", "-"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardIndices(map, current, previous);
      expect(result).toEqual({ row: 0, column: 2 });
    });

    it("should accept end character as valid forward step", () => {
      const map: Map = [["@", "-", MAP_CHARACTERS.END]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardIndices(map, current, previous);
      expect(result).toEqual({ row: 0, column: 2 });
    });

    it("should handle reverse direction (moving backwards)", () => {
      const map: Map = [["A", "-", "@"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 2 };
      const result = getStepForwardIndices(map, current, previous);
      expect(result).toEqual({ row: 0, column: 0 });
    });
  });

  // TODO: doesn't check if it was called correctly
  describe("getNextStepIndices", () => {
    it("should call getFirstStepIndices when previousPosition is null", () => {
      const map: Map = [
        [" ", " ", " "],
        [" ", "@", "-"],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const result = getNextStepIndices(map, current, null);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 1, column: 2 });
      }
    });

    it("should continue forward when not at intersection", () => {
      const map: Map = [["@", "-", "-", "A"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getNextStepIndices(map, current, previous);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 0, column: 2 });
      }
    });
    // TODO: doesn't check if it was called correctly
    it("should handle intersection character", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", MAP_CHARACTERS.INTERSECTION, "-"],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };
      const result = getNextStepIndices(map, current, previous);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 0, column: 1 });
      }
    });
    // TODO: doesn't check if it was called correctly
    it("should handle letter as intersection when forward step fails", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", "A", " "],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };
      const result = getNextStepIndices(map, current, previous);
      expect(result.success).toBe(true);
      // Forward step fails (space is invalid), so should treat letter as intersection and turn
      if (result.success) {
        expect(result.value).toEqual({ row: 0, column: 1 });
      }
    });

    it("should return error when path is broken", () => {
      const map: Map = [["@", "-", " "]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getNextStepIndices(map, current, previous);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.BROKEN_PATH);
      }
    });
    // TODO: should it prioritize forward step over intersection when both are valid?
    it("should prioritize forward step over intersection when both are valid", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", MAP_CHARACTERS.INTERSECTION, "-"],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };
      const result = getNextStepIndices(map, current, previous);
      // Should check forward first, but since it's an intersection, should turn
      expect(result.success).toBe(true);
    });
  });
});
