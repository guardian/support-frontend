import type { RegularPaymentRequest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
	ProductDescription,
} from 'helpers/productCatalog';
import type { RecurringBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getFulfilmentOptionFromProductKey } from 'helpers/productPrice/fulfilmentOptions';
import { getProductOptionFromProductAndRatePlan } from 'helpers/productPrice/productOptions';
import { logException } from 'helpers/utilities/logger';

type GetProductFieldsParams = {
	product: {
		productKey: ActiveProductKey;
		productDescription: ProductDescription;
		ratePlanKey: ActiveRatePlanKey;
		deliveryAgent: number | undefined;
	};
	financial: {
		currencyKey: IsoCurrency;
		finalAmount: number;
		originalAmount: number;
		contributionAmount?: number;
	};
};

export const getProductFields = ({
	product,
	financial,
}: GetProductFieldsParams): RegularPaymentRequest['product'] => {
	const { productKey, ratePlanKey, productDescription, deliveryAgent } =
		product;
	const { currencyKey, finalAmount, originalAmount, contributionAmount } =
		financial;

	const ratePlanDescription = productDescription.ratePlans[ratePlanKey] ?? {
		billingPeriod: 'Monthly',
	};

	const fulfilmentOption = getFulfilmentOptionFromProductKey(productKey);
	const productOption = getProductOptionFromProductAndRatePlan(
		productKey,
		ratePlanKey,
	);
	const unsupportedProductMessage = `Product not supported by generic checkout: ${productKey}`;

	/**
	 * This is the data structure used by the `/subscribe/create` endpoint.
	 *
	 * This must match the types in `CreateSupportWorkersRequest#product`
	 * and readerRevenueApis - `RegularPaymentRequest#product`.
	 *
	 * We might be able to defer this to the backend.
	 */
	switch (productKey) {
		case 'GuardianAdLite':
			return {
				productType: 'GuardianAdLite',
				currency: currencyKey,
				billingPeriod:
					ratePlanDescription.billingPeriod as RecurringBillingPeriod,
			};

		case 'TierThree':
			return {
				productType: 'TierThree',
				currency: currencyKey,
				billingPeriod:
					ratePlanDescription.billingPeriod as RecurringBillingPeriod,
				fulfilmentOptions: fulfilmentOption,
				productOptions: productOption,
			};

		case 'Contribution':
			return {
				productType: 'Contribution',
				currency: currencyKey,
				billingPeriod:
					ratePlanDescription.billingPeriod as RecurringBillingPeriod,
				amount: finalAmount,
			};

		case 'SupporterPlus':
			return {
				productType: 'SupporterPlus',
				currency: currencyKey,
				billingPeriod:
					ratePlanDescription.billingPeriod as RecurringBillingPeriod,
				/**
				 * We shouldn't have to calculate these amounts here.
				 *
				 * TODO: remove the amount altogether and send only the contribution amount.
				 * but they're a legacy of how the support-workers works i.e
				 * - contribution = thisAmount - original
				 * - if contribution < 0, fail
				 * - apply any promo
				 * @see https://github.com/guardian/support-frontend/blob/51b06f33a0f9f70628154e100374d5933708e38f/support-workers/src/main/scala/com/gu/zuora/subscriptionBuilders/SupporterPlusSubcriptionBuilder.scala#L38-L42
				 */
				amount: originalAmount + (contributionAmount ?? 0),
			};

		case 'GuardianWeeklyDomestic':
			return {
				productType: 'GuardianWeekly',
				currency: currencyKey,
				fulfilmentOptions: 'Domestic',
				billingPeriod:
					ratePlanDescription.billingPeriod as RecurringBillingPeriod,
			};

		case 'GuardianWeeklyRestOfWorld':
			return {
				productType: 'GuardianWeekly',
				fulfilmentOptions: 'RestOfWorld',
				currency: currencyKey,
				billingPeriod:
					ratePlanDescription.billingPeriod as RecurringBillingPeriod,
			};

		case 'DigitalSubscription':
			return {
				productType: 'DigitalPack',
				currency: currencyKey,
				billingPeriod:
					ratePlanDescription.billingPeriod as RecurringBillingPeriod,
				readerType: 'Direct',
			};

		case 'NationalDelivery':
		case 'SubscriptionCard':
		case 'HomeDelivery': {
			const finalFulfilmentOption =
				fulfilmentOption === 'HomeDelivery' && deliveryAgent
					? 'NationalDelivery'
					: fulfilmentOption;
			return {
				productType: 'Paper',
				currency: currencyKey,
				billingPeriod:
					ratePlanDescription.billingPeriod as RecurringBillingPeriod,
				fulfilmentOptions: finalFulfilmentOption,
				productOptions: productOption,
				deliveryAgent,
			};
		}
		case 'GuardianPatron':
		case 'OneTimeContribution':
			logException(unsupportedProductMessage);
			throw new Error(unsupportedProductMessage);
	}
};
