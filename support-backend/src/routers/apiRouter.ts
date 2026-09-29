import { Router } from 'express';
import {
	getIdealPostcodeApiKey,
	getPaperRoundApiConfig,
	getPlaySecretKey,
} from '../aws/ssm';
import { csrfValidationSpikeHandler } from '../handlers/csrfValidationSpike';
import { buildDeliveryAgentsHandler } from '../handlers/deliveryAgents';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { buildCsrfValidationMiddleware } from '../middlewares/csrfValidation';
import { noCache } from '../middlewares/noCache';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { PaperRoundService } from '../services/paperRoundService';
import { stageFromEnvironment } from '../utils/stage';

const allowedOriginsByStage = {
	DEV: ['https://support.thegulocal.com'],
	CODE: ['https://support.code.dev-theguardian.com'],
	PROD: ['https://support.theguardian.com'],
};

export const buildApiRouterWithServices = async () => {
	const [idealPostcodesApiKey, paperRoundConfig, playSecretKey] =
		await Promise.all([
			getIdealPostcodeApiKey(),
			getPaperRoundApiConfig(),
			getPlaySecretKey(),
		]);

	const idealPostcodeService = new IdealPostcodeService(idealPostcodesApiKey);

	const paperRoundService = new PaperRoundService(
		paperRoundConfig.baseUrl,
		paperRoundConfig.apiKey,
	);

	return buildApiRouter(
		idealPostcodeService,
		paperRoundService,
		playSecretKey,
		allowedOriginsByStage[stageFromEnvironment()],
	);
};

export const buildApiRouter = (
	idealPostcodeService: IdealPostcodeService,
	paperRoundService: PaperRoundService,
	playSecretKey: string,
	allowedOrigins: string[],
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

	// SPIKE (issue #8246, Phase 0 item 2): throwaway endpoint, do not merge.
	apiRouter.post(
		'/csrf-validation-spike',
		noCache,
		buildCsrfValidationMiddleware(playSecretKey, allowedOrigins),
		csrfValidationSpikeHandler,
	);

	return apiRouter;
};
