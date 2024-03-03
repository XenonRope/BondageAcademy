import { mock } from "ts-jest-mocker";
import { container } from "tsyringe";
import { Dao } from "../dao/dao";
import { Logger } from "../log/logger";

export const setupContainer = (): void => {
  container.clearInstances();

  const logger = mock(Logger);
  const dao = mock(Dao);

  container.registerInstance(Logger, logger);
  container.registerInstance(Dao, dao);
};
