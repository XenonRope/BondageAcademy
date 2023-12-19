export class ArrayUtils {
  static distinct<T>(array: T[]): T[] {
    return [...new Set(array)];
  }
}
