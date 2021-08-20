# Typescript Migration

This folder contains all of the configuration files- either brand new or changed from our existing files- scripts and Github workflows required for the migration of the client-side code to Typescript.

## Performing the migration

### Setting up configuration files

All files should replace any existing versions of the same file in their destination folder.

- Files in /scripts belong in support-frontend/support-frontend/scripts
- Files in /workflows belong in support-frontend/.github/workflows
- Files in /.storybook belong in support-frontend/support-frontend/.storybook
- Files in /gitHooks should be ignored for now
- All other files belong in support-frontend/support-frontend

### Running the migration script

1. Make copies of the /stories and /assets folders
2. Run `yarn` to install all dependencies in the new package.json
3. Run `node scripts/ts-migrate.js --dir=assets` to migrate the assets directory (this may take a while!)
4. Run `node scripts/ts-migrate.js --dir=stories` to migrate the stories directory

### Post-migration manual fixes

There are a few manual syntax fixes that need to be applied:

- In assets/components/subscriptionCheckouts/address/addressFields.tsx, remove `<GlobalState>` on line 128
- In assets/components/subscriptionCheckouts/address/postcodeFinder.tsx, remove `<GlobalState>` on line 98
- In stories/_index.ts, replace every instance of `.jsx` with `.tsx`
- Delete the jsconfig.json file at the root of /assets

### Automated fixing

After the migration the code will have some formatting issues and many linting errors. The former can be fixed by running `yarn prettier:fix` to apply Prettier formatting to the new Typescript files, and a portion of the latter by running `yarn lint:fix`. Make sure to commit **before** running each of these steps, to have a clean state to revert to in case of any issues.

### Documenting type errors

To begin with we will not be running type checking at build time, as there are too many errors to fix without requiring a long code freeze. However we do need to document TS compilation errors so we can gradually work through these and fix them. To generate a log of all errors and the files they arise in, run `node scripts/ts-log-errors.js`.

## Post-migration checks

1. Run the unit tests with `yarn test`. If the tests pass but the process still exits with code 1, run `yarn test -u` to remove obsolete snapshots
2. Run the three build scripts- `yarn build-dev`, `yarn build-ssr` and `yarn build-prod`
3. Run the site and Storybook locally with `devrun.sh` and check that they load and behave as expected

After this we can move on to testing on CODE.

## Testing and deployment

Once the working, migrated build is up on CODE, we can work through [this testing spreadsheet](https://docs.google.com/spreadsheets/d/1PHSXsfVOj8KK-mKpCCizHKjiy6wMdga4B4Axk4xNzJ0/edit?usp=sharing) as a group to verify that everything on the site looks and behaves as expected, and that the all the checkouts function as normal.

Any critical bugs discovered at this stage will need to be prioritised to fix as soon as possible (bugs that do not affect core functionality may be triaged according to their severity and fixed after the migration is merged). Bug fix branches should be made off of the base migration branch and merged back into it, rather than created in relation to `main`.

Once we're satisfied that there are no further issues and everything is functioning as normal, we can deploy to production. At this point it would be a good idea to inform stakeholders and User Help that we're doing so, in case of any issues or bugs that we haven't caught at the testing stage.

## After deployment

### Git hooks

*After* the code has been built, checked thoroughly on CODE, and deployed to production without issues, we can introduce the git hook that will lint staged files and re-create the TS error log whenever Typescript files have changed in a commit. Installing the new dependencies should have created a .husky folder in the support-frontend sub-folder. If this directory is not present, [follow these steps](https://typicode.github.io/husky/#/?id=manual) to install Husky manually. Move the `pre-commit` file from /gitHooks in this folder to the .husky folder.

To check that it's working, make a small change to a .ts/.tsx file, and commit it. The hook should re-run the ts-log-errors script, and run ESLint on *only* the changed file(s).

### GitHub Actions

The 'Typescript Monitor' action should be enabled now that the workflow file has been added at the root of the monorepo. Once the migration has been merged, we can now update the repo settings on GitHub to make this a required check, to ensure that any PRs which increase the amount of type/lint errors cannot be merged.

### Error-busting

The `typescript-errors.json` file generated when following the 'Documenting type errors' step above should serve as a guide to help us work through and reduce the amount of errors in the codebase. It groups errors by code, listing the file path where the error arises, with a summary at the top of the file listing the quantity of errors for each code. Once the git hook is correctly installed this file should be updated on every commit that involves Typescript changes.

We should aim to steadily reduce the quantity of errors over time, both in the course of normal work and by specifically raising PRs to fix errors. The summary should help with identifying outstanding groups of similar errors to work on.

Once all TSC and lint errors arising from the migration have been dealt with we can modify the pre-commit git hook and re-introduce a lint and compile check into the `build-tc` file, to ensure that future errors will break the build.

## Tooling adjustments

### VSCode

In order to get the most out of the new Prettier and ESLint setup, VSCode should be configured to run them and fix problems on save. To set up Prettier, follow this guide on [How to use Prettier with ESLint and TypeScript in VSCode](https://khalilstemmler.com/blogs/tooling/prettier/#Formatting-using-VSCode-on-save-recommended). For ESLint, add the following to your settings.json:

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
},
"eslint.validate": ["typescript", "typescriptreact"]
```

You should also now be able to disable or uninstall the Flow Language Support extension.
