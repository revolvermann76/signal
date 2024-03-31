module.exports = {
    "parser": "@typescript-eslint/parser",
    "extends": [
        "prettier",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:prettier/recommended"
    ],
    "plugins": ["@typescript-eslint", "eslint-plugin-tsdoc", "import"],
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "amd": true
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "ignorePatterns": ["/src/main/generated/*", "/target/*"],
    "rules": {
        "import/order": [
            "warn",
            {
                "groups": [
                    "builtin",
                    "external",
                    "parent",
                    "sibling",
                    "index",
                    "object",
                    "internal",
                    "type",
                    "unknown"
                ],
                "newlines-between": "always",
                "alphabetize": {
                    "order": "asc",
                    "caseInsensitive": true
                },
                "warnOnUnassignedImports": true
            }
        ],
        "no-case-declarations": "error",
        "no-constant-condition": "warn",
        "no-empty": "error",
        "no-fallthrough": "error",
        "no-prototype-builtins": ["error"],
        "no-var": "error",
        "tsdoc/syntax": "warn",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/explicit-module-boundary-types": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-require-imports": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/typedef": "warn"
    }
};