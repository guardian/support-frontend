import AnimatedDots from 'components/spinners/animatedDots';
import { usePayPal } from 'helpers/customHooks/usePayPal';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { contributionsFormHasErrors } from 'helpers/redux/selectors/formValidation';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { PayPalButtonRecurringContainer } from './payPalRecurringContainer';

export function PayPalPaymentButton(): JSX.Element {
	const payPalHasLoaded = usePayPal();

	const contributionType = useContributionsSelector(getContributionType);
	const errorsPreventSubmission = useContributionsSelector(
		contributionsFormHasErrors,
	);

	if (payPalHasLoaded && contributionType !== 'ONE_OFF') {
		return (
			<PayPalButtonRecurringContainer disabled={errorsPreventSubmission} />
		);
	}
	return <AnimatedDots appearance="dark" />;
}
