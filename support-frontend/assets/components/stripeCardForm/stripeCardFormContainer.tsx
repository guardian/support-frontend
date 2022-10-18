import type {
	StripeCardCvcElementChangeEvent,
	StripeCardExpiryElementChangeEvent,
	StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js';
import { setStripeFormError } from 'helpers/redux/checkout/payment/stripe/actions';
import type { StripeField } from 'helpers/redux/checkout/payment/stripe/state';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { StripeCardForm } from './stripeCardForm';

type StripeChangeEvents = {
	cardNumber: StripeCardNumberElementChangeEvent;
	expiry: StripeCardExpiryElementChangeEvent;
	cvc: StripeCardCvcElementChangeEvent;
};

export function StripeCardFormContainer(): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { errors } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.stripe,
	);

	const showZipCode = useContributionsSelector(
		(state) => state.common.internationalisation.countryId === 'US',
	);

	function onCardFieldChange(field: StripeField) {
		return function onChange(event: StripeChangeEvents[typeof field]) {
			if (event.error) {
				dispatch(
					setStripeFormError({
						field,
						error: event.error.message,
					}),
				);
			} else {
				dispatch(
					setStripeFormError({
						field,
					}),
				);
			}
		};
	}

	return (
		<StripeCardForm
			onCardNumberChange={onCardFieldChange('cardNumber')}
			onExpiryChange={onCardFieldChange('expiry')}
			onCvcChange={onCardFieldChange('cvc')}
			showZipCode={showZipCode}
			errors={errors}
		/>
	);
}
