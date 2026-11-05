import { roundAmount } from 'helpers/forms/checkouts';

export function annualToMonthly(annualPrice: number) {
	return roundAmount(annualPrice / 12);
}

export function quarterlyToMonthly(quarterlyPrice: number) {
	return roundAmount(quarterlyPrice / 3);
}
