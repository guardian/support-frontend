import { Stage } from './stage';
import { buildAuthClient, createBigQueryClient } from './bigQuery';
// import { BigQuery, Query } from '@google-cloud/bigquery';
import { getGCPCredentialsFromSSM } from './ssm';

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

export const handler = async (event: unknown) => {
	const stage = process.env.STAGE as Stage;
	const credentials = await getGCPCredentialsFromSSM(stage);
	const authClient = await buildAuthClient(credentials);
	createBigQueryClient(authClient, stage);
};
