import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { setPopupOpen } from 'helpers/redux/checkout/payment/directDebit/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { PaymentButtonComponentProps } from './paymentButtonController';

export function DirectDebitPaymentButton({
	DefaultButtonContainer,
}: PaymentButtonComponentProps): JSX.Element {
	const dispatch = useContributionsDispatch();
	const { paymentMethod } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment,
	);

	const payWithDirectDebit = useFormValidation(function openDDForm() {
		dispatch(setPopupOpen());
	}, paymentMethod.name !== 'DirectDebit');

	return <DefaultButtonContainer onClick={payWithDirectDebit} />;
}
