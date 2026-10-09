// ----- Imports ----- //
import { trackComponentEvents } from '../tracking/trackingOphan';
import type {
	OphanAction,
	OphanComponentEvent,
	OphanComponentType,
} from '../tracking/trackingOphan';

// ----- Types ------ //
const DigitalPack = 'DigitalPack';
const GuardianWeekly = 'GuardianWeekly';
const Paper = 'Paper';

export type SubscriptionProduct =
	| typeof DigitalPack
	| 'PremiumTier'
	| 'DailyEdition'
	| typeof GuardianWeekly
	| 'GuardianWeeklyGift'
	| typeof Paper
	| 'PaperAndDigital';

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
	Paper,
	GuardianWeekly,
};
