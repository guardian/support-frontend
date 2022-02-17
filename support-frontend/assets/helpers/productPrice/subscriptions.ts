// ----- Imports ----- //
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { Monthly, Quarterly } from 'helpers/productPrice/billingPeriods';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';
import { currencies, detect } from '../internationalisation/currency';
import { trackComponentEvents } from '../tracking/ophan';
import type {
	OphanAction,
	OphanComponentEvent,
	OphanComponentType,
} from '../tracking/ophan';

// ----- Types ------ //
const DigitalPack = 'DigitalPack';
const PremiumTier = 'PremiumTier';
const DailyEdition = 'DailyEdition';
const GuardianWeekly = 'GuardianWeekly';
const Paper = 'Paper';
const PaperAndDigital = 'PaperAndDigital';

export type SubscriptionProduct =
	| typeof DigitalPack
	| typeof PremiumTier
	| typeof DailyEdition
	| typeof GuardianWeekly
	| typeof Paper
	| typeof PaperAndDigital;

type OphanSubscriptionsProduct = 'DIGITAL_SUBSCRIPTION' | 'PRINT_SUBSCRIPTION';

export type ComponentAbTest = {
	name: string;
	variant: string;
};

export type TrackingProperties = {
	id: string;
	product?: SubscriptionProduct;
	abTest?: ComponentAbTest;
	componentType: OphanComponentType;
};

// ----- Config ----- //
const dailyNewsstandPrice = 2.2;
const weekendNewsstandPrice = 3.2;
const newsstandPrices: Record<PaperProductOptions, number> = {
	Saturday: weekendNewsstandPrice,
	Sunday: weekendNewsstandPrice,
	Everyday: dailyNewsstandPrice * 5 + weekendNewsstandPrice * 2,
	Weekend: weekendNewsstandPrice * 2,
	Sixday: dailyNewsstandPrice * 5 + weekendNewsstandPrice,
};

export const subscriptionPricesForDefaultBillingPeriod = {
	PaperAndDigital: {
		GBPCountries: 21.99,
	},
} as Record<SubscriptionProduct, Record<CountryGroupId, number>>;

const defaultBillingPeriods: Record<SubscriptionProduct, BillingPeriod> = {
	PremiumTier: Monthly,
	DigitalPack: Monthly,
	GuardianWeekly: Quarterly,
	Paper: Monthly,
	PaperAndDigital: Monthly,
	DailyEdition: Monthly,
};

// ----- Functions ----- //
const isPhysicalProduct = (product: SubscriptionProduct): boolean => {
	switch (product) {
		case Paper:
		case PaperAndDigital:
		case GuardianWeekly:
			return true;

		default:
			return false;
	}
};

function fixDecimals(number: number): string {
	if (Number.isInteger(number)) {
		return number.toString();
	}

	return number.toFixed(2);
}

function getProductPrice(
	product: SubscriptionProduct,
	countryGroupId: CountryGroupId,
): string {
	return fixDecimals(
		subscriptionPricesForDefaultBillingPeriod[product][countryGroupId],
	);
}

function displayPrice(
	product: SubscriptionProduct,
	countryGroupId: CountryGroupId,
): string {
	const currency = currencies[detect(countryGroupId)].glyph;
	const price = getProductPrice(product, countryGroupId);
	return `${currency}${price}/${defaultBillingPeriods[product]}`;
}

// ----- Ophan Tracking ----- //
function ophanProductFromSubscriptionProduct(
	product: SubscriptionProduct,
): OphanSubscriptionsProduct {
	switch (product) {
		case 'DigitalPack':
		case 'PremiumTier':
		case 'DailyEdition':
			return 'DIGITAL_SUBSCRIPTION';

		case 'GuardianWeekly':
		case 'Paper':
		case 'PaperAndDigital':
		default:
			return 'PRINT_SUBSCRIPTION';
	}
}

const sendTrackingEvent = (
	trackingProperties: TrackingProperties & {
		action: OphanAction;
	},
): void => {
	const { id, product, abTest, componentType, action } = trackingProperties;
	const componentEvent: OphanComponentEvent = {
		component: {
			componentType,
			id,
			products: product ? [ophanProductFromSubscriptionProduct(product)] : [],
		},
		action,
		id,
		...(abTest
			? {
					abTest,
			  }
			: {}),
	};
	trackComponentEvents(componentEvent);
};

const sendTrackingEventsOnClick =
	(trackingProperties: TrackingProperties): (() => void) =>
	() => {
		sendTrackingEvent({ ...trackingProperties, action: 'CLICK' });
	};

const sendTrackingEventsOnView =
	(trackingProperties: TrackingProperties): (() => void) =>
	() => {
		sendTrackingEvent({ ...trackingProperties, action: 'VIEW' });
	};

// ----- Newsstand savings ----- //
const getMonthlyNewsStandPrice = (newsstand: number) => (newsstand * 52) / 12;

const getNewsstandSaving = (
	subscriptionMonthlyCost: number,
	newsstandWeeklyCost: number,
): string =>
	fixDecimals(
		getMonthlyNewsStandPrice(newsstandWeeklyCost) - subscriptionMonthlyCost,
	);

const getNewsstandSavingPercentage = (
	subscriptionMonthlyCost: number,
	newsstandWeeklyCost: number,
): number =>
	Math.floor(
		100 -
			(subscriptionMonthlyCost /
				getMonthlyNewsStandPrice(newsstandWeeklyCost)) *
				100,
	);

const getNewsstandPrice = (productOption: PaperProductOptions): number =>
	newsstandPrices[productOption];

// ----- Exports ----- //
export {
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
	displayPrice,
	getProductPrice,
	getNewsstandSaving,
	getNewsstandSavingPercentage,
	getNewsstandPrice,
	fixDecimals,
	DigitalPack,
	PaperAndDigital,
	Paper,
	PremiumTier,
	DailyEdition,
	GuardianWeekly,
	isPhysicalProduct,
};
