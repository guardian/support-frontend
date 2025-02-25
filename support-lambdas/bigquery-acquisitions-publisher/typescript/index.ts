import { getStage } from './stage';
import { buildAuthClient, createBigQueryClient } from './bigQuery';
// import { BigQuery, Query } from '@google-cloud/bigquery';
import { getGCPCredentialsFromSSM } from './ssm';
import { SQSEvent } from 'aws-lambda';

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

export const handler = async (event: SQSEvent) => {
	const stage = getStage();
	const credentials = await getGCPCredentialsFromSSM(stage);
	const authClient = await buildAuthClient(credentials);
	createBigQueryClient(authClient, stage);
};
