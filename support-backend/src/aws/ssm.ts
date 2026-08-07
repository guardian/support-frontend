import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { stageFromEnvironment } from '../utils/stage';

export async function getIdealPostcodeApiKey(): Promise<string> {
	const stage = stageFromEnvironment();
	const ssmClient = new SSMClient({
		region: 'eu-west-1',
	});
	const command = new GetParameterCommand({
		Name: `/${stage}/support/support-backend/ideal-postcodes-api.key`,
		WithDecryption: true,
	});
	const response = await ssmClient.send(command);
	if (!response.Parameter?.Value) {
		// TODO: This will need to be surfaced in some way if it ever happened in PROD.
		throw new Error('Ideal Postcodes API key not found in SSM');
	}
	return response.Parameter.Value;
}
