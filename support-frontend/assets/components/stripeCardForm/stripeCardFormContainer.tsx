import type {
	StripeCardCvcElementChangeEvent,
	StripeCardExpiryElementChangeEvent,
	StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import { setBillingPostcode } from 'helpers/redux/checkout/address/actions';
import { setStripeFormError } from 'helpers/redux/checkout/payment/stripe/actions';
import type { StripeField } from 'helpers/redux/checkout/payment/stripe/state';
import { getStripeSetupIntent } from 'helpers/redux/checkout/payment/stripe/thunks';
import {
	expireRecaptchaToken,
	setRecaptchaToken,
} from 'helpers/redux/checkout/recaptcha/actions';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { logCreateSetupIntentError } from 'pages/contributions-landing/components/StripeCardForm/helpers/logging';
import {
	paymentFailure,
	paymentWaiting,
} from 'pages/supporter-plus-landing/legacyActionCreators';
import { getDisplayErrors } from './selectors';
import { StripeCardForm } from './stripeCardForm';

type StripeChangeEvents = {
	cardNumber: StripeCardNumberElementChangeEvent;
	expiry: StripeCardExpiryElementChangeEvent;
	cvc: StripeCardCvcElementChangeEvent;
};

export function StripeCardFormContainer(): JSX.Element {
	const dispatch = useContributionsDispatch();

	const { errors, showErrors } = useContributionsSelector(getDisplayErrors);
	const zipCode = useContributionsSelector(
		(state) => state.page.checkoutForm.billingAddress.fields.postCode,
	);
	const showZipCode = useContributionsSelector(
		(state) => state.common.internationalisation.countryId === 'US',
	);
	const { publicKey, stripeAccount } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.stripeAccountDetails,
	);
	const { isTestUser } = useContributionsSelector((state) => state.page.user);

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

	function onRecaptchaCompleted(token: string) {
		trackComponentLoad('contributions-recaptcha-client-token-received');
		dispatch(setRecaptchaToken(token));

		if (stripeAccount === 'REGULAR') {
			dispatch(
				getStripeSetupIntent({
					token,
					stripePublicKey: publicKey,
					isTestUser: isTestUser ?? false,
				}),
			).catch((err: Error) => {
				logCreateSetupIntentError(err);
				dispatch(paymentFailure('internal_error'));
				dispatch(paymentWaiting(false));
			});
		}
	}

	return (
		<StripeCardForm
			onCardNumberChange={onCardFieldChange('cardNumber')}
			onExpiryChange={onCardFieldChange('expiry')}
			onCvcChange={onCardFieldChange('cvc')}
			onZipCodeChange={onZipCodeChange}
			zipCode={zipCode}
			showZipCode={showZipCode}
			errors={showErrors ? errors : {}}
			recaptcha={
				<Recaptcha
					onRecaptchaCompleted={onRecaptchaCompleted}
					onRecaptchaExpired={() => dispatch(expireRecaptchaToken())}
				/>
			}
		/>
	);
}
