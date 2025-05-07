import type { Product } from 'components/product/productOption';
import type { Participations } from 'helpers/abTests/models';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	countryGroups,
	GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { internationaliseProductAndRatePlan } from 'helpers/productCatalog';
import type { RegularBillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	billingPeriodTitle,
	weeklyBillingPeriods,
	weeklyGiftBillingPeriods,
} from 'helpers/productPrice/billingPeriods';
import 'components/product/productOption';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import { getSimplifiedPriceDescription } from 'helpers/productPrice/priceDescriptions';
import {
	getFirstValidPrice,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	getAppliedPromo,
	promoQueryParam,
} from 'helpers/productPrice/promotions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
	fixDecimals,
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
} from 'helpers/productPrice/subscriptions';
import type { OphanComponentType } from 'helpers/tracking/trackingOphan';
import {
	addQueryParamsToURL,
	getOrigin,
	getQueryParameter,
} from 'helpers/urls/url';
import Prices from './content/prices';

const countryPath = (countryGroupId: CountryGroupId) =>
	countryGroups[countryGroupId].supportInternationalisationId;

const getCheckoutUrl = (
	countryId: IsoCountry,
	billingPeriod: RegularBillingPeriod,
	abParticipations: Participations,
	orderIsGift: boolean,
	promotion?: Promotion,
): string => {
	// Gifting will be supported last
	if (
		abParticipations.guardianWeeklyGenericCheckout === 'variant' &&
		!orderIsGift
	) {
		const countryGroupId = CountryGroup.fromCountry(countryId) ?? GBPCountries;
		const { productKey: productGuardianWeekly } =
			internationaliseProductAndRatePlan(
				countryGroups[countryGroupId].supportInternationalisationId,
				'GuardianWeeklyDomestic',
				billingPeriod,
			);
		const url = `${getOrigin()}/${countryPath(countryGroupId)}/checkout`;
		return addQueryParamsToURL(url, {
			promoCode: promotion?.promoCode,
			product: productGuardianWeekly,
			ratePlan: billingPeriod.toString(),
		});
	}

	const promoCode = getQueryParameter(promoQueryParam);
	const promoQuery = promoCode ? `&${promoQueryParam}=${promoCode}` : '';
	const gift = orderIsGift ? '/gift' : '';
	return `${getOrigin()}/subscribe/weekly/checkout${gift}?period=${billingPeriod.toString()}${promoQuery}`;
};

const getCurrencySymbol = (currencyId: IsoCurrency): string =>
	currencies[currencyId].glyph;

const getPriceWithSymbol = (currencyId: IsoCurrency, price: number) =>
	getCurrencySymbol(currencyId) + fixDecimals(price);

const getPromotionLabel = (currency: IsoCurrency, promotion?: Promotion) => {
	if (!promotion?.discount) {
		return '';
	}
	if (promotion.name.startsWith('12for12')) {
		return `Special Offer: 12 for ${currencies[currency].glyph}${
			promotion.discountedPrice ?? '12'
		}`;
	} else if (promotion.promoCode.startsWith('GWBLACKFRIDAY')) {
		return `Black Friday Offer: ${
			currency === 'GBP' || currency === 'EUR'
				? `1/3 off`
				: `${Math.round(promotion.discount.amount)}% off`
		}`;
	} else {
		return `Save ${Math.round(promotion.discount.amount)}%`;
	}
};

const getMainDisplayPrice = (
	productPrice: ProductPrice,
	promotion?: Promotion | null,
): number => {
	if (promotion) {
		return getFirstValidPrice(promotion.discountedPrice, productPrice.price);
	}

	return productPrice.price;
};

const weeklyProductProps = (
	countryId: IsoCountry,
	billingPeriod: RegularBillingPeriod,
	productPrice: ProductPrice,
	abParticipations: Participations,
	orderIsAGift = false,
) => {
	const promotion = getAppliedPromo(productPrice.promotions);
	const mainDisplayPrice = getMainDisplayPrice(productPrice, promotion);
	const offerCopy = promotion?.landingPage?.roundel ?? '';
	const trackingProperties = {
		id: orderIsAGift
			? `subscribe_now_cta_gift-${billingPeriod}`
			: `subscribe_now_cta-${billingPeriod}`,
		product: 'GuardianWeekly' as SubscriptionProduct,
		componentType: 'ACQUISITIONS_BUTTON' as OphanComponentType,
	};

	const is12for12 = promotion?.promoCode.startsWith('12for12') ?? false;
	const isBlackFriday =
		promotion?.promoCode.startsWith('GWBLACKFRIDAY') ?? false;
	const label = getPromotionLabel(productPrice.currency, promotion);
	return {
		title: billingPeriodTitle(billingPeriod, orderIsAGift),
		price: getPriceWithSymbol(productPrice.currency, mainDisplayPrice),
		offerCopy,
		priceCopy: (
			<span>{getSimplifiedPriceDescription(productPrice, billingPeriod)}</span>
		),
		buttonCopy: 'Subscribe now',
		href: getCheckoutUrl(
			countryId,
			billingPeriod,
			abParticipations,
			orderIsAGift,
			promotion,
		),
		label,
		onClick: sendTrackingEventsOnClick(trackingProperties),
		onView: sendTrackingEventsOnView(trackingProperties),
		isSpecialOffer: is12for12 || isBlackFriday,
	};
};

type WeeklyProductPricesProps = {
	countryId: IsoCountry;
	productPrices: ProductPrices | null | undefined;
	abParticipations: Participations;
	orderIsAGift: boolean;
};

const getProducts = ({
	countryId,
	productPrices,
	abParticipations,
	orderIsAGift,
}: WeeklyProductPricesProps): Product[] => {
	const billingPeriodsToUse = orderIsAGift
		? weeklyGiftBillingPeriods
		: weeklyBillingPeriods;

	return billingPeriodsToUse.map((billingPeriod) => {
		const productPrice = productPrices
			? getProductPrice(
					productPrices,
					countryId,
					billingPeriod,
					getWeeklyFulfilmentOption(countryId),
				)
			: {
					price: 0,
					fixedTerm: false,
					currency: 'GBP' as IsoCurrency,
				};

		return weeklyProductProps(
			countryId,
			billingPeriod,
			productPrice,
			abParticipations,
			orderIsAGift,
		);
	});
};

function WeeklyProductPrices({
	countryId,
	productPrices,
	abParticipations,
	orderIsAGift,
}: WeeklyProductPricesProps): JSX.Element | null {
	if (!productPrices) {
		return null;
	}

	const products = getProducts({
		countryId,
		productPrices,
		abParticipations,
		orderIsAGift,
	});

	return <Prices products={products} orderIsAGift={orderIsAGift} />;
}

// ----- Exports ----- //

export default WeeklyProductPrices;
