import "@abraham/reflection";

jest.spyOn(global.console, "log").mockImplementation(() => jest.fn());
