import { ErrorSummary } from '@guardian/source-react-components-development-kitchen';
import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import { useContributionsSelector } from 'helpers/redux/storeHooks';

export function PaymentFailureMessage(): JSX.Element | null {
	const paymentError = useContributionsSelector(
		(state) => state.page.form.paymentError,
	);

	if (paymentError) {
		return (
			<div role="alert">
				<ErrorSummary
					message="Sorry, something went wrong"
					context={appropriateErrorMessage(paymentError)}
				/>
			</div>
		);
	}

	return null;
}
