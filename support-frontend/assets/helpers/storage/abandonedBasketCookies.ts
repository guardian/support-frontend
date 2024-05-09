import { useEffect } from 'react';
import type {
	Input} from 'valibot';
import {
	literal,
	number,
	object,
	safeParse,
	string,
	union,
} from 'valibot';
import * as cookie from 'helpers/storage/cookie';
import type { ProductCheckout } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';

const COOKIE_EXPIRY_DAYS = 3;
const ABANDONED_BASKET_COOKIE_NAME = 'GU_CO_INCOMPLETE';

const abandonedBasketSchema = object({
	product: string(),
	amount: union([number(), literal('other')]),
	billingPeriod: string(),
	region: string(),
});

type AbandonedBasket = Input<typeof abandonedBasketSchema>;

export function useAbandonedBasketCookie(
	product: ProductCheckout,
	amount: number | 'other',
	billingPeriod: string,
	region: string,
) {
	const abandonedBasket = {
		product,
		amount,
		billingPeriod,
		region,
	};

	useEffect(() => {
		cookie.set(
			ABANDONED_BASKET_COOKIE_NAME,
			JSON.stringify(abandonedBasket),
			COOKIE_EXPIRY_DAYS,
		);
	}, []);
}

function parseAmount(amount: string): number | 'other' {
	return amount === 'other' || amount === ''
		? 'other'
		: Number.parseFloat(amount);
}

export function updateAbandonedBasketCookie(amount: string) {
	const abandonedBasketCookie = cookie.get(ABANDONED_BASKET_COOKIE_NAME);
	if (!abandonedBasketCookie) return;

	const parsedCookie = safeParse(
		abandonedBasketSchema,
		JSON.parse(abandonedBasketCookie),
	);

	if (parsedCookie.success) {
		const newCookie: AbandonedBasket = {
			...parsedCookie.output,
			amount: parseAmount(amount),
		};

		cookie.set(
			ABANDONED_BASKET_COOKIE_NAME,
			JSON.stringify(newCookie),
			COOKIE_EXPIRY_DAYS,
		);
	} else {
		logException(
			`Failed to parse abandoned basket cookie. Error:
			${parsedCookie.issues.toString()}`,
		);
	}
}
