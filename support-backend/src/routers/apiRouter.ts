import { Router } from 'express';
import { getIdealPostcodeApiKey, getPaperRoundApiConfig } from '../aws/ssm';
import { buildDeliveryAgentsHandler } from '../handlers/deliveryAgents';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { PaperRoundService } from '../services/paperRoundService';

export const buildApiRouterWithServices = async () => {
	const idealPostcodesApiKey = await getIdealPostcodeApiKey();
	const idealPostcodeService = new IdealPostcodeService(idealPostcodesApiKey);

	const { baseUrl: paperRoundBaseUrl, apiKey: paperRoundApiKey } =
		await getPaperRoundApiConfig();
	const paperRoundService = new PaperRoundService(
		paperRoundBaseUrl,
		paperRoundApiKey,
	);

	return buildApiRouter(idealPostcodeService, paperRoundService);
};

export const buildApiRouter = (
	idealPostcodeService: IdealPostcodeService,
	paperRoundService: PaperRoundService,
) => {
	const apiRouter = Router();

	apiRouter.get(
		'/postcode-lookup/:postcode',
		(req, res, next) => {
			res.set('Cache-Control', 'no-cache, private');
			next();
		},
		buildPostcodeLookupHandler(idealPostcodeService),
	);

	apiRouter.get(
		'/delivery-agents/:postcode',
		buildDeliveryAgentsHandler(paperRoundService),
	);

	return apiRouter;
};
