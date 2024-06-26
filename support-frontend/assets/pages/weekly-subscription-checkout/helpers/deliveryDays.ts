import {
	getDeliveryDays,
	getNextDeliveryDay,
	numberOfWeeksWeDeliverTo,
} from 'helpers/subscriptionsForms/deliveryDays';

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
		nonChrismassy.push(
			getNextDeliveryDay(nonChrismassy[nonChrismassy.length - 1]),
		);
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

export { getWeeklyDays, addDays, getTierThreeDeliveryDate };
