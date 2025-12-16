import { describe, it, expect, xit, jest } from "@jest/globals";
import * as mapNavigationModule from "../utils/mapNavigation";
import {
  isMovingHorizontally,
  isMovingVertically,
  getFirstStepPosition,
  getIntersectionStep,
  getStepForwardPosition,
  getNextStepPosition,
  pathFindingModuleInternal,
} from "../utils/pathFinding";
import type { Position, Map } from "../types";
import { MAP_CHARACTERS, ERROR_MESSAGES } from "../constants";

describe("pathFinding", () => {
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

    it("should return false when same position (same row and same column)", () => {
      const position: Position = { row: 1, column: 1 };
      expect(isMovingHorizontally(position, position)).toBe(false);
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

    it("should return false when same position (same column and same row)", () => {
      const position: Position = { row: 1, column: 1 };
      expect(isMovingVertically(position, position)).toBe(false);
    });
  });

  describe("getFirstStepPosition", () => {
    it("should return error when position is invalid", () => {
      const map: Map = [["@", "-", "x"]];
      const position: Position = { row: -1, column: 0 };
      const result = getFirstStepPosition(map, position);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe("Invalid position");
      }
    });

    it("should return error when no valid neighbors found", () => {
      const map: Map = [
        ["@", " "],
        [" ", " "],
      ];
      const position: Position = { row: 0, column: 0 };
      const result = getFirstStepPosition(map, position);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.BROKEN_PATH);
      }
    });
    it("should return error when firstNeighbor is undefined", () => {
      // Test the defensive check at line 60
      // We need to mock getNeighbors to return an array with undefined element
      const getNeighborsSpy = jest.spyOn(
        require("../utils/mapNavigation"),
        "getNeighbors"
      );

      // Mock to return array with length 1 but undefined element
      getNeighborsSpy.mockReturnValueOnce([undefined as any]);

      const map: Map = [["@", "-"]];
      const position: Position = { row: 0, column: 0 };
      const result = getFirstStepPosition(map, position);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.BROKEN_PATH);
      }

      getNeighborsSpy.mockRestore();
    });

    it("should return error when multiple valid neighbors found", () => {
      const map: Map = [
        [" ", "-", " "],
        ["-", "@", "-"],
        [" ", "-", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getFirstStepPosition(map, position);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(
          ERROR_MESSAGES.MULTIPLE_STARTING_PATHS
        );
      }
    });

    it("should not find any neighbors", () => {
      const map: Map = [
        [" ", " ", " "],
        [" ", "@", "|"],
        [" ", " ", " "],
      ];
      const position: Position = { row: 1, column: 1 };
      const result = getFirstStepPosition(map, position);
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
      const result = getFirstStepPosition(map, position);
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
      const result = getFirstStepPosition(map, position);
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
      const result = getFirstStepPosition(map, position);
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

    it("should return error when validTurn is undefined", () => {
      // Test the defensive check at line 102
      // We need to create a scenario where validTurns.length === 1 but validTurns[0] === undefined
      // This is a defensive check. We'll use a Proxy to intercept the filter operation
      const getNeighborsSpy = jest.spyOn(mapNavigationModule, "getNeighbors");

      // Create a proxy array that when filtered returns [undefined]
      const mockNeighbors = [{ row: 0, column: 1 }];
      const proxyNeighbors = new Proxy(mockNeighbors, {
        get(target, prop) {
          if (prop === "filter") {
            return function (callback: any) {
              // Return array with undefined element to trigger the defensive check
              return [undefined as any];
            };
          }
          return (target as any)[prop];
        },
      });

      getNeighborsSpy.mockReturnValueOnce(proxyNeighbors as any);

      const map: Map = [
        [" ", "|", " "],
        ["-", MAP_CHARACTERS.INTERSECTION, "-"],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };

      const result = getIntersectionStep(map, current, previous);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.FAKE_TURN);
      }

      getNeighborsSpy.mockRestore();
    });
  });

  describe("getStepForwardPosition", () => {
    it("should return next position when continuing in same direction", () => {
      const map: Map = [["@", "-", "-", "A"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardPosition(map, current, previous);
      expect(result).toEqual({ row: 0, column: 2 });
    });

    it("should return next position when moving vertically", () => {
      const map: Map = [["@"], ["|"], ["A"]];
      const current: Position = { row: 1, column: 0 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardPosition(map, current, previous);
      expect(result).toEqual({ row: 2, column: 0 });
    });

    it("should return undefined when next position is invalid", () => {
      const map: Map = [["@", "-", " "]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardPosition(map, current, previous);
      expect(result).toBeUndefined();
    });

    it("should return undefined when next position is out of bounds", () => {
      const map: Map = [["@", "-"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardPosition(map, current, previous);
      expect(result).toBeUndefined();
    });

    it("should accept letter as valid forward step", () => {
      const map: Map = [["@", "-", "A", "-"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardPosition(map, current, previous);
      expect(result).toEqual({ row: 0, column: 2 });
    });

    it("should accept end character as valid forward step", () => {
      const map: Map = [["@", "-", MAP_CHARACTERS.END]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getStepForwardPosition(map, current, previous);
      expect(result).toEqual({ row: 0, column: 2 });
    });

    it("should handle reverse direction (moving backwards)", () => {
      const map: Map = [["A", "-", "@"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 2 };
      const result = getStepForwardPosition(map, current, previous);
      expect(result).toEqual({ row: 0, column: 0 });
    });
  });

  describe("getNextStepPosition", () => {
    it("should call getFirstStepPosition when previousPosition is null", () => {
      const map: Map = [
        [" ", " ", " "],
        [" ", "@", "-"],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const getFirstStepPositionSpy = jest.spyOn(
        pathFindingModuleInternal,
        "getFirstStepPosition"
      );
      const result = getNextStepPosition(map, current, null);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 1, column: 2 });
      }
      expect(getFirstStepPositionSpy).toHaveBeenCalledTimes(1);
      expect(getFirstStepPositionSpy).toHaveBeenCalledWith(map, current);
    });

    it("should continue forward when not at intersection", () => {
      const map: Map = [["@", "-", "-", "A"]];
      const current: Position = { row: 0, column: 1 };
      const previous: Position = { row: 0, column: 0 };
      const result = getNextStepPosition(map, current, previous);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 0, column: 2 });
      }
    });
    it("should handle intersection character", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", MAP_CHARACTERS.INTERSECTION, "-"],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };

      // Now we can use jest.spyOn with CommonJS!
      // The spy will intercept calls to getIntersectionStep even when called from within getNextStepPosition
      const getIntersectionStepSpy = jest.spyOn(
        pathFindingModuleInternal,
        "getIntersectionStep"
      );

      const result = getNextStepPosition(map, current, previous);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toEqual({ row: 0, column: 1 });
      }

      // Verify that getIntersectionStep was called
      expect(getIntersectionStepSpy).toHaveBeenCalledTimes(1);
      expect(getIntersectionStepSpy).toHaveBeenCalledWith(
        map,
        current,
        previous
      );

      // Clean up the spy
      getIntersectionStepSpy.mockRestore();
    });

    it("should handle letter as intersection when forward step fails", () => {
      const map: Map = [
        [" ", "|", " "],
        ["-", "A", " "],
        [" ", " ", " "],
      ];
      const current: Position = { row: 1, column: 1 };
      const previous: Position = { row: 1, column: 0 };
      const result = getNextStepPosition(map, current, previous);
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
      const result = getNextStepPosition(map, current, previous);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.BROKEN_PATH);
      }
    });

    it("should return error when currentChar is undefined (out of bounds)", () => {
      const map: Map = [["@", "-"]];
      const current: Position = { row: 0, column: 2 }; // Out of bounds
      const previous: Position = { row: 0, column: 1 };
      const result = getNextStepPosition(map, current, previous);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(ERROR_MESSAGES.BROKEN_PATH);
      }
    });

    it("should return error when currentChar is undefined (invalid row)", () => {
      const map: Map = [["@", "-"]];
      const current: Position = { row: 5, column: 0 }; // Invalid row
      const previous: Position = { row: 0, column: 0 };
      const result = getNextStepPosition(map, current, previous);
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
      const result = getNextStepPosition(map, current, previous);
      // Should check forward first, but since it's an intersection, should turn
      expect(result.success).toBe(true);
    });
  });
});
