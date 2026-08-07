import type { RequestHandler } from 'express';
import { Router } from 'express';
import { getIdealPostcodeApiKey, getPaperRoundApiConfig } from '../aws/ssm';
import { buildDeliveryAgentsHandler } from '../handlers/deliveryAgents';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { PaperRoundService } from '../services/paperRoundService';

const noCache: RequestHandler = (_req, res, next) => {
	res.setHeader('Cache-Control', 'no-cache, private');
	next();
};

export const buildApiRouterWithServices = async () => {
	const [idealPostcodesApiKey, paperRoundConfig] = await Promise.all([
		getIdealPostcodeApiKey(),
		getPaperRoundApiConfig(),
	]);

	const idealPostcodeService = new IdealPostcodeService(idealPostcodesApiKey);
	const paperRoundService = new PaperRoundService(
		paperRoundConfig.baseUrl,
		paperRoundConfig.apiKey,
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
		noCache,
		buildPostcodeLookupHandler(idealPostcodeService),
	);

	apiRouter.get(
		'/delivery-agents/:postcode',
		noCache,
		buildDeliveryAgentsHandler(paperRoundService),
	);

	return apiRouter;
};
