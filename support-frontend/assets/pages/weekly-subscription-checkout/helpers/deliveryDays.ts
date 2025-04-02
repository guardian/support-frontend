import type { ActiveProductKey } from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productPrice/productOptions';
import {
	getDeliveryDays,
	getNextDeliveryDay,
	numberOfWeeksWeDeliverTo,
} from 'helpers/subscriptionsForms/deliveryDays';
import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { getHomeDeliveryDays } from 'pages/paper-subscription-checkout/helpers/homeDeliveryDays';
import { getPaymentStartDate } from 'pages/paper-subscription-checkout/helpers/subsCardDays';
import { getVoucherDays } from 'pages/paper-subscription-checkout/helpers/voucherDeliveryDays';

const extraDelayCutoffWeekday = 3;
const normalDelayWeeks = 1;
const extraDelayWeeks = 2;

const getWeeklyDays = (today?: number): Date[] => {
	const now = new Date(today ?? new Date().getTime());
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

	return nonChrismassy.splice(weeksToAdd);
};

function addDays(date: Date, days: number) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function getTierThreeDeliveryDate(today?: number) {
	// For the Tier Three (t3) product we want users to be able to cancel within 14 days without being charged.
	// To do this we need the first delivery date of the Guardian Weekly part of the subscription, which is the date
	// on which the first payment will be taken, to be at least 14 (actually 15 to be safe) days from today.
	const firstValidDeliveryDate = addDays(
		new Date(today ?? new Date().getTime()),
		15,
	);
	const weeklyDays = getWeeklyDays(today);
	const result = weeklyDays.find(
		(date) => date.getTime() >= firstValidDeliveryDate.getTime(),
	);
	if (result === undefined) {
		throw new Error('We couldn\t find a valid three tier delivery date');
	}
	return result;
}

const productDeliveryOrStartDate = (
	productKey: ActiveProductKey,
	paperProductOptions?: ActivePaperProductOptions,
): Date | undefined => {
	console.log(paperProductOptions);
	switch (productKey) {
		case 'GuardianAdLite':
			return addDays(new Date(), 15);
		case 'TierThree':
			return getTierThreeDeliveryDate();
		case 'NationalDelivery':
		case 'HomeDelivery':
		case 'SubscriptionCard': {
			// paper productOption undefined check
			if (paperProductOptions === undefined) {
				return undefined;
			}
			const paperDeliveryDate =
				productKey === 'SubscriptionCard'
					? getPaymentStartDate(Date.now(), paperProductOptions)
					: productKey === 'HomeDelivery'
					? getHomeDeliveryDays(Date.now(), paperProductOptions)[0]
					: getVoucherDays(Date.now(), paperProductOptions)[0];
			// paper home and voucher delivery date array empty check
			if (paperDeliveryDate === undefined) {
				return undefined;
			}
			return paperDeliveryDate;
		}
		case 'GuardianWeeklyDomestic':
		case 'GuardianWeeklyRestOfWorld': {
			const guardianWeeklyDeliveryDate = getWeeklyDays();
			const publicationStartDays = guardianWeeklyDeliveryDate.filter((day) => {
				const invalidPublicationDates = ['-12-24', '-12-25', '-12-30'];
				const date = formatMachineDate(day);
				return !invalidPublicationDates.some((dateSuffix) =>
					date.endsWith(dateSuffix),
				);
			});
			// guardian weekly delivery date array empty check
			if (publicationStartDays[0] === undefined) {
				return undefined;
			}
			return publicationStartDays[0];
		}
		default:
			return undefined;
	}
};

export {
	getWeeklyDays,
	addDays,
	getTierThreeDeliveryDate,
	productDeliveryOrStartDate,
};
