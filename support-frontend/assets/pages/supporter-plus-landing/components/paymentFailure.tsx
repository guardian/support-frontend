import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { NonValidationFailureMessage } from './nonValidationFailureMessage';

export function PaymentFailureMessage(): JSX.Element | null {
	const paymentError = useContributionsSelector(
		(state) => state.page.form.paymentError,
	);

	if (paymentError) {
		return (
			<NonValidationFailureMessage message="Sorry, something went wrong">
				{appropriateErrorMessage(paymentError)}
			</NonValidationFailureMessage>
		);
	}

	return null;
}
