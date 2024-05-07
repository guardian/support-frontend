import { useEffect } from 'react';
import * as cookie from 'helpers/storage/cookie';

const COOKIE_EXPIRY_DAYS = 3;

export function useAbandonedBasketCookie(
	product: string,
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
			'GU_CO_INCOMPLETE',
			JSON.stringify(abandonedBasket),
			COOKIE_EXPIRY_DAYS,
		);
	}, []);
}
