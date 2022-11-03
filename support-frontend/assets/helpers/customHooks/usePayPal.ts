import { useEffect } from 'preact/hooks';
import { loadPayPalExpressSdk } from 'helpers/redux/checkout/payment/payPal/thunks';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';

export function usePayPal(): boolean {
	const dispatch = useContributionsDispatch();
	const { hasLoaded, hasBegunLoading } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.payPal,
	);

	useEffect(() => {
		if (!hasBegunLoading) {
			void dispatch(loadPayPalExpressSdk());
		}
	}, []);

	return hasLoaded;
}
