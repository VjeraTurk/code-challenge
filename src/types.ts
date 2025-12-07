export type Position = { row: number; column: number };
export type Direction = { vertical: number; horizontal: number };
export type Map = string[][];

export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };
