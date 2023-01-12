module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
