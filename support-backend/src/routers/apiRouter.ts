import { Router } from 'express';
import type { Config } from '../config/config';
import { buildDeliveryAgentsHandler } from '../handlers/deliveryAgents';
import { buildGetInvitationHandler } from '../handlers/getInvitation';
import { buildPostcodeLookupHandler } from '../handlers/postcodeLookup';
import { noCache } from '../middlewares/noCache';
import { IdealPostcodeService } from '../services/idealPostcodeService';
import { MultipleAccountApiService } from '../services/multipleAccountApiService';
import { PaperRoundService } from '../services/paperRoundService';

export const buildApiRouterWithServices = (config: Config) => {
	const idealPostcodeService = new IdealPostcodeService(
		config.idealPostcodesApi.key,
	);

	const paperRoundService = new PaperRoundService(
		config.paperRoundApi.url,
		config.paperRoundApi.key,
	);

	const multipleAccountApiService = new MultipleAccountApiService(
		config.multipleAccountApi.url,
		config.multipleAccountApi.key,
	);

	return buildApiRouter(
		idealPostcodeService,
		paperRoundService,
		multipleAccountApiService,
	);
};

export const buildApiRouter = (
	idealPostcodeService: IdealPostcodeService,
	paperRoundService: PaperRoundService,
	multipleAccountApiService: MultipleAccountApiService,
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

	apiRouter.get(
		'/invitation/:invitationCode',
		noCache,
		buildGetInvitationHandler(multipleAccountApiService),
	);

	return apiRouter;
};
