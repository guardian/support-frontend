import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import { GuLambdaFunction } from '@guardian/cdk/lib/constructs/lambda';
import type { App } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class ExampleTypescriptLambda extends GuStack {
	constructor(scope: App, id: string, props: GuStackProps) {
		super(scope, id, props);

		/**
		 * A GuLambdaFunction comes with the following batteries included:
		 *   - IAM permissions to read from SSM Parameter store
		 *   - STACK, STAGE, APP environment variables
		 *
		 * @see The `__snapshots__` directory for more.
		 */
		new GuLambdaFunction(this, 'ExampleTypescriptLambda', {
			/**
			 * This becomes the value of the APP tag on provisioned resources.
			 */
			app: 'example-typescript-lambda',

			/**
			 * This is the name of artifact in S3.
			 */
			fileName: 'example-typescript-lambda.zip',

			/**
			 * The format of this is `<filename>.<exported function>`.
			 *
			 * The file `packages/lambda/src/index.ts` has an exported function named `main`.
			 */
			handler: 'index.main',

			/**
			 * The runtime of the lambda function.
			 *
			 * Should align with `.nvmrc` at the root of the repository.
			 */
			runtime: Runtime.NODEJS_18_X,
		});
	}
}
