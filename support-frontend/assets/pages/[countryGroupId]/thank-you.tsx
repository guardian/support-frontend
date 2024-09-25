import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import CountryHelper from 'helpers/internationalisation/classes/country';
import { isProductKey, productCatalog } from 'helpers/productCatalog';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { getPromotion } from 'helpers/productPrice/promotions';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { ThankYouComponent } from './components/thankyou';

type Props = {
	geoId: GeoId;
	appConfig: AppConfig;
};

export function ThankYou({ geoId, appConfig }: Props) {
	/** 👇 a lot of this is copy/pasted from the checkout */
	const countryId = CountryHelper.detect();

	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);
	const searchParams = new URLSearchParams(window.location.search);

	/** Get and validate product */
	const productParam = searchParams.get('product');
	const productKey =
		productParam && isProductKey(productParam) ? productParam : undefined;
	const product = productKey && productCatalog[productKey];
	if (!product) {
		return <div>Product not found</div>;
	}

	/** Get and validate ratePlan */
	const ratePlanParam = searchParams.get('ratePlan');
	const ratePlanKey =
		ratePlanParam && ratePlanParam in product.ratePlans
			? ratePlanParam
			: undefined;
	const ratePlan = ratePlanKey && product.ratePlans[ratePlanKey];
	if (!ratePlan) {
		return <div>Rate plan not found</div>;
	}

	/** Get and validate the amount */
	let payment: {
		originalAmount: number;
		discountedAmount?: number;
		contributionAmount?: number;
		finalAmount: number;
	};

	const contributionParam = searchParams.get('contribution');
	const contributionAmount = contributionParam
		? parseInt(contributionParam, 10)
		: undefined;

	let promotion;
	if (productKey === 'Contribution') {
		if (!contributionAmount) {
			return <div>Contribution not specified</div>;
		}

		payment = {
			originalAmount: contributionAmount,
			finalAmount: contributionAmount,
		};
	} else {
		const productPrice =
			currencyKey in ratePlan.pricing
				? ratePlan.pricing[currencyKey]
				: undefined;

		if (!productPrice) {
			return <div>Price not found in product catalog</div>;
		}

		/** Get any promotions */
		const productPrices = appConfig.productPrices;

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

		promotion = getPromotion(
			productPrices,
			countryId,
			billingPeriod,
			fulfilmentOption,
		);
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
	return (
		<ThankYouComponent
			productKey={productKey}
			ratePlanKey={ratePlanKey}
			geoId={geoId}
			appConfig={appConfig}
			payment={payment}
			promotion={promotion}
		/>
	);
}
