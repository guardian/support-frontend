import { Router } from 'express';
import type { Config } from '../config/config';
import { buildDeliveryAgentsHandler } from '../handlers/deliveryAgents';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { noCache } from '../middlewares/noCache';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { PaperRoundService } from '../services/paperRoundService';

export const buildApiRouterWithServices = (config: Config) => {
	const idealPostcodeService = new IdealPostcodeService(
		config.idealPostcodesApi.key,
	);

	const paperRoundService = new PaperRoundService(
		config.paperRoundApi.url,
		config.paperRoundApi.key,
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
