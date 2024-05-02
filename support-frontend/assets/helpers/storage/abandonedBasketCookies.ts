import { useEffect } from 'react';
import * as cookie from 'helpers/storage/cookie';

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
		cookie.set('GU_CO_INCOMPLETE', JSON.stringify(abandonedBasket), cookieExpiryDays)
	}, []);
}