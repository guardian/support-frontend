import {
	getDeliveryDays,
	getNextDeliveryDay,
	numberOfWeeksWeDeliverTo,
} from 'helpers/subscriptionsForms/deliveryDays';
import { formatUserDate } from 'helpers/utilities/dateConversions';

const extraDelayCutoffWeekday = 3;
const normalDelayWeeks = 1;
const extraDelayWeeks = 2;

const getWeeklyDays = (today: number | null | undefined): Date[] => {
	const now = new Date(today || new Date().getTime());
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

function getDisplayDays(): string[] {
	const today = new Date().getTime();
	return getWeeklyDays(today).map((day) => formatUserDate(day));
}

export { getWeeklyDays, getDisplayDays };
