import { Router } from 'express';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { IdealPostcodeService } from '../services/idealPostcodeService';

export const buildApiRouterWithServices = async () => {
	// TODO: Get this from SSM instead of an env var
	const apiKey = await Promise.resolve(process.env.IDEAL_API_KEY as string);

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
