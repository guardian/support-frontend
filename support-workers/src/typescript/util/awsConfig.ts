import { defaultProvider } from '@aws-sdk/credential-provider-node';

export const isRunningLocally =
	!process.env.LAMBDA_TASK_ROOT && !process.env.CI;

export const awsConfig = isRunningLocally
	? {
			region: 'eu-west-1',
			credentials: defaultProvider({ profile: 'membership' }),
	  }
	: {
			// Explicitly use environment credentials to bypass the default provider chain
			// and prevent the SDK from scanning for conflicting profiles.
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
				sessionToken: process.env.AWS_SESSION_TOKEN,
			},
	  };
