module.exports = {
    "root": true,
    "extends": [
        "react-app",
        "react-app/jest",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "parserOptions": {
        "tsconfigRootDir": __dirname,
        "project": "./tsconfig.json"
    },
    "overrides": [
        {
            "files": ["**/*.ts?(x)"],
            "rules": {
                "no-case-declarations": "off",
                "no-return-await": "off",
                "no-useless-escape": "off",
                "no-control-regex": "off",

                "@typescript-eslint/require-await": "off",
                "@typescript-eslint/no-unsafe-return": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
                "@typescript-eslint/return-await": "error",

                "@typescript-eslint/no-inferrable-types": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-explicit-any": "off"
            }
        }
    ]
}