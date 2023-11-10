export const parseOptionalEnum = <T>(
  value: unknown,
  enumType: any
): T | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  return parseEnum(value, enumType);
};

export const parseEnum = <T>(value: unknown, enumType: any): T => {
  if (typeof value !== "string") {
    throw new Error("Only string can be parsed as enum");
  }
  if (!Object.values(enumType).includes(value)) {
    throw new Error(
      `Value "${value}" is not valid value for enum '${enumType}'`
    );
  }

  return value as T;
};
