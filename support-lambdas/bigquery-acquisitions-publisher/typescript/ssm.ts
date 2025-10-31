import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { awsConfig } from './config';
import type { Stage } from './stage';

// Retrieve Google Cloud Parameters from AWS Systems Manager -> Parameter Store
export const getGCPCredentialsFromSSM = async (stage: Stage) => {
	const ssmClient = new SSMClient(awsConfig);
	const params = {
		Name: `/bigquery-acquisitions-publisher/${stage}/gcp-wif-credentials-config`,
		WithDecryption: true,
	};
	const command = new GetParameterCommand(params);
	const response = await ssmClient.send(command);

	if (!response.Parameter?.Value) {
		throw new Error("Couldn't retrieve GCP credentials from parameter store");
	}
	return response.Parameter.Value;
};
