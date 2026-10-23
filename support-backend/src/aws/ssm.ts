import {
	GetParametersByPathCommand,
	type Parameter,
	SSMClient,
} from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient({ region: 'eu-west-1' });

// Returns every (decrypted) parameter under the given path, following pagination.
export async function getParametersByPath(path: string): Promise<Parameter[]> {
	const parameters: Parameter[] = [];
	let nextToken: string | undefined;

	do {
		const response = await ssmClient.send(
			new GetParametersByPathCommand({
				Path: path,
				Recursive: true,
				WithDecryption: true,
				NextToken: nextToken,
			}),
		);
		parameters.push(...(response.Parameters ?? []));
		nextToken = response.NextToken;
	} while (nextToken);

	return parameters;
}
