// ----- Imports ----- //
import { trackComponentEvents } from '../tracking/trackingOphan';
import type {
	OphanAction,
	OphanComponentEvent,
	OphanComponentType,
} from '../tracking/trackingOphan';

// ----- Types ------ //
const DigitalPack = 'DigitalPack';
const PremiumTier = 'PremiumTier';
const DailyEdition = 'DailyEdition';
const GuardianWeekly = 'GuardianWeekly';
const GuardianWeeklyGift = 'GuardianWeeklyGift';
const Paper = 'Paper';
const PaperAndDigital = 'PaperAndDigital';

export const subscriptionProductTypes = [
	DigitalPack,
	PremiumTier,
	DailyEdition,
	GuardianWeekly,
	GuardianWeeklyGift,
	Paper,
	PaperAndDigital,
] as const;
export const paperProductTypes = [Paper, PaperAndDigital];

export type SubscriptionProduct = (typeof subscriptionProductTypes)[number];

type OphanSubscriptionsProduct = 'DIGITAL_SUBSCRIPTION' | 'PRINT_SUBSCRIPTION';

type ComponentAbTest = {
	name: string;
	variant: string;
};

export type TrackingProperties = {
	id: string;
	product?: SubscriptionProduct;
	abTest?: ComponentAbTest;
	componentType: OphanComponentType;
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

// ----- Exports ----- //
export {
	sendTrackingEventsOnClick,
	sendTrackingEventsOnView,
	fixDecimals,
	DigitalPack,
	PaperAndDigital,
	Paper,
	GuardianWeekly,
	isPhysicalProduct,
};
