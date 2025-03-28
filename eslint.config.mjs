// @ts-check

import eslint from '@eslint/js';
import oxlint from "eslint-plugin-oxlint";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from 'typescript-eslint';

const indent = 4;
/**
 * @typedef {import("eslint-plugin-react-hooks").ConfigArray} ConfigArray
 */

/** @type {ConfigArray} */
const config = tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        ignores: ["src-tauri/**"]
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            },
        }
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            'react-hooks': reactHooks
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        rules: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ...reactHooks.configs.recommended.rules,
            "@typescript-eslint/no-unsafe-assignment": ["off"],
            "@typescript-eslint/prefer-nullish-coalescing": ["off"],
            "indent": ["error", indent],
            'quotes': ["error", "double"],
        }
    },
    oxlint.configs["flat/recommended"],
    oxlint.configs["flat/react"],
    oxlint.configs["flat/react-hooks"],
    oxlint.configs["flat/react-perf"],
    oxlint.configs["flat/style"],
    oxlint.configs["flat/perf"],
    oxlint.configs["flat/correctness"],
    oxlint.configs["flat/typescript"],
);

export default config;