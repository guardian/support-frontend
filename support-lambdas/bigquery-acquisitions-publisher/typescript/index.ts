import { getStage } from './stage';
import {
	buildAuthClient,
	createBigQueryClient,
	writeRowsToBigQuery,
} from './bigQuery';
import { getGCPCredentialsFromSSM } from './ssm';
import type { SQSEvent } from 'aws-lambda';
import {
	AcquisitionProductSchema,
	AcquisitionProduct,
	transformAcquisitionProductForBigQuery,
} from './acquisitions';

type Result =
	| {
			success: true;
			// TODO: define a type for the row object
			row: unknown;
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

	const results: Array<Result> = event.Records.map((record) => {
		// Parse JSON record body (TODO: handle JSON parsing errors)
		const payload = JSON.parse(record.body);

		// Validate the payload against the schema
		const parsedAcquisitionProductDetail =
			AcquisitionProductSchema.safeParse(payload);
		if (!parsedAcquisitionProductDetail.success) {
			console.error(
				'Failed to parse payload:',
				parsedAcquisitionProductDetail.error,
			);
			return { success: false, messageId: record.messageId };
		}

		const data: AcquisitionProduct = parsedAcquisitionProductDetail.data;

		const row = transformAcquisitionProductForBigQuery(data);

		return { success: true, row };
	});

	const successfulRows = results
		.filter((result) => result.success)
		.map((result) => result.row);

	if (successfulRows.length > 0) {
		// TODO: error handling
		await writeRowsToBigQuery(bigQueryClient, successfulRows);
	}

	// TODO: return any failures to the runtime (either parsing failures or BigQuery write failures)
	// https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html#services-sqs-batchfailurereporting
};
