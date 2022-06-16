import 'components/product/productOption';
import 'components/product/productOptionSmall';
import 'helpers/types/option';
import type { Product as ProductOptionType } from 'components/product/productOption';
import type { ProductSmall } from 'components/product/productOptionSmall';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
import {
	Annual,
	Monthly,
	Quarterly,
} from 'helpers/productPrice/billingPeriods';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	getAdverbialSubscriptionDescription,
	getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import {
	getFirstValidPrice,
	isNumeric,
} from 'helpers/productPrice/productPrices';
import type {
	BillingPeriods,
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	fixDecimals,
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import { gaEvent } from 'helpers/tracking/googleTagManager';
import type { OphanComponentType } from 'helpers/tracking/ophan';
import type { Option } from 'helpers/types/option';
import { getDigitalCheckout } from 'helpers/urls/externalLinks';

export const getProductOptions = (
	productPrices: ProductPrices,
	countryGroupId: CountryGroupId,
): BillingPeriods => {
	const countryGroupName = countryGroups[countryGroupId].name;
	const productOptions =
		productPrices[countryGroupName]?.NoFulfilmentOptions?.NoProductOptions;

	if (productOptions) {
		return productOptions;
	}

	throw new Error('getProductOptions: product options unavailable');
};

export const getCurrencySymbol = (currencyId: IsoCurrency): string =>
	currencies[currencyId].glyph;

export const getDisplayPrice = (
	currencyId: IsoCurrency,
	price: number,
): string => getCurrencySymbol(currencyId) + fixDecimals(price);

export const getProductPrice = (
	productOptions: BillingPeriods,
	billingPeriod: BillingPeriod,
	currencyId: IsoCurrency,
): ProductPrice => {
	const productPrice = productOptions[billingPeriod]?.[currencyId];

	if (productPrice) {
		return productPrice;
	}

	throw new Error('getProductPrice: product price unavailable');
};

const BILLING_PERIOD = {
	[Monthly]: {
		title: 'Monthly',
		salesCopy: (
			currencyId: IsoCurrency,
			displayPrice: number,
			promotionalPrice: Option<number>,
		) => {
			const display = (price: number) => getDisplayPrice(currencyId, price);

			if (promotionalPrice === 0) {
				return;
			}

			return promotionalPrice ? (
				<span>
					<span className="product-option__price-detail">
						then {display(displayPrice)} per month
					</span>
				</span>
			) : (
				<span>
					<span className="product-option__price-detail">
						14 day free trial
					</span>
				</span>
			);
		},
		offer: '',
		label: '',
	},
	[Annual]: {
		title: 'Annual',
		salesCopy: (
			currencyId: IsoCurrency,
			displayPrice: number,
			promotionalPrice: Option<number>,
		) => {
			const display = (price: number) => getDisplayPrice(currencyId, price);

			if (promotionalPrice === 0) {
				return;
			}

			return isNumeric(promotionalPrice) ? (
				<span>
					<span className="product-option__price-detail">
						then {display(displayPrice)} a year
					</span>
				</span>
			) : (
				<span>
					<span className="product-option__price-detail">per month</span>
				</span>
			);
		},
		offer: 'Save an additional 21%',
		label: 'Best Deal',
	},
};

const BILLING_PERIOD_GIFT = {
	[Quarterly]: {
		title: '3 months',
		salesCopy: () => (
			<span>
				<span className="product-option__price-detail">One-off payment</span>
			</span>
		),
		offer: '',
		label: '',
	},
	[Annual]: {
		title: '12 months',
		salesCopy: () => (
			<span>
				<span className="product-option__price-detail">One-off payment</span>
			</span>
		),
		offer: '',
		label: 'Best Deal',
	},
};

const getHeroCtaProps = (
	productPrices: ProductPrices,
	currencyId: IsoCurrency,
	countryGroupId: CountryGroupId,
): ProductSmall[] => {
	const productOptions = getProductOptions(productPrices, countryGroupId);

	const createPaymentOption = (billingPeriod: BillingPeriod): ProductSmall => {
		const digitalBillingPeriod =
			billingPeriod === 'Monthly' || billingPeriod === 'Annual'
				? billingPeriod
				: 'Monthly';
		const productPrice = getProductPrice(
			productOptions,
			billingPeriod,
			currencyId,
		);
		const promotion = getAppliedPromo(productPrice.promotions);
		const promoCode = promotion ? promotion.promoCode : null;
		const offerCopy = promotion?.landingPage?.roundel
			? promotion.landingPage.roundel
			: BILLING_PERIOD[digitalBillingPeriod].offer;

		const trackingProperties = {
			id: `subscribe_now_cta_hero-${billingPeriod}`,
			product: 'DigitalPack' as SubscriptionProduct,
			componentType: 'ACQUISITIONS_BUTTON' as OphanComponentType,
		};

		const onClick = () => {
			gaEvent({
				category: 'click',
				action: 'DigitalPack',
				label: trackingProperties.id,
			});
			sendTrackingEventsOnClick(trackingProperties)();
		};

		return {
			href: getDigitalCheckout(digitalBillingPeriod, promoCode, false),
			onClick,
			priceCopy: getPriceDescription(
				productPrice,
				digitalBillingPeriod,
				false,
				false,
			),
			offerCopy,
			buttonCopy: getAdverbialSubscriptionDescription(
				productPrice,
				digitalBillingPeriod,
			),
			billingPeriod: digitalBillingPeriod,
		};
	};

	return (Object.keys(productOptions) as BillingPeriod[])
		.sort((optA, optB) => {
			if (optA === 'Annual') {
				return 1;
			} else if (optB === 'Annual') {
				return -1;
			}

			return 0;
		})
		.map(createPaymentOption);
};

export type PaymentSelectionPropTypes = {
	countryGroupId: CountryGroupId;
	currencyId: IsoCurrency;
	productPrices: ProductPrices;
	orderIsAGift: boolean;
};

// state
const getPaymentOptions = ({
	countryGroupId,
	currencyId,
	productPrices,
	orderIsAGift,
}: PaymentSelectionPropTypes): ProductOptionType[] => {
	const productOptions = getProductOptions(productPrices, countryGroupId);

	const createPaymentOption = (
		billingPeriod: BillingPeriod,
	): ProductOptionType => {
		const digitalBillingPeriod =
			billingPeriod === 'Monthly' || billingPeriod === 'Annual'
				? billingPeriod
				: 'Monthly';
		const digitalBillingPeriodGift =
			billingPeriod === 'Annual' || billingPeriod === 'Quarterly'
				? billingPeriod
				: 'Quarterly';
		const billingPeriodForHref = orderIsAGift
			? digitalBillingPeriodGift
			: digitalBillingPeriod;
		const productPrice = getProductPrice(
			productOptions,
			billingPeriod,
			currencyId,
		);
		const fullPrice = productPrice.price;
		const promotion = getAppliedPromo(productPrice.promotions);
		const promoCode = promotion ? promotion.promoCode : null;
		const promotionalPrice =
			promotion && isNumeric(promotion.discountedPrice)
				? promotion.discountedPrice
				: null;
		const offerCopy = promotion?.landingPage?.roundel
			? promotion.landingPage.roundel
			: BILLING_PERIOD[digitalBillingPeriod].offer;
		const trackingProperties = {
			id: orderIsAGift
				? `subscribe_now_cta_gift-${billingPeriod}`
				: `subscribe_now_cta-${billingPeriod}`,
			product: 'DigitalPack' as SubscriptionProduct,
			componentType: 'ACQUISITIONS_BUTTON' as OphanComponentType,
		};

		const onClick = () => {
			gaEvent({
				category: 'click',
				action: 'DigitalPack',
				label: trackingProperties.id,
			});

			sendTrackingEventsOnClick(trackingProperties)();
		};

		return orderIsAGift
			? {
					title: BILLING_PERIOD_GIFT[digitalBillingPeriodGift].title,
					price: getDisplayPrice(currencyId, fullPrice),
					href: getDigitalCheckout(
						billingPeriodForHref,
						promoCode,
						orderIsAGift,
					),
					onClick,
					onView: sendTrackingEventsOnView(trackingProperties),
					priceCopy: BILLING_PERIOD_GIFT[digitalBillingPeriodGift].salesCopy(),
					offerCopy: '',
					label: BILLING_PERIOD_GIFT[digitalBillingPeriodGift].label,
					buttonCopy: 'Give this gift',
					billingPeriod,
			  }
			: {
					title: BILLING_PERIOD[digitalBillingPeriod].title,
					price: getDisplayPrice(
						currencyId,
						getFirstValidPrice(promotionalPrice, fullPrice),
					),
					href: getDigitalCheckout(
						billingPeriodForHref,
						promoCode,
						orderIsAGift,
					),
					onClick,
					onView: sendTrackingEventsOnView(trackingProperties),
					priceCopy: BILLING_PERIOD[digitalBillingPeriod].salesCopy(
						currencyId,
						fullPrice,
						promotionalPrice,
					),
					offerCopy,
					label: BILLING_PERIOD[digitalBillingPeriod].label,
					buttonCopy: 'Subscribe now',
					billingPeriod,
			  };
	};

	return (Object.keys(productOptions) as BillingPeriod[]).map(
		createPaymentOption,
	);
};

export { getHeroCtaProps, getPaymentOptions };
