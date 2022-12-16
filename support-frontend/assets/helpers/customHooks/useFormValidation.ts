import type { PayloadAction } from '@reduxjs/toolkit';
import { useCallback, useEffect, useState } from 'react';
import { validateForm } from 'helpers/redux/checkout/checkoutActions';
import { validateOtherAmount } from 'helpers/redux/checkout/product/actions';
import { contributionsFormHasErrors } from 'helpers/redux/selectors/formValidation';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { paymentWaiting } from 'pages/supporter-plus-landing/legacyActionCreators';

type PreventableEvent = {
	preventDefault: () => void;
};

function useValidation<
	EventType extends PreventableEvent = React.MouseEvent<HTMLButtonElement>,
>(
	paymentHandler: (event: EventType) => void,
	validationActionCreator: () => PayloadAction<unknown>,
	dispatchPaymentWaiting = true,
): (event: EventType) => void {
	const [clickEvent, setClickEvent] = useState<EventType | null>(null);
	const dispatch = useContributionsDispatch();

	const errorsPreventSubmission = useContributionsSelector(
		contributionsFormHasErrors,
	);

	const validateAndPay = useCallback(
		function validateAndPay(event: EventType) {
			event.preventDefault();
			dispatch(validationActionCreator());
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
			dispatchPaymentWaiting && dispatch(paymentWaiting(true));

			paymentHandler(clickEvent);
		}
	}, [clickEvent, errorsPreventSubmission]);

	return validateAndPay;
}

/**
 * A hook to wrap any payment handler function.
 * Validates the form, and will only run the handler if the form is valid.
 */
export function useFormValidation<
	EventType extends PreventableEvent = React.MouseEvent<HTMLButtonElement>,
>(
	paymentHandler: (event: EventType) => void,
	dispatchPaymentWaiting = true,
): (event: EventType) => void {
	const { paymentMethod } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment,
	);

	const validateAndPay = useValidation(
		paymentHandler,
		() => validateForm(paymentMethod.name),
		dispatchPaymentWaiting,
	);

	return validateAndPay;
}

/**
 * A hook to wrap any payment handler function.
 * Validates the other amount field *only*, and will only run the handler if the form is valid.
 */
export function useOtherAmountValidation<
	EventType extends PreventableEvent = React.MouseEvent<HTMLButtonElement>,
>(
	paymentHandler: (event: EventType) => void,
	dispatchPaymentWaiting = true,
): (event: EventType) => void {
	const validateAndPay = useValidation(
		paymentHandler,
		validateOtherAmount,
		dispatchPaymentWaiting,
	);

	return validateAndPay;
}
