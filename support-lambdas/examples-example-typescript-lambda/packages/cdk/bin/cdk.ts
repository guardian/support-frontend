import 'source-map-support/register';
import { GuRootExperimental } from '@guardian/cdk/lib/experimental/constructs';
import { ExampleTypescriptLambda } from '../lib/example-typescript-lambda';

/**
 * GuRootExperimental will generate a `riff-raff.yaml` configuration file to deploy this project with Riff-Raff.
 *
 * @see https://github.com/guardian/cdk/blob/main/src/experimental/riff-raff-yaml-file/README.md
 */
const app = new GuRootExperimental();

new ExampleTypescriptLambda(app, 'ExampleTypescriptLambda-PROD', {
	/**
	 * This becomes the value of the STACK tag on provisioned resources.
	 *
	 * It is also used by Riff-Raff to determine the AWS account to deploy into.
	 *
	 * @see https://riffraff.gutools.co.uk/deployinfo/data?key=credentials%3Aaws-cfn-role
	 */
	stack: 'playground',

	/**
	 * This becomes the value of the STAGE tag on provisioned resources.
	 */
	stage: 'PROD',

	env: {
		/**
		 * Which AWS region should this service be deployed into?
		 */
		region: 'eu-west-1',
	},
});
