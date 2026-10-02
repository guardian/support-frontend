import cookieParser from 'cookie-parser';
import { Router } from 'express';
import { getIdealPostcodeApiKey, getPaperRoundApiConfig } from '../aws/ssm';
import type { OktaConfig } from '../config/okta';
import { getOktaConfig } from '../config/okta';
import { buildDeliveryAgentsHandler } from '../handlers/deliveryAgents';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { whoamiHandler } from '../handlers/whoami';
import { noCache } from '../middlewares/noCache';
import { buildOktaCookieAuth } from '../middlewares/oktaCookieAuth';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { PaperRoundService } from '../services/paperRoundService';
import { stageFromEnvironment } from '../utils/stage';

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

	const oktaConfig = getOktaConfig(stageFromEnvironment());

	return buildApiRouter(idealPostcodeService, paperRoundService, oktaConfig);
};

export const buildApiRouter = (
	idealPostcodeService: IdealPostcodeService,
	paperRoundService: PaperRoundService,
	oktaConfig: OktaConfig,
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

	// Note: buildOktaCookieAuth bundles noCache with the auth check (see
	// middlewares/oktaCookieAuth.ts), so it doesn't need to be listed
	// separately here.
	apiRouter.get(
		'/whoami',
		cookieParser(),
		...buildOktaCookieAuth(oktaConfig),
		whoamiHandler,
	);

	return apiRouter;
};
