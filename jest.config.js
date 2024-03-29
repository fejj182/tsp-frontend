module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/tests/e2e"],
  transformIgnorePatterns: ["/node_modules/(?!babel)"]
};
