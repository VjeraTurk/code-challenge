export const MAP_CHARACTERS = {
  START: "@",
  END: "x",
  INTERSECTION: "+",
  HORIZONTAL: "-",
  VERTICAL: "|",
  CAPITAL_LETTER_START: "A",
  CAPITAL_LETTER_END: "Z",
} as const;

export const ERROR_MESSAGES = {
  START_OR_END_NOT_FOUND: "Start or end not found",
  MULTIPLE_START_OR_END: "Multiple start or end characters found",
  BROKEN_PATH: "Broken path",
  MULTIPLE_STARTING_PATHS: "Multiple starting paths",
  FAKE_TURN: "Fake turn",
  FORK_IN_PATH: "Fork in path",
} as const;
