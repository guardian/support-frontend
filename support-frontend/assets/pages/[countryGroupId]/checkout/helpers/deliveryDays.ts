import type { ActiveProductKey } from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import {
	getDeliveryDays,
	getNextDeliveryDay,
	numberOfWeeksWeDeliverTo,
} from 'helpers/subscriptionsForms/deliveryDays';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { getHomeDeliveryDays } from 'pages/paper-subscription-checkout/helpers/homeDeliveryDays';
import { getPaymentStartDate } from 'pages/paper-subscription-checkout/helpers/subsCardDays';

const extraDelayCutoffWeekday = 3;
const normalDelayWeeks = 1;
const extraDelayWeeks = 2;

const addDays = (date: Date, days: number): Date => {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

const getWeeklyDays = (testDate?: number): Date[] => {
	const now = new Date(testDate ?? new Date().getTime());
	const currentWeekday = now.getDay();

	const isChrismassy = (d: Date) => d.getDate() === 27 && d.getMonth() === 11;

	const weeksToAdd =
		currentWeekday > extraDelayCutoffWeekday || currentWeekday === 0 // Sunday is considered the last day of the week
			? extraDelayWeeks
			: normalDelayWeeks;
	const allDeliveryDays = getDeliveryDays(
		now.getTime(),
		5,
		numberOfWeeksWeDeliverTo + weeksToAdd,
	);
	const nonChrismassy = allDeliveryDays.filter((d) => !isChrismassy(d));

	if (allDeliveryDays.length > nonChrismassy.length) {
		const lastNonChrismassy = nonChrismassy[nonChrismassy.length - 1];
		if (lastNonChrismassy) {
			nonChrismassy.push(getNextDeliveryDay(lastNonChrismassy));
		}
	}

	const publicationDays = nonChrismassy.splice(weeksToAdd);
	const publicationStartDays = publicationDays.filter((day) => {
		const invalidPublicationDates = ['-12-24', '-12-25', '-12-26', '-12-30'];
		const date = formatMachineDate(day);
		return !invalidPublicationDates.some((dateSuffix) =>
			date.endsWith(dateSuffix),
		);
	});

	return publicationStartDays;
};

// For GuardianWeekly take first available delivery date
const getWeeklyDeliveryDate = (testDate?: number): Date => {
	const result = getWeeklyDays(testDate)[0];
	if (result === undefined) {
		throw new Error('We could not find a valid weekly delivery date');
	}
	return result;
};

// For the Tier Three (t3) product we want users to be able to cancel within 14 days without being charged.
// To do this we need the first delivery date of the Guardian Weekly part of the subscription, which is the date
// on which the first payment will be taken, to be at least 14 (actually 15 to be safe) days from today.
const getTierThreeDeliveryDate = (testDate?: number): Date => {
	const firstValidDeliveryDate = addDays(
		new Date(testDate ?? new Date().getTime()),
		15,
	);
	const weeklyDays = getWeeklyDays(testDate);
	const result = weeklyDays.find(
		(date) => date.getTime() >= firstValidDeliveryDate.getTime(),
	);
	if (result === undefined) {
		throw new Error('We couldn\t find a valid three tier delivery date');
	}
	return result;
};

const getProductFirstDeliveryDate = (
	productKey: ActiveProductKey,
	paperProductOptions?: ActivePaperProductOptions,
): Date | undefined => {
	switch (productKey) {
		case 'GuardianAdLite':
			return addDays(new Date(), 15);
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld': {
			return getWeeklyDeliveryDate();
		}
		case 'TierThree':
			return getTierThreeDeliveryDate();
		case 'NationalDelivery':
		case 'HomeDelivery':
			if (paperProductOptions === undefined) {
				return undefined;
			}
			return getHomeDeliveryDays(Date.now(), paperProductOptions)[0];
		case 'SubscriptionCard': {
			if (paperProductOptions === undefined) {
				return undefined;
			}
			return getPaymentStartDate(Date.now(), paperProductOptions);
		}
		default:
			return undefined;
	}
};

const getProductWeeklyDeliveryDate = (productKey: ActiveProductKey): Date => {
	if (productKey === 'TierThree') {
		return getTierThreeDeliveryDate();
	}
	return getWeeklyDeliveryDate();
};

export {
	addDays,
	getWeeklyDays,
	getWeeklyDeliveryDate,
	getTierThreeDeliveryDate,
	getProductFirstDeliveryDate,
	getProductWeeklyDeliveryDate,
};
