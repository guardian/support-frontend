import * as cookie from 'helpers/storage/cookie';
import { useEffect } from 'react';

export function useAbandonedBasketCookie(
	product: string, 
	amount: number, 
	billingPeriod: string, 
	region: string,
    cookieExpiryDays: number
){
	const abandonedBasket = {
		product,
		amount,
		billingPeriod,
		region
	};

	useEffect(() => {
		cookie.set('abandonedBasket', JSON.stringify(abandonedBasket), cookieExpiryDays)
	}, []);
}