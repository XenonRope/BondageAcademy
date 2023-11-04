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
