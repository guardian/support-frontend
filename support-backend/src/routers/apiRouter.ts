import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { Router } from 'express';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { stageFromEnvironment } from '../utils/stage';

async function getIdealPostcodeApiKey(): Promise<string> {
	const stage = stageFromEnvironment();
	const ssmClient = new SSMClient({
		region: 'eu-west-1',
	});
	const command = new GetParameterCommand({
		Name: `/support/support-backend/${stage}/ideal-postcodes-api.key`,
		WithDecryption: true,
	});
	const response = await ssmClient.send(command);
	if (!response.Parameter?.Value) {
		// TODO: This will need to be surfaced in some way if it ever happened in PROD.
		throw new Error('Ideal Postcodes API key not found in SSM');
	}
	return response.Parameter.Value;
}

export const buildApiRouterWithServices = async () => {
	const apiKey = await getIdealPostcodeApiKey();

	const idealPostcodeService = new IdealPostcodeService(apiKey);

	return buildApiRouter(idealPostcodeService);
};

export const buildApiRouter = (idealPostcodeService: IdealPostcodeService) => {
	const apiRouter = Router();

	apiRouter.get(
		'/postcode-lookup/:postcode',
		buildPostcodeLookupHandler(idealPostcodeService),
	);

	return apiRouter;
};
