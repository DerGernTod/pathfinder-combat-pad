// @ts-check

import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import oxlint from "eslint-plugin-oxlint";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from 'typescript-eslint';

const indent = 4;
const config = defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        ignores: ["src-tauri/**", "dist"]
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
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'react-hooks': reactHooks
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "@typescript-eslint/no-unsafe-assignment": ["off"],
            "@typescript-eslint/prefer-nullish-coalescing": ["off"],
            "indent": ["error", indent],
            'quotes': ["error", "double"],
        }
    },
    ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
);

export default config;
