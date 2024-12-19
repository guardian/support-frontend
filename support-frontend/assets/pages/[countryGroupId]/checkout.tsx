import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { getStripeKey } from 'helpers/forms/stripe';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { Country } from 'helpers/internationalisation/classes/country';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { isProductKey, productCatalog } from 'helpers/productCatalog';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { type ProductOptions } from 'helpers/productPrice/productOptions';
import { getPromotion } from 'helpers/productPrice/promotions';
import * as cookie from 'helpers/storage/cookie';
import { sendEventCheckoutValue } from 'helpers/tracking/quantumMetric';
import { logException } from 'helpers/utilities/logger';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { CheckoutComponent } from './components/checkoutComponent';

type Props = {
	geoId: GeoId;
	appConfig: AppConfig;
};

const countryId: IsoCountry = Country.detect();

export function Checkout({ geoId, appConfig }: Props) {
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);
	const urlSearchParams = new URLSearchParams(window.location.search);

	/** 👇 a lot of this is copy/pasted into the thank you page */
	/** Get and validate product */
	const productParam = urlSearchParams.get('product');
	const productKey =
		productParam && isProductKey(productParam) ? productParam : undefined;
	const product = productKey && productCatalog[productKey];
	if (!product) {
		logException('Product not found');
		return <div>Product not found</div>;
	}

	/**
	 * Get and validate ratePlan
	 * TODO: This type should be more specific e.g. `ProductRatePlanKey<P>`.
	 * Annoyingly the TypeScript for this is a little fiddly due to the
	 * API being completely based on literals, so we've left it as `string`
	 * although we do validate it is a valid ratePlan for this product
	 */
	const ratePlanParam = urlSearchParams.get('ratePlan');
	const ratePlanKey =
		ratePlanParam && ratePlanParam in product.ratePlans
			? ratePlanParam
			: undefined;
	const ratePlan = ratePlanKey && product.ratePlans[ratePlanKey];
	if (!ratePlan) {
		logException('Rate plan not found');
		return <div>Rate plan not found</div>;
	}

	/**
	 * Get and validate the amount
	 *
	 * For products the amount is based on
	 * - the product price in the catalog
	 * - any promotions applied
	 * - any contributions made
	 */

	/**
	 * - `originalAmount` the amount pre any discounts or contributions
	 * - `discountredAmount` the amount with a discountApplied
	 * - `finalAmount` is the amount a person will pay
	 */
	let payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};

	const contributionParam = urlSearchParams.get('contribution');
	const contributionAmount = contributionParam
		? parseInt(contributionParam, 10)
		: undefined;

	/**
	 * This is some annoying transformation we need from
	 * Product API => Contributions work we need to do
	 */
	const billingPeriod =
		ratePlan.billingPeriod === 'Quarter'
			? 'Quarterly'
			: ratePlan.billingPeriod === 'Month'
			? 'Monthly'
			: 'Annual';

	let promotion;
	if (productKey === 'Contribution') {
		/**
		 * Contributions are dynamic amounts, often selected from the `amounts` from RRCP
		 * @see https://support.gutools.co.uk/amounts
		 */
		if (!contributionAmount) {
			logException('Contribution not specified');
			return <div>Contribution not specified</div>;
		}

		payment = {
			contributionAmount,
			originalAmount: contributionAmount,
			finalAmount: contributionAmount,
		};
	} else {
		const productPrice =
			currencyKey in ratePlan.pricing
				? ratePlan.pricing[currencyKey]
				: undefined;

		if (!productPrice) {
			logException('Price not found in product catalog');
			return <div>Price not found in product catalog</div>;
		}

		/**
		 * Get any promotions.
		 * Promos are only available on SupporterPlus and TierThree and we only use this value to determine promotion values
		 */
		const productPrices =
			productKey === 'SupporterPlus' || productKey === 'TierThree'
				? appConfig.allProductPrices[productKey]
				: undefined;

		const getFulfilmentOptions = (productKey: string): FulfilmentOptions => {
			switch (productKey) {
				case 'SupporterPlus':
				case 'Contribution':
					return 'NoFulfilmentOptions';
				case 'TierThree':
					return countryGroupId === 'International'
						? 'RestOfWorld'
						: 'Domestic';
				default:
					// ToDo: define for every product here
					return 'NoFulfilmentOptions';
			}
		};
		const fulfilmentOption = getFulfilmentOptions(productKey);
		const getProductOptions = (productKey: string): ProductOptions => {
			switch (productKey) {
				case 'TierThree':
					return ratePlanKey.endsWith('V2')
						? 'NewspaperArchive'
						: 'NoProductOptions';
				// TODO: define for newspaper
				default:
					return 'NoProductOptions';
			}
		};
		const productOptions: ProductOptions = getProductOptions(productKey);

		promotion = productPrices
			? getPromotion(
					productPrices,
					countryId,
					billingPeriod,
					fulfilmentOption,
					productOptions,
			  )
			: undefined;
		const discountedPrice = promotion?.discountedPrice
			? promotion.discountedPrice
			: undefined;

		const price = discountedPrice ?? productPrice;

		if (productKey === 'SupporterPlus') {
			/** SupporterPlus can have an additional contribution bolted onto the base price */
			payment = {
				originalAmount: productPrice,
				discountedAmount: discountedPrice,
				contributionAmount,
				finalAmount: price + (contributionAmount ?? 0),
			};
		} else {
			payment = {
				originalAmount: productPrice,
				discountedAmount: discountedPrice,
				contributionAmount,
				finalAmount: price,
			};
		}
	}

	const isTestUser = !!cookie.get('_test_username');
	const stripePublicKey = getStripeKey(
		'REGULAR',
		countryId,
		currencyKey,
		isTestUser,
	);
	const stripePromise = loadStripe(stripePublicKey);

	const stripeExpressCheckoutSwitch =
		window.guardian.settings.switches.recurringPaymentMethods
			.stripeExpressCheckout === 'On';

	let elementsOptions = {};
	let useStripeExpressCheckout = false;
	if (stripeExpressCheckoutSwitch) {
		/**
		 * Currently we're only using the stripe ExpressCheckoutElement on Contribution purchases
		 * which then needs this configuration.
		 */
		if (productKey === 'Contribution' || productKey === 'SupporterPlus') {
			elementsOptions = {
				mode: 'payment',
				/**
				 * Stripe amounts are in the "smallest currency unit"
				 * @see https://docs.stripe.com/api/charges/object
				 * @see https://docs.stripe.com/currencies#zero-decimal
				 */
				amount: payment.finalAmount * 100,
				currency: currencyKey.toLowerCase(),
				paymentMethodCreation: 'manual',
			} as const;
			useStripeExpressCheckout = true;
		}
	}

	/**
	 * We use the country ULRSearchParam to force a person into a country.
	 * Where this is currently used is in the addressFields when someone selects
	 * a country that doesn't correspond to the countryGroup a product is in.
	 */
	const forcedCountry = urlSearchParams.get('country') ?? undefined;

	useEffect(() => {
		/**
		 * Notify QM of checkout value
		 */
		sendEventCheckoutValue(
			payment.finalAmount,
			productKey,
			billingPeriod,
			currencyKey,
		);
	}, []);

	return (
		<Elements stripe={stripePromise} options={elementsOptions}>
			<CheckoutComponent
				geoId={geoId}
				appConfig={appConfig}
				stripePublicKey={stripePublicKey}
				isTestUser={isTestUser}
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				promotion={promotion}
				originalAmount={payment.originalAmount}
				discountedAmount={payment.discountedAmount}
				contributionAmount={payment.contributionAmount}
				finalAmount={payment.finalAmount}
				useStripeExpressCheckout={useStripeExpressCheckout}
				countryId={countryId}
				forcedCountry={forcedCountry}
			/>
		</Elements>
	);
}

export default Checkout;
