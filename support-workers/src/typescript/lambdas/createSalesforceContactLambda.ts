import type { CreateZuoraSubscriptionState } from '../model/createZuoraSubscriptionState';
import { stageFromEnvironment } from '../model/stage';
import type {
	CreateSalesforceContactState,
	WrappedState,
} from '../model/stateSchemas';
import {
	createSalesforceContactStateSchema,
	wrapperSchemaForState,
} from '../model/stateSchemas';
import { ServiceProvider } from '../services/config';
import type { SalesforceContactRecords } from '../services/salesforce';
import { SalesforceService } from '../services/salesforce';
import { getSalesforceConfig } from '../services/salesforceClient';
import { user } from '../test/fixtures/salesforceFixtures';
import { asRetryError } from '../util/errorHandler';
import { getIfDefined } from '../util/nullAndUndefined';

const stage = stageFromEnvironment();
const salesforceServiceProvider = new ServiceProvider(stage, async (stage) => {
	const config = await getSalesforceConfig(stage);
	return new SalesforceService(config);
});

export const handler = async (
	state: WrappedState<CreateSalesforceContactState>,
) => {
	try {
		console.info(`Input is ${JSON.stringify(state)}`);
		const createSalesforceContactState = wrapperSchemaForState(
			createSalesforceContactStateSchema,
		).parse(state).state;
		const serviceForUser = await salesforceServiceProvider.getServiceForUser(
			state.state.user.isTestUser,
		);
		const contactRecords = await serviceForUser.createContactRecords(
			createSalesforceContactState.user,
			createSalesforceContactState.giftRecipient,
		);
		return {
			...state,
			state: createNextState(createSalesforceContactState, contactRecords),
		};
	} catch (error) {
		throw asRetryError(error);
	}
};

const createNextState = (
	state: CreateSalesforceContactState,
	contactRecords: SalesforceContactRecords,
): CreateZuoraSubscriptionState => {
	switch (state.product.productType) {
		case 'Contribution':
			return {
				productSpecificState: {
					productType: 'Contribution',
					product: state.product,
					paymentMethod: state.paymentMethod,
					salesForceContact: contactRecords.buyer,
					similarProductsConsent: state.similarProductsConsent,
				},
				...state,
			};
		case 'SupporterPlus':
			return {
				productSpecificState: {
					productType: 'SupporterPlus',
					billingCountry: user.billingAddress.country,
					product: state.product,
					paymentMethod: state.paymentMethod,
					appliedPromotion: state.appliedPromotion,
					salesForceContact: contactRecords.buyer,
					similarProductsConsent: state.similarProductsConsent,
				},
				...state,
			};
		case 'TierThree':
			return {
				productSpecificState: {
					productType: 'TierThree',
					user: state.user,
					product: state.product,
					paymentMethod: state.paymentMethod,
					firstDeliveryDate: getIfDefined(
						state.firstDeliveryDate,
						'First delivery date is required for Tier Three products',
					),
					appliedPromotion: state.appliedPromotion,
					salesForceContact: contactRecords.buyer,
					similarProductsConsent: state.similarProductsConsent,
				},
				...state,
			};
		case 'GuardianAdLite':
			return {
				productSpecificState: {
					productType: 'GuardianAdLite',
					product: state.product,
					paymentMethod: state.paymentMethod,
					salesForceContact: contactRecords.buyer,
				},
				...state,
			};
		case 'GuardianWeekly':
			return {
				productSpecificState: {
					productType: 'GuardianWeekly',
					user: state.user,
					giftRecipient: state.giftRecipient,
					product: state.product,
					paymentMethod: state.paymentMethod,
					firstDeliveryDate: getIfDefined(
						state.firstDeliveryDate,
						'First delivery date is required for Guardian Weekly products',
					),
					appliedPromotion: state.appliedPromotion,
					salesforceContacts: contactRecords,
					similarProductsConsent: state.similarProductsConsent,
				},
				...state,
			};
		case 'Paper':
			return {
				productSpecificState: {
					productType: 'Paper',
					user: state.user,
					product: state.product,
					paymentMethod: state.paymentMethod,
					firstDeliveryDate: getIfDefined(
						state.firstDeliveryDate,
						'First delivery date is required for Paper products',
					),
					appliedPromotion: state.appliedPromotion,
					salesForceContact: contactRecords.buyer,
					similarProductsConsent: state.similarProductsConsent,
				},
				...state,
			};
		case 'DigitalPack':
			return {
				productSpecificState: {
					productType: 'DigitalSubscription',
					billingCountry: user.billingAddress.country,
					product: state.product,
					paymentMethod: state.paymentMethod,
					appliedPromotion: state.appliedPromotion,
					salesForceContact: contactRecords.buyer,
					similarProductsConsent: state.similarProductsConsent,
				},
				...state,
			};
	}
};
