// @ts-check

import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import oxlint from "eslint-plugin-oxlint";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin"

const config = defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        ignores: ["src-tauri/**", "dist", "node_modules"]
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["*.js"]
                },
                tsconfigRootDir: import.meta.dirname,
            },
        }
    },
    {
        files: ["**/*.{ts,tsx,js}"],
        plugins: {
            "@stylistic": stylistic
        },
        rules: {
            "@typescript-eslint/no-unsafe-assignment": ["off"],
            "@typescript-eslint/prefer-nullish-coalescing": ["off"],
            "quotes": ["error", "double"],
            "brace-style": ["error", "1tbs", { "allowSingleLine": false }],
            "@stylistic/indent": ["error", 4],
            "@stylistic/object-curly-spacing": ["error", "always"],
        }
    },
    ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
);

export default config;
