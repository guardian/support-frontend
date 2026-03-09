/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  runner: "groups",
  testPathIgnorePatterns: ["/node_modules/", "target", "cdk/dist"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/typescript/$1",
  },
};
