import { BigQuery } from '@google-cloud/bigquery';
import type {
	BaseExternalAccountClient,
	ExternalAccountClientOptions,
} from 'google-auth-library';
import { ExternalAccountClient } from 'google-auth-library';
import { Stage } from './stage';

export const buildAuthClient = (
	clientConfig: string,
): Promise<BaseExternalAccountClient> =>
	new Promise((resolve, reject) => {
		const parsedConfig = JSON.parse(
			clientConfig,
		) as ExternalAccountClientOptions;
		const authClient = ExternalAccountClient.fromJSON(parsedConfig);
		if (authClient) {
			resolve(authClient);
		} else {
			reject('Failed to create Google Auth Client');
		}
	});

export const createBigQueryClient = (
	authClient: BaseExternalAccountClient,
	stage: Stage,
): BigQuery => {
	const bigQuery = new BigQuery({
		projectId: `datatech-platform-${stage.toLowerCase()}`,
		authClient,
	});
	return bigQuery;
};

export const writeRowsToBigQuery = async (
	bigQueryClient: BigQuery,
	rows: unknown[],
): Promise<void> => {
	await bigQueryClient
		.dataset('datalake')
		.table('fact_acquisition_event')
		.insert(rows);

	console.log('Inserted rows:', rows);
};
