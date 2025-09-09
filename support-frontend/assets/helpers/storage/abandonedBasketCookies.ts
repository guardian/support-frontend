import { useEffect } from 'react';
import { z } from 'zod';
import type { ActiveProductKey } from 'helpers/productCatalog';
import * as cookie from 'helpers/storage/cookie';
import { logException } from 'helpers/utilities/logger';

const COOKIE_EXPIRY_DAYS = 3;
const ABANDONED_BASKET_COOKIE_NAME = 'GU_CO_INCOMPLETE';

const abandonedBasketSchema = z.object({
	product: z.string(),
	amount: z.union([z.number(), z.literal('other')]),
	billingPeriod: z.string(),
	region: z.string(),
});

type AbandonedBasket = z.infer<typeof abandonedBasketSchema>;

export function useAbandonedBasketCookie(
	product: ActiveProductKey,
	amount: number,
	billingPeriod: string,
	region: string,
	inAbandonedBasketVariant: boolean,
) {
	const abandonedBasket = {
		product,
		amount: parseAmount(amount),
		billingPeriod: billingPeriod.toUpperCase(),
		region,
	};

	// support-dotcom-components can only return a user to the checkout for these products
	// don't drop the cookie if they came from a different checkout
	const isSupportedProduct =
		product === 'Contribution' ||
		product === 'SupporterPlus' ||
		product === 'OneTimeContribution';

	useEffect(() => {
		if (inAbandonedBasketVariant && isSupportedProduct) {
			cookie.set(
				ABANDONED_BASKET_COOKIE_NAME,
				JSON.stringify(abandonedBasket),
				COOKIE_EXPIRY_DAYS,
			);
		}
	}, []);
}

function parseAmount(amount: number): number | 'other' {
	return isNaN(amount) ? 'other' : amount;
}

export function updateAbandonedBasketCookie(amount: string) {
	const abandonedBasketCookie = cookie.get(ABANDONED_BASKET_COOKIE_NAME);
	if (!abandonedBasketCookie) {
		return;
	}

	const parsedCookie = abandonedBasketSchema.safeParse(
		JSON.parse(abandonedBasketCookie),
	);

	if (parsedCookie.success) {
		const newCookie: AbandonedBasket = {
			...parsedCookie.data,
			amount: parseAmount(Number.parseFloat(amount)),
		};

		cookie.set(
			ABANDONED_BASKET_COOKIE_NAME,
			JSON.stringify(newCookie),
			COOKIE_EXPIRY_DAYS,
		);
	} else {
		logException(
			`Failed to parse abandoned basket cookie. Error:
			${JSON.stringify(parsedCookie.error)}`,
		);
	}
}
