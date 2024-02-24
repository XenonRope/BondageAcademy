import { InjectionToken } from "tsyringe";

export const token = <T>(name: string): InjectionToken<T> => {
  return Symbol(name);
};
