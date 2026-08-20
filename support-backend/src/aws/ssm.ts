import {
	GetParameterCommand,
	GetParametersByPathCommand,
	type Parameter,
	SSMClient,
} from '@aws-sdk/client-ssm';
import { stageFromEnvironment } from '../utils/stage';

function findValue(
	name: string,
	parameters: Parameter[] | undefined,
): string | undefined {
	return parameters?.find((parameter) => parameter.Name === name)?.Value;
}

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

export async function getPaperRoundApiConfig(): Promise<{
	apiKey: string;
	baseUrl: string;
}> {
	const stage = stageFromEnvironment();
	const path = `/${stage}/support/support-backend/paper-round-api`;
	const ssmClient = new SSMClient({
		region: 'eu-west-1',
	});
	const command = new GetParametersByPathCommand({
		Path: path,
		WithDecryption: true,
	});
	const response = await ssmClient.send(command);
	const apiKey = findValue(`${path}/key`, response.Parameters);
	const baseUrl = findValue(`${path}/url`, response.Parameters);

	if (!apiKey || !baseUrl) {
		// TODO: This will need to be surfaced in some way if it ever happened in PROD.
		throw new Error('Paperround API config not found in SSM');
	}
	return { apiKey, baseUrl };
}
