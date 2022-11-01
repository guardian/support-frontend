import { useFormValidation } from 'helpers/customHooks/useFormValidation';
import { setPopupOpen } from 'helpers/redux/checkout/payment/directDebit/actions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { DefaultPaymentButtonContainer } from './defaultPaymentButtonContainer';

export function DirectDebitPaymentButton(): JSX.Element {
	const dispatch = useContributionsDispatch();

	const payWithDirectDebit = useFormValidation(function openDDForm() {
		dispatch(setPopupOpen());
	});

	return <DefaultPaymentButtonContainer onClick={payWithDirectDebit} />;
}
