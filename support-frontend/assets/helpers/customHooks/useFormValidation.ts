import { useCallback, useEffect, useState } from 'react';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { contributionsFormHasErrors } from 'helpers/redux/selectors/formValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { paymentWaiting } from 'pages/contributions-landing/contributionsLandingActions';

type PreventableEvent = {
	preventDefault: () => void;
};

/**
 * A hook to wrap any payment handler function.
 * Validates the form, and will only run the handler if the form is valid.
 */
export function useFormValidation<
	EventType extends PreventableEvent = React.MouseEvent<HTMLButtonElement>,
>(paymentHandler: (event: EventType) => void): (event: EventType) => void {
	const [clickEvent, setClickEvent] = useState<EventType | null>(null);
	const dispatch = useContributionsDispatch();
	const { paymentMethod } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment,
	);
	const errorsPreventSubmission = useContributionsSelector(
		contributionsFormHasErrors,
	);

	const validateAndPay = useCallback(
		function validateAndPay(event: EventType) {
			event.preventDefault();
			dispatch(validateForm(paymentMethod.name));
			setClickEvent(event);
		},
		[dispatch],
	);

	useEffect(() => {
		if (errorsPreventSubmission) {
			setClickEvent(null);
			return;
		}
		if (clickEvent) {
			dispatch(paymentWaiting(true));
			paymentHandler(clickEvent);
		}
	}, [clickEvent, errorsPreventSubmission]);

	return validateAndPay;
}
