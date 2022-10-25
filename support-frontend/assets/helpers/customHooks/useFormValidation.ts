import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { contributionsFormHasErrors } from 'helpers/redux/checkout/checkoutSelectors';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';

export function useFormValidation(
	paymentHandler: (event: React.MouseEvent<HTMLButtonElement>) => void,
): (event: React.MouseEvent<HTMLButtonElement>) => void {
	const dispatch = useContributionsDispatch();

	const errorsPreventSubmission = useContributionsSelector(
		contributionsFormHasErrors,
	);

	return function validateAndPay(event: React.MouseEvent<HTMLButtonElement>) {
		dispatch(validateForm());
		if (errorsPreventSubmission) return;
		paymentHandler(event);
	};
}
