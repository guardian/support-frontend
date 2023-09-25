# Example TypeScript Lambda
This is an example of a TypeScript lambda, using:
- [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- GitHub Actions for CI (view it [here](https://github.com/guardian/examples/actions?query=branch%3Aexample-typescript-lambda))
- Riff-Raff for CD (view it [here](https://riffraff.gutools.co.uk/deployment/history?projectName=playground%3A%3Aexample-typescript-lambda&page=1))
- [@guardian/tsconfig](https://github.com/guardian/csnx/tree/main/libs/%40guardian/tsconfig) for [TypeScript](https://www.typescriptlang.org/) configuration
- [@guardian/cdk](https://github.com/guardian/cdk) for infrastructure
- [@guardian/eslint-config-typescript](https://github.com/guardian/csnx/tree/main/libs/%40guardian/eslint-config-typescript) for [ESLint](https://eslint.org/) configuration
- [@guardian/prettier](https://github.com/guardian/csnx/tree/main/libs/%40guardian/prettier) for [Prettier](https://prettier.io/) configuration

Logs appear in [Central ELK](https://logs.gutools.co.uk/goto/ea4e3010-5145-11ee-913c-1f0e93d001da).

It's quite opinionated, using:
- [dotenv](https://www.npmjs.com/package/dotenv) for local configuration
- [esbuild](https://esbuild.github.io/) to compile TypeScript to run on AWS Lambda
- [Jest](https://jestjs.io/) for testing

The aim is for this to be a starting point for a new application.
Note, however, that there is a risk the repository might need updating.
For example, dependency versions, or Node version.

## Usage
1. Clone this branch:
   ```sh
   git clone -b example-typescript-lambda git@github.com:guardian/examples.git example-typescript-lambda
   ```
2. Add your code to [packages/lambda/src](packages/lambda/src)
3. Deploy via Riff-Raff

You'll want to edit some parts of the infrastructure in [packages/cdk](packages/cdk) 
to ensure the app is deployed to the desired AWS account.
