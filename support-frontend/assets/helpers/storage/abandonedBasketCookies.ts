import { useEffect } from 'react';
import { z } from 'zod';
import * as cookie from 'helpers/storage/cookie';
import type { ProductCheckout } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';

const COOKIE_EXPIRY_DAYS = 3;
const ABANDONED_BASKET_COOKIE_NAME = 'GU_CO_INCOMPLETE';

const abandonedBasketSchema = z.object({
	product: z.string(),
	amount: z.number(),
	billingPeriod: z.string(),
	region: z.string(),
});

//type AbandonedBasket = z.infer<typeof abandonedBasketSchema>;

export function useAbandonedBasketCookie(
	product: ProductCheckout,
	amount: number,
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

export function updateAbandonedBasketCookie(newAmount: string) {
	const abandonedBasketCookie = cookie.get(ABANDONED_BASKET_COOKIE_NAME);

	if (!abandonedBasketCookie) return;

	const parsedCookie = abandonedBasketSchema.safeParse(
		JSON.parse(abandonedBasketCookie),
	);

	if (parsedCookie.success) {
		const newCookie = { ...parsedCookie.data, amount: newAmount };

		cookie.set(
			ABANDONED_BASKET_COOKIE_NAME,
			JSON.stringify(newCookie),
			COOKIE_EXPIRY_DAYS,
		);
	} else {
		logException(
			`Failed to parse abandoned basket cookie. Error:
			${parsedCookie.error.toString()}`,
		);
	}
}
