import { useEffect } from 'react';
import * as cookie from 'helpers/storage/cookie';
import type { ProductCheckout } from 'helpers/tracking/behaviour';

const COOKIE_EXPIRY_DAYS = 3;
const ABANDONED_BASKET_COOKIE_NAME = 'GU_CO_INCOMPLETE';

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
