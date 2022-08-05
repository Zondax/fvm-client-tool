module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  roots: ["<rootDir>/tests/"],
  globals: {
    "ts-jest": {
      tsconfig: `<rootDir>/tests/tsconfig.json`,
    },
  },
};
