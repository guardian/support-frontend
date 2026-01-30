import { defaultProvider } from '@aws-sdk/credential-provider-node';

export const isRunningLocally =
	!process.env.LAMBDA_TASK_ROOT && !process.env.CI;
export const awsConfig = isRunningLocally
	? {
			region: 'eu-west-1',
			credentials: defaultProvider({ profile: 'membership' }),
	  }
	: {};
