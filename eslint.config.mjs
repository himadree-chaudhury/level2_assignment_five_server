// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      "no-console": "warn", // Allow console statements
      "no-unused-vars": "warn", // Disallow unused variables
      // "no-undef": "error", // Disallow undefined variables
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type
      "@typescript-eslint/explicit-function-return-type": "off", // Allow functions without explicit return types
    },
  }
);
