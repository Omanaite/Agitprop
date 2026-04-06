import type { Config } from "jest";
import nextJest from "next/jest.js";

/**
 * Jest config for unit tests.
 *
 * next/jest sets up:
 *  - TypeScript + JSX transforms via SWC
 *  - module path aliases (@/ → src)
 *  - mocking for next/navigation, next/image, etc.
 *
 * Run: npx jest
 * Watch: npx jest --watch
 */
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
