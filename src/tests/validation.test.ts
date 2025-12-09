import { describe, it, expect, jest } from "@jest/globals";
import { validateMapStartAndEnd } from "../utils/validation";
import type { Map } from "../types";
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

    it("should return error when startPosition is undefined after length check (covers line 27)", () => {
      // To trigger line 27, we need getCharacterIndices to return array with undefined element
      // We'll mock getCharacterIndices to return [undefined]
      const getCharacterIndicesSpy = jest.spyOn(
        require("../utils/mapNavigation"),
        "getCharacterIndices"
      );

      getCharacterIndicesSpy
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

      getCharacterIndicesSpy.mockRestore();
    });
  });
});
