import { useEffect } from 'react';
import AnimatedDots from 'components/spinners/animatedDots';
import { usePayPal } from 'helpers/customHooks/usePayPal';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { contributionsFormHasErrors } from 'helpers/redux/selectors/formValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { PayPalButtonRecurringContainer } from './payPalRecurringContainer';

// This is a duplicate of the standard S+ PayPal button that only returns the recurring payment Paypal interface
// This should be able to be removed once we can properly separate product type/contribution type from payment frequency
export function DigiSubPayPalPaymentButton(): JSX.Element {
	const payPalHasLoaded = usePayPal();

	const dispatch = useContributionsDispatch();
	const errorsPreventSubmission = useContributionsSelector(
		contributionsFormHasErrors,
	);

	useEffect(() => {
		dispatch(validateForm('PayPal'));
	}, []);

	if (!payPalHasLoaded) {
		return <AnimatedDots appearance="dark" />;
	}

	return <PayPalButtonRecurringContainer disabled={errorsPreventSubmission} />;
}
