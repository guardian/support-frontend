import { useEffect } from 'react';
import type { ProductKey } from 'helpers/productCatalog';
import * as cookie from 'helpers/storage/cookie';

const COOKIE_EXPIRY_DAYS = 3;
const ABANDONED_BASKET_COOKIE_NAME = 'GU_CO_INCOMPLETE';

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

export function deleteAbandonedBasketCookie() {
	cookie.remove(ABANDONED_BASKET_COOKIE_NAME);
}
