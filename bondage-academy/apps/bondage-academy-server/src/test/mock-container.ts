import { mock } from "ts-jest-mocker";
import { configureServiceContainer } from "../app/services";
import { Dao } from "../dao/dao";

export const configureMockServiceContainer = () => {
  return configureServiceContainer().update("dao", () => mock(Dao));
};
