import type { SQSEvent } from 'aws-lambda';
import { transformAcquisitionProductForBigQuery } from './acquisitions';
import {
	buildAuthClient,
	createBigQueryClient,
	writeRowToBigQuery,
} from './bigQuery';
import { AcquisitionProductEventSchema } from './schemas';
import { getGCPCredentialsFromSSM } from './ssm';
import { getStage } from './stage';

type Result =
	| {
			success: true;
	  }
	| {
			success: false;
			messageId: string;
	  };

export const handler = async (event: SQSEvent) => {
	// BigQuery connect
	const stage = getStage();
	const credentials = await getGCPCredentialsFromSSM(stage);
	const authClient = await buildAuthClient(credentials);
	const bigQueryClient = createBigQueryClient(authClient, stage);

	// Parse SQSEvents
	console.log('Received event:', event);
	const asyncResults: Array<Promise<Result>> = event.Records.map(
		async (record): Promise<Result> => {
			// JSON parse record body
			let payload;
			try {
				payload = JSON.parse(record.body) as unknown;
			} catch (jsonError) {
				if (jsonError instanceof Error) {
					console.error('Failed to JSON parse payload:', jsonError.message);
				}
				return { success: false, messageId: record.messageId };
			}

			// Validate the payload against Zod schema
			const parsedAcquisitionProductDetail =
				AcquisitionProductEventSchema.safeParse(payload);
			if (!parsedAcquisitionProductDetail.success) {
				console.error(
					'Failed to Schema parse payload:',
					parsedAcquisitionProductDetail.error,
				);
				return { success: false, messageId: record.messageId };
			}

			// Transform payload to BigQuery row
			const row = transformAcquisitionProductForBigQuery(
				parsedAcquisitionProductDetail.data.detail,
			);

			// Write BigQuery row
			try {
				await writeRowToBigQuery(bigQueryClient, row);
			} catch (bigQueryError) {
				if (bigQueryError instanceof Error) {
					console.error(
						'Failed to insert into BigQuery:',
						bigQueryError.message,
					);
				}
				return { success: false, messageId: record.messageId };
			}

			return { success: true };
		},
	);

	// Wait for all async results to complete
	const results = await Promise.all(asyncResults);

	// Batch return failed items
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
