import type {
	StripeCardCvcElementChangeEvent,
	StripeCardExpiryElementChangeEvent,
	StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js';
import { setBillingPostcode } from 'helpers/redux/checkout/address/actions';
import { setStripeFormError } from 'helpers/redux/checkout/payment/stripe/actions';
import type { StripeField } from 'helpers/redux/checkout/payment/stripe/state';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { getStripeCardFormErrors } from './selectors';
import { StripeCardForm } from './stripeCardForm';

type StripeChangeEvents = {
	cardNumber: StripeCardNumberElementChangeEvent;
	expiry: StripeCardExpiryElementChangeEvent;
	cvc: StripeCardCvcElementChangeEvent;
};

export function StripeCardFormContainer(): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { errors, showErrors } = useContributionsSelector(
		getStripeCardFormErrors,
	);
	const zipCode = useContributionsSelector(
		(state) => state.page.checkoutForm.billingAddress.fields.postCode,
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

	function onZipCodeChange(newZipCode: string) {
		dispatch(setBillingPostcode(newZipCode));
	}

	return (
		<StripeCardForm
			onCardNumberChange={onCardFieldChange('cardNumber')}
			onExpiryChange={onCardFieldChange('expiry')}
			onCvcChange={onCardFieldChange('cvc')}
			onZipCodeChange={onZipCodeChange}
			zipCode={zipCode ?? ''}
			showZipCode={showZipCode}
			errors={showErrors ? errors : {}}
		/>
	);
}
