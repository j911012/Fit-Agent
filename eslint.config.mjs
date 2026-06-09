import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // type を使い interface を禁止する
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      // any 型禁止
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);

export default eslintConfig;
