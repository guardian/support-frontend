## Playwright tests for the [supporter platform](https://support.theguardian.com/).

### Running the tests

The tests have been setup to run via a github action. The action triggers on `pull_request` with the additional condition of the label `Seen-on-prod` being present (this label is added by prout once a deploy has finished and the changes have been confirmed in production).

You can view the action [here](../.github/workflows/playwright.yaml).

Scripts to run the tests are present in the [package.json](package.json) file. Allowing you to also run the tests locally. Three ways of running the tests have been setup:

- `pw-browserstack-test` Runs the tests via BrowserStack Automate against the production site (https://support.theguardian.com/).
- `pw-local-test` Runs the tests via the Playwright ui against a local running version of the site (https://support.thegulocal.com/).
- `pw-prod-test` Runs the tests via the Playwright ui against the production site (https://support.theguardian.com/).

It should also be possible to run the tests via BrowserStack Automate against a local running version of the site if you have local testing setup in your BrowserStack account and amend/create a new test configuration file.

### Running the tests using BrowserStack

Running the Playwright tests with Browserstack requires the following environment variables to be set:

- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`

When the tests are run from the github action these are made available via github secrets. When running the tests locally on your machine you can either set these environment variables globally however you like, or add them to a .env file in the following location:

`support-frontend/support-e2e/.env`

> [!Note]
> The credentials you provide in the environment variables will need to asociated with a BrowserStack account that has access to [Automate](https://automate.browserstack.com).

Once the tests have been run (either via the github action or by yourself locally) you can view the results in the [Browserstack Automate dashboard](https://automate.browserstack.com/dashboard). Note again you will have to log in with your Browserstack account that has Automate access.

### Possible future work

It would be nice to use Playwright for integration tests as well as E2E tests. Possibly we could split out the `test` directory into `e2e` and `integration` directories and modify the `testDir` config property in the Playwright config files to reflect whether you are running E2E or integration tests.

## Rationale

Playwright tests written in Typescript have been added with the intention of replacing the existing [Scala Selenium tests](https://github.com/guardian/support-frontend/tree/main/support-frontend/test). The rational for this decision was primarily to allow us to write tests in the same language that the site is written in.

As a first pass these tests will run alongside the existing Selenium tests while we migrate the test scenarios over to Playwright. When that work is complete we can remove the Selenium tests entirely.
