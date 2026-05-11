import { Router } from 'express';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { IdealPostcodeService } from '../services/idealPostcodeService';

export const buildApiRouter = async () => {
	const apiRouter = Router();

	// TODO: Get this from SSM instead of an env var
	const apiKey = await Promise.resolve(process.env.IDEAL_API_KEY as string);

	const idealPostcodeService = new IdealPostcodeService(apiKey);

	apiRouter.get(
		'/postcode-lookup/:postcode',
		buildPostcodeLookupHandler(idealPostcodeService),
	);

	return apiRouter;
};
