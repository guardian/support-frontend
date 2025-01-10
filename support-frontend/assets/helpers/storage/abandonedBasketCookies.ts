import { useEffect } from 'react';
import type { InferInput } from 'valibot';
import {
	flatten,
	literal,
	number,
	object,
	safeParse,
	string,
	union,
} from 'valibot';
import type { ProductKey } from 'helpers/productCatalog';
import * as cookie from 'helpers/storage/cookie';
import { logException } from 'helpers/utilities/logger';

const COOKIE_EXPIRY_DAYS = 3;
const ABANDONED_BASKET_COOKIE_NAME = 'GU_CO_INCOMPLETE';

const abandonedBasketSchema = object({
	product: string(),
	amount: union([number(), literal('other')]),
	billingPeriod: string(),
	region: string(),
});

type AbandonedBasket = InferInput<typeof abandonedBasketSchema>;

export function useAbandonedBasketCookie(
	product: ProductKey,
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
		product === 'Contribution' || product === 'SupporterPlus';

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

	const parsedCookie = safeParse(
		abandonedBasketSchema,
		JSON.parse(abandonedBasketCookie),
	);

	if (parsedCookie.success) {
		const newCookie: AbandonedBasket = {
			...parsedCookie.output,
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
			${JSON.stringify(flatten(parsedCookie.issues))}`,
		);
	}
}

export function deleteAbandonedBasketCookie() {
	cookie.remove(ABANDONED_BASKET_COOKIE_NAME);
}
