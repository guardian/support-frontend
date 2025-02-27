import type { ActiveProductKey } from 'helpers/productCatalog';
import type { IsoCurrency } from '../../../helpers/internationalisation/currency';
import {
	successfulContributionConversion,
	successfulSubscriptionConversion,
} from '../../../helpers/tracking/googleTagManager';
import type { PaymentMethod } from './paymentFields';

const contributionTypeFromRatePlanKey = (ratePlanKey: string | undefined) => {
	switch (ratePlanKey) {
		case 'Monthly':
			return 'MONTHLY';
		case 'Annual':
			return 'ANNUAL';
		default:
			return 'ONE_OFF';
	}
};

const billingPeriodForSubcriptionProduct = (
	productKey: ActiveProductKey | undefined,
	ratePlanKey: string | undefined,
) => {
	if (
		productKey === 'HomeDelivery' ||
		productKey === 'NationalDelivery' ||
		productKey === 'SubscriptionCard'
	) {
		return 'Monthly';
	}
	switch (ratePlanKey) {
		case 'Monthly':
		case 'RestOfWorldMonthly':
		case 'RestOfWorldMonthlyV2':
			return 'Monthly';
		case 'RestOfWorldAnnual':
		case 'RestOfWorldAnnualV2':
		case 'Annual':
			return 'Annual';
	}
	return 'Monthly';
};

export const doGtmTracking = (
	contributionAmount: number | undefined,
	productKey: ActiveProductKey | undefined,
	ratePlanKey: string | undefined,
	paymentMethod: PaymentMethod,
	currency: IsoCurrency,
) => {
	const legacyPaymentMethod =
		paymentMethod === 'StripeExpressCheckoutElement' ? 'Stripe' : paymentMethod;
	if (productKey === undefined || productKey === 'Contribution') {
		successfulContributionConversion(
			contributionAmount ?? 0,
			contributionTypeFromRatePlanKey(ratePlanKey),
			currency,
			legacyPaymentMethod,
			'Contribution', // One-off is labelled Contribution in Tag Manager
		);
	} else {
		successfulSubscriptionConversion(
			0, //TODO: work this out
			currency,
			legacyPaymentMethod,
			billingPeriodForSubcriptionProduct(productKey, ratePlanKey),
			productKey,
		);
	}
};
