import { DateUtils } from 'react-day-picker';
import { monthText } from 'pages/paper-subscription-checkout/helpers/subsCardDays';

const daysFromNowForGift = 89;

const getRange = (): Date => {
	const rangeDate = new Date();
	rangeDate.setDate(rangeDate.getDate() + daysFromNowForGift);
	return rangeDate;
};

const getLatestAvailableDateText = (): string => {
	const rangeDate = getRange();
	return `${rangeDate.getDate()} ${
		monthText[rangeDate.getMonth()]
	} ${rangeDate.getFullYear()}`;
};

const dateIsOutsideRange = (date: Date): boolean => {
	const rangeDate = getRange();
	const startDate = new Date();
	return (
		DateUtils.isDayAfter(date, rangeDate) ||
		DateUtils.isDayBefore(date, startDate)
	);
};

export {
	dateIsOutsideRange,
	daysFromNowForGift,
	getRange,
	getLatestAvailableDateText,
};
