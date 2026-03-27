---
description: "Use when modifying TypeScript files. After any edits to .ts files, run prettier and eslint to fix formatting and linting issues."
applyTo: "**/*.ts"
---

# TypeScript Formatting & Linting

After making any changes to TypeScript files, always run both formatters and linters before finishing.

## Commands to run after TypeScript edits

From the package directory containing the changed files:

```sh
pnpm fix-formatting   # prettier --write
pnpm lint:fix         # eslint --fix
```

If the package does not have these exact scripts, use:

```sh
pnpm prettier --write <changed-file>
pnpm eslint --fix <changed-file>
```

## Rules

- Run `fix-formatting` before `lint:fix` (prettier may reformat code that eslint then checks).
- If `lint:fix` reports unfixable errors, stop and ask the user how to resolve them before proceeding.
- Always run from the correct package directory (the one with the `package.json` containing the lint/format scripts).
