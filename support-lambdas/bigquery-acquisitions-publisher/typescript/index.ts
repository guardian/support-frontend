import { getStage } from './stage';
import { buildAuthClient, createBigQueryClient } from './bigQuery';
import { BigQuery } from '@google-cloud/bigquery';
import { getGCPCredentialsFromSSM } from './ssm';
import type { SQSEvent } from 'aws-lambda';
import {
	AcquisitionsProductDetail,
	aquisitionProductDetail,
	AcquisitionsProductZod,
} from './acquisitions';

// const exampleReadFromBigQuery = async (bigQueryClient: BigQuery) => {
// 	const query: Query = {
// 		query: 'SELECT COUNT(*) FROM datalake.fact_acquisition_event',
// 		location: 'europe-west2',
// 	};
// 	const [job] = await bigQueryClient.createQueryJob(query);
// 	console.log(`Job ${job.id} started.`);

// 	const [rows] = await job.getQueryResults();
// 	console.log('Rows:');
// 	rows.forEach((row) => console.log(row));
// };

const exampleWriteToBigQuery = async (
	bigQueryClient: BigQuery,
	aquisitionProductDetail: AcquisitionsProductDetail,
) => {
	const parsedAquisitionProduct = AcquisitionsProductZod.parse(
		aquisitionProductDetail,
	);
	const rows = [parsedAquisitionProduct];
	await bigQueryClient
		.dataset('datalake')
		.table('fact_acquisition_event')
		.insert(rows);
	console.log('Inserted rows:', rows);
};

export const handler = async (event: SQSEvent) => {
	const stage = getStage();
	const credentials = await getGCPCredentialsFromSSM(stage);
	const authClient = await buildAuthClient(credentials);
	const bigQueryClient = createBigQueryClient(authClient, stage);
	exampleWriteToBigQuery(bigQueryClient, aquisitionProductDetail);
};
