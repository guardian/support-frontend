import { randomBytes } from 'node:crypto';
import {
	GetParameterCommand,
	PutParameterCommand,
	SSMClient,
} from '@aws-sdk/client-ssm';

// This should match the overlapDuration specified in AppComponents.scala
const ROTATION_OVERLAP_MS = 2 * 60 * 60 * 1000; // 2 hours
// This should match the usageDelay specified in AppComponents.scala
const USAGE_DELAY_MS = 3 * 60 * 1000; // 3 minutes
const MIN_ROTATION_INTERVAL_MS = ROTATION_OVERLAP_MS + USAGE_DELAY_MS;

export const handler = async (): Promise<void> => {
	const parameterName = process.env.PLAY_SECRET_PARAMETER_NAME;
	if (!parameterName) {
		throw new Error(
			'PLAY_SECRET_PARAMETER_NAME environment variable is not set',
		);
	}

	const ssm = new SSMClient({});

	const { Parameter } = await ssm.send(
		new GetParameterCommand({ Name: parameterName, WithDecryption: false }),
	);

	const lastModifiedDate = Parameter?.LastModifiedDate;
	if (!lastModifiedDate) {
		throw new Error(`No LastModifiedDate found for parameter ${parameterName}`);
	}

	if (Date.now() - lastModifiedDate.getTime() < MIN_ROTATION_INTERVAL_MS) {
		console.log(
			`Parameter ${parameterName} was last modified at ${lastModifiedDate.toISOString()}, which is within the last two hours. Skipping rotation.`,
		);
		return;
	}

	await ssm.send(
		new PutParameterCommand({
			Name: parameterName,
			Value: randomBytes(32).toString('hex'),
			Type: 'SecureString',
			Overwrite: true,
		}),
	);

	console.log(`Rotated parameter ${parameterName}`);
};
