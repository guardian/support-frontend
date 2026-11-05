import { roundAmountUp } from 'helpers/forms/checkouts';

export function annualToMonthly(annualPrice: number) {
	return roundAmountUp(annualPrice / 12);
}

export function quarterlyToMonthly(quarterlyPrice: number) {
	return roundAmountUp(quarterlyPrice / 3);
}
