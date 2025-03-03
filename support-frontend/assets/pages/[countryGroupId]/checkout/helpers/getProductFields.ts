import type { RegularPaymentRequest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type {
	ActiveProductKey,
	ProductDescription,
} from 'helpers/productCatalog';
import { getFulfilmentOptionFromProductKey } from 'helpers/productPrice/fulfilmentOptions';
import { getProductOptionFromProductAndRatePlan } from 'helpers/productPrice/productOptions';
import { logException } from 'helpers/utilities/logger';

type GetProductFieldsParams = {
	product: {
		productKey: ActiveProductKey;
		productDescription: ProductDescription;
		ratePlanKey: string;
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
	const { productKey, ratePlanKey, productDescription } = product;
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
				billingPeriod: ratePlanDescription.billingPeriod,
			};

		case 'TierThree':
			return {
				productType: 'TierThree',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				fulfilmentOptions: fulfilmentOption,
				productOptions: productOption,
			};

		case 'Contribution':
			return {
				productType: 'Contribution',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				amount: finalAmount,
			};

		case 'SupporterPlus':
			return {
				productType: 'SupporterPlus',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
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
				billingPeriod: ratePlanDescription.billingPeriod,
			};

		case 'GuardianWeeklyRestOfWorld':
			return {
				productType: 'GuardianWeekly',
				fulfilmentOptions: 'RestOfWorld',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
			};

		case 'DigitalSubscription':
			return {
				productType: 'DigitalPack',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				readerType: 'Direct',
			};

		case 'NationalDelivery':
		case 'SubscriptionCard':
		case 'HomeDelivery':
			return {
				productType: 'Paper',
				currency: currencyKey,
				billingPeriod: ratePlanDescription.billingPeriod,
				fulfilmentOptions: fulfilmentOption,
				productOptions: productOption,
			};

		case 'GuardianPatron':
		case 'OneTimeContribution':
			logException(unsupportedProductMessage);
			throw new Error(unsupportedProductMessage);
	}
};
