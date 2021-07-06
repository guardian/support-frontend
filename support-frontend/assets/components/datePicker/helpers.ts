import { DateUtils } from 'react-day-picker';
import { monthText } from 'pages/paper-subscription-checkout/helpers/subsCardDays';
import { daysFromNowForGift } from 'pages/digital-subscription-checkout/components/helpers';

const getRange = () => {
	const rangeDate = new Date();
	rangeDate.setDate(rangeDate.getDate() + daysFromNowForGift);
	return rangeDate;
};

const getLatestAvailableDateText = () => {
	const rangeDate = getRange();
	return `${rangeDate.getDate()} ${
		monthText[rangeDate.getMonth()]
	} ${rangeDate.getFullYear()}`;
};

const dateIsOutsideRange = (date: Date) => {
	const rangeDate = getRange();
	return DateUtils.isDayAfter(date, rangeDate);
};

export { dateIsOutsideRange, getRange, getLatestAvailableDateText };
