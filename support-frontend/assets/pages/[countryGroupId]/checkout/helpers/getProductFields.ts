import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { RegularPaymentRequest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
	ProductDescription,
} from 'helpers/productCatalog';
import { logException } from 'helpers/utilities/logger';
import { getFulfilmentOptionFromProductKey } from '../../../../helpers/productCatalogToFulfilmentOption';
import { getProductOptionFromProductAndRatePlan } from '../../../../helpers/productCatalogToProductOption';

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
	const billingPeriod =
		productDescription.ratePlans[ratePlanKey]?.billingPeriod ??
		BillingPeriod.Monthly;
	const fixedTerm =
		productDescription.ratePlans[ratePlanKey]?.fixedTerm ?? false;
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
				billingPeriod: billingPeriod,
			};

		case 'TierThree':
			return {
				productType: 'TierThree',
				currency: currencyKey,
				billingPeriod: billingPeriod,
				fulfilmentOptions: fulfilmentOption,
				productOptions: productOption,
			};

		case 'Contribution':
			return {
				productType: 'Contribution',
				currency: currencyKey,
				billingPeriod: billingPeriod,
				amount: finalAmount,
			};

		case 'SupporterPlus':
			return {
				productType: 'SupporterPlus',
				currency: currencyKey,
				billingPeriod,
				fixedTerm,
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
				billingPeriod: billingPeriod,
			};

		case 'GuardianWeeklyRestOfWorld':
			return {
				productType: 'GuardianWeekly',
				fulfilmentOptions: 'RestOfWorld',
				currency: currencyKey,
				billingPeriod: billingPeriod,
			};

		case 'DigitalSubscription':
			return {
				productType: 'DigitalPack',
				currency: currencyKey,
				billingPeriod: billingPeriod,
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
				billingPeriod: billingPeriod,
				fulfilmentOptions: finalFulfilmentOption,
				productOptions: productOption,
				deliveryAgent,
			};
		}
		case 'OneTimeContribution':
			logException(unsupportedProductMessage);
			throw new Error(unsupportedProductMessage);
	}
};
