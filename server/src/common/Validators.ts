export const requiredString = (
  value: unknown,
  minLength: number,
  maxLenght: number,
  errorMessage: string
): void => {
  if (
    typeof value !== "string" ||
    value.length < minLength ||
    value.length > maxLenght
  ) {
    throw new Error(errorMessage);
  }
};

export const requiredPosition = (value: unknown): void => {
  if (
    typeof value !== "object" ||
    value == null ||
    !("x" in value) ||
    !("y" in value) ||
    typeof value.x !== "number" ||
    typeof value.y !== "number"
  ) {
    throw new Error("requiredPosition");
  }
};
