export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const DeliveryDays = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
};
const milsInADay = 1000 * 60 * 60 * 24;
export const numberOfWeeksWeDeliverTo = 4;

// For the purposes of fulfilment delays we consider the week to start on Monday
// so Sunday (day 0) should be day 7
const jsDayToFulfilmentDay = (day: number) => day || 7;

const getDateOfDeliveryDayInCurrentWeek = (today: number, day: Day): Date => {
	const todayOffset = jsDayToFulfilmentDay(new Date(today).getDay());
	const dayOffset = jsDayToFulfilmentDay(day);
	const diff = dayOffset - todayOffset;
	return new Date(today + diff * milsInADay);
};

const getNextDeliveryDay = (previousDeliveryDay: Date) =>
	new Date(previousDeliveryDay.getTime() + 7 * milsInADay);

const getDeliveryDays = (
	today: number,
	day: Day,
	length: number = numberOfWeeksWeDeliverTo,
): Date[] => {
	const initial = getDateOfDeliveryDayInCurrentWeek(today, day);
	const deliveryDays = [initial];

	for (let i = 1; i <= length; i += 1) {
		deliveryDays.push(getNextDeliveryDay(deliveryDays[i - 1]));
	}

	return deliveryDays;
};

export {
	jsDayToFulfilmentDay,
	getDeliveryDays,
	getNextDeliveryDay,
	DeliveryDays,
};
