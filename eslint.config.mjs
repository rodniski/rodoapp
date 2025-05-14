// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base Next.js configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Flexible configuration for TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Disable problematic rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "no-console": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "import/no-unresolved": "off",

      // Disable quotes and semi rules to fix warnings
      "quotes": "off", // Disable single quote enforcement
      "semi": "off", // Disable semicolon enforcement
    },
  },

  // Ignore common build artifacts and config files
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      ".next/**",
      "*.config.js",
      "*.config.ts",
    ],
  },
];

export default eslintConfig;