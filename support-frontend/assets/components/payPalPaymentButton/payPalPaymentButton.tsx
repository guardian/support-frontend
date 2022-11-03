import { useEffect } from 'preact/hooks';
import AnimatedDots from 'components/spinners/animatedDots';
import { usePayPal } from 'helpers/customHooks/usePayPal';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { contributionsFormHasErrors } from 'helpers/redux/selectors/formValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { PayPalButtonOneOffContainer } from './payPalOneOffContainer';
import { PayPalButtonRecurringContainer } from './payPalRecurringContainer';

export function PayPalPaymentButton(): JSX.Element {
	const payPalHasLoaded = usePayPal();

	const dispatch = useContributionsDispatch();
	const contributionType = useContributionsSelector(getContributionType);
	const errorsPreventSubmission = useContributionsSelector(
		contributionsFormHasErrors,
	);

	useEffect(() => {
		dispatch(validateForm('PayPal'));
	}, []);

	if (!payPalHasLoaded) {
		return <AnimatedDots appearance="dark" />;
	}

	if (contributionType !== 'ONE_OFF') {
		return (
			<PayPalButtonRecurringContainer disabled={errorsPreventSubmission} />
		);
	}
	return <PayPalButtonOneOffContainer />;
}
