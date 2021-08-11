# Typescript Migration

This folder contains all of the configuration files- either brand new or changed from our existing files- scripts and Github workflows required for the migration of the client-side code to Typescript.

## Performing the migration

### Setting up configuration files

All files should replace any existing versions of the same file in their destination folder.

- Files in /scripts belong in support-frontend/support-frontend/scripts
- Files in /workflows belong in support-frontend/.github/workflows
- Files in /.storybook belong in support-frontend/support-frontend/.storybook
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

After the migration the code will have some formatting issues and many linting errors. The former can be fixed by running `yarn prettier:fix` to apply Prettier formatting to the new Typescript files.

It is not recommended to run an ESLint fix at this point, as it seems to introduce many new problems that mean the code no longer builds. These errors can instead be dealt with over the longer term.

<!-- TODO:### Documenting type errors -->

## Post-migration checks

1. Run the unit tests with `yarn test`. If the tests pass but the process still exits with code 1, run `yarn test -u` to remove obsolete snapshots
2. Run the three build scripts- `yarn build-dev`, `yarn build-ssr` and `yarn build-prod`
3. Run the site and Storybook locally with `devrun.sh` and check that they load and behave as expected

After this we can move on to testing on CODE.

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
