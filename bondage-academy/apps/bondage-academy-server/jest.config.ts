/* eslint-disable */
export default {
  displayName: "bondage-academy-server",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/apps/bondage-academy-server",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
