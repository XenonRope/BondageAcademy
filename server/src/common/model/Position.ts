export interface Position {
  x: number;
  y: number;
}

export const arePositionsEqual = (
  first: Position,
  second: Position
): boolean => {
  return first.x === second.x && first.y === second.y;
};
