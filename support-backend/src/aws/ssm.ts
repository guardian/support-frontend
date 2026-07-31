import {
	GetParameterCommand,
	GetParametersByPathCommand,
	SSMClient,
} from '@aws-sdk/client-ssm';
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

export async function getPaperroundApiConfig(): Promise<{
	key: string;
	url: string;
}> {
	const stage = stageFromEnvironment();
	const path = `/${stage}/support/support-backend/paperround-api`;
	const ssmClient = new SSMClient({
		region: 'eu-west-1',
	});
	const command = new GetParametersByPathCommand({
		Path: path,
		WithDecryption: true,
	});
	const response = await ssmClient.send(command);
	const findValue = (name: string) =>
		response.Parameters?.find((parameter) => parameter.Name === name)?.Value;
	const key = findValue(`${path}/key`);
	const url = findValue(`${path}/url`);
	if (!key || !url) {
		// TODO: This will need to be surfaced in some way if it ever happened in PROD.
		throw new Error('Paperround API config not found in SSM');
	}
	return { key, url };
}
