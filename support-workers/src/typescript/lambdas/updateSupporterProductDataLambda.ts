import { getProductCatalogFromApi } from '@guardian/support-service-lambdas/modules/product-catalog/src/api';
import {
	sendToSupporterProductData,
	type SupporterRatePlanItem,
} from '@modules/supporter-product-data/supporterProductData';
import { getProductRatePlan } from '@modules/zuora/createSubscription/getProductRatePlan';
import dayjs from 'dayjs';
import type { SendAcquisitionEventState } from '../model/sendAcquisitionEventState';
import { stageFromEnvironment } from '../model/stage';
import type { WrappedState } from '../model/stateSchemas';
import { ServiceProvider } from '../services/config';

const stage = stageFromEnvironment();

const productCatalogProvider = new ServiceProvider(stage, async (stage) => {
	return getProductCatalogFromApi(stage);
});

export const handler = async (
	state: WrappedState<SendAcquisitionEventState>,
) => {
	console.info(`Input is ${JSON.stringify(state)}`);
	const sendThankYouEmailState = state.state.sendThankYouEmailState;

	const productRatePlan = getProductRatePlan(
		await productCatalogProvider.getServiceForUser(
			sendThankYouEmailState.user.isTestUser,
		),
		sendThankYouEmailState.productInformation,
	);
	const supporterRatePlanItem: SupporterRatePlanItem = {
		subscriptionName: sendThankYouEmailState.subscriptionNumber,
		identityId: sendThankYouEmailState.user.id,
		productRatePlanId: productRatePlan.id,
		productRatePlanName: `support-workers added ${sendThankYouEmailState.productInformation.product}`,
		contractEffectiveDate: dayjs().toISOString(),
		termEndDate: dayjs().add(1, 'week').toISOString(), // This will be overwritten by the sync from Zuora
	};
	await sendToSupporterProductData(stage, supporterRatePlanItem);
};
