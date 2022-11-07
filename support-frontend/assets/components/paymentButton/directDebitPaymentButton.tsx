import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { setPopupOpen } from 'helpers/redux/checkout/payment/directDebit/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { DefaultPaymentButtonContainer } from './defaultPaymentButtonContainer';

export function DirectDebitPaymentButton(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { paymentMethod } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment,
	);

	const payWithDirectDebit = useFormValidation(function openDDForm() {
		dispatch(setPopupOpen());
	}, paymentMethod.name !== 'DirectDebit');

	return <DefaultPaymentButtonContainer onClick={payWithDirectDebit} />;
}
