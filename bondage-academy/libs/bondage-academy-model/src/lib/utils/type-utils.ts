import * as t from "io-ts";

export class TypeUtils {
  static fromEnum = <
    T extends string,
    TEnumValue extends string | number
  >(theEnum: { [key in T]: TEnumValue }): t.Type<TEnumValue> => {
    const isEnumValue = (input: unknown): input is TEnumValue =>
      Object.values(theEnum).includes(input);

    return new t.Type<TEnumValue>(
      "enum",
      isEnumValue,
      (input, context) =>
        isEnumValue(input) ? t.success(input) : t.failure(input, context),
      t.identity
    );
  };
}
