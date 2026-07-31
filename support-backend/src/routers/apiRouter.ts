import { Router } from 'express';
import { getIdealPostcodeApiKey } from '../aws/ssm';
import { buildDeliveryAgentsHandler } from '../handlers/deliveryAgents';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { IdealPostcodeService } from '../services/idealPostcodeService';

export const buildApiRouterWithServices = async () => {
	const apiKey = await getIdealPostcodeApiKey();

	const idealPostcodeService = new IdealPostcodeService(apiKey);

	return buildApiRouter(idealPostcodeService);
};

export const buildApiRouter = (idealPostcodeService: IdealPostcodeService) => {
	const apiRouter = Router();

	apiRouter.get(
		'/postcode-lookup/:postcode',
		(req, res, next) => {
			res.set('Cache-Control', 'no-cache, private');
			next();
		},
		buildPostcodeLookupHandler(idealPostcodeService),
	);

	apiRouter.get('/delivery-agents/:postcode', buildDeliveryAgentsHandler());

	return apiRouter;
};
