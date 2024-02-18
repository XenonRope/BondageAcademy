export interface Position {
  x: number;
  y: number;
}

export const arePositionsEqual = (
  firstPosition: Position,
  secondPosition: Position,
) =>
  firstPosition.x === secondPosition.x && firstPosition.y === secondPosition.y;
