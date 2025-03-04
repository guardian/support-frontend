import { getStage } from './stage';
import {
	buildAuthClient,
	createBigQueryClient,
	writeRowsToBigQuery,
} from './bigQuery';
import { getGCPCredentialsFromSSM } from './ssm';
import type { SQSEvent } from 'aws-lambda';
import {
	AcquisitionProduct,
	transformAcquisitionProductForBigQuery,
	AcquisitionProductEventSchema,
} from './acquisitions';

type Result =
	| {
			success: true;
	  }
	| {
			success: false;
			messageId: string;
	  };

export const handler = async (event: SQSEvent) => {
	const stage = getStage();
	const credentials = await getGCPCredentialsFromSSM(stage);
	const authClient = await buildAuthClient(credentials);
	const bigQueryClient = createBigQueryClient(authClient, stage);
	console.log('Received event:', event);

	const asyncResults: Array<Promise<Result>> = event.Records.map(
		async (record): Promise<Result> => {
			// Parse JSON record body (TODO: handle JSON parsing errors)
			const payload = JSON.parse(record.body);

			// Validate the payload against the schema
			const parsedAcquisitionProductDetail =
				AcquisitionProductEventSchema.safeParse(payload);
			if (!parsedAcquisitionProductDetail.success) {
				console.error(
					'Failed to parse payload:',
					parsedAcquisitionProductDetail.error,
				);
				return { success: false, messageId: record.messageId };
			}

			const data: AcquisitionProduct =
				parsedAcquisitionProductDetail.data.detail;

			const row = transformAcquisitionProductForBigQuery(data);

			await writeRowsToBigQuery(bigQueryClient, [row]);

			return { success: true };
		},
	);

	const results = await Promise.all(asyncResults);

	// If certain messages fail to be processed, retry these ones but
	// not successfully processed messages:
	// https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html#services-sqs-batchfailurereporting
	const itemFailures = results
		.filter((result) => !result.success)
		.map((result) => result.messageId);

	return {
		batchItemFailures: itemFailures.map((messageId) => ({
			itemIdentifier: messageId,
		})),
	};
};
