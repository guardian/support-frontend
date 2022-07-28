// ----- Imports ----- //
import { InlineError, TextInput } from '@guardian/source-react-components';
import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
} from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/react-stripe-js';
import type { PaymentIntentResult, StripeError } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import * as React from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import QuestionMarkHintIcon from 'components/svgs/questionMarkHintIcon';
import { usePrevious } from 'helpers/customHooks/usePrevious';
import { useRecaptchaV2 } from 'helpers/customHooks/useRecaptcha';
import { isValidZipCode } from 'helpers/forms/formValidation';
import type { StripePaymentIntentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/forms/paymentMethods';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	expireRecaptchaToken,
	setRecaptchaToken,
} from 'helpers/redux/checkout/recaptcha/actions';
import {
	onThirdPartyPaymentAuthorised,
	paymentFailure,
	paymentWaiting as setPaymentWaiting,
	setStripeCardFormComplete,
	setStripeSetupIntentClientSecret,
} from 'pages/contributions-landing/contributionsLandingActions';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import { CreditCardIcons } from './CreditCardIcons';
import {
	logCreatePaymentMethodError,
	logCreateSetupIntentError,
} from './helpers/logging';
import { createStripeSetupIntent } from './helpers/stripe';
import { styles } from './helpers/styles';
import {
	trackRecaptchaClientTokenReceived,
	trackStripe3ds,
} from './helpers/tracking';
import { StripeCardFormField } from './StripeCardFormField';
import { useCardFormFieldStates } from './useCardFormFieldStates';
import { useSelectedField } from './useSelectedField';
import { VerificationCopy } from './VerificationCopy';
import './stripeCardForm.scss';

// ----- Redux -----//

const mapStateToProps = (state: State) => ({
	contributionType: getContributionType(state),
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
	paymentWaiting: state.page.form.isWaiting,
	country: state.common.internationalisation.countryId,
	currency: state.common.internationalisation.currencyId,
	countryGroupId: state.common.internationalisation.countryGroupId,
	csrf: state.page.checkoutForm.csrf,
	setupIntentClientSecret:
		state.page.form.stripeCardFormData.setupIntentClientSecret,
	recaptchCompleted: state.page.checkoutForm.recaptcha.completed,
	formIsSubmittable: state.page.form.formIsSubmittable,
	isTestUser: state.page.user.isTestUser ?? false,
});

const mapDispatchToProps = {
	onPaymentAuthorised: onThirdPartyPaymentAuthorised,
	paymentFailure,
	setStripeCardFormComplete,
	setPaymentWaiting,
	setStripeSetupIntentClientSecret,
	setRecaptchaToken,
	expireRecaptchaToken,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

// ----- Component -----//

interface PropsFromParent {
	stripeKey: string;
	setCreateStripePaymentMethod: (
		create: (clientSecret: string | null) => void,
	) => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;

type PropTypes = PropsFromRedux & PropsFromParent;

function getStripePaymentIntentAuthorisation(
	paymentMethodId: string,
	handle3DS?: (clientSecret: string) => Promise<PaymentIntentResult>,
): StripePaymentIntentAuthorisation {
	return {
		paymentMethod: Stripe,
		stripePaymentMethod: 'StripeCheckout',
		paymentMethodId,
		handle3DS,
	};
}

function CardForm(props: PropTypes) {
	const stripe = stripeJs.useStripe();
	const elements = stripeJs.useElements();

	const { fieldStates, onFieldChange, errorMessage } = useCardFormFieldStates();

	const { selectedField, selectField, clearSelectedField } = useSelectedField();

	const [zipCode, setZipCode] = useState('');

	const { recaptchaEnabled } = useRecaptchaV2(
		'robot_checkbox',
		(token: string) => {
			trackRecaptchaClientTokenReceived();
			props.setRecaptchaToken(token);

			createStripeSetupIntent(
				token,
				props.stripeKey,
				props.isTestUser,
				props.csrf,
			)
				.then((clientSecret) => {
					props.setStripeSetupIntentClientSecret(clientSecret);
				})
				.catch((err: Error) => {
					logCreateSetupIntentError(err);
					props.paymentFailure('internal_error');
					props.setPaymentWaiting(false);
				});
		},
		props.expireRecaptchaToken,
	);

	const showZipCodeField = props.country === 'US';

	const updateZipCode = (event: React.ChangeEvent<HTMLInputElement>) =>
		setZipCode(event.target.value);

	const handleStripeError = (errorData: StripeError): void => {
		props.setPaymentWaiting(false);
		logCreatePaymentMethodError(errorData);

		if (errorData.type === 'validation_error') {
			// This shouldn't be possible as we disable the submit button until all fields are valid, but if it does
			// happen then display a generic error about card details
			props.paymentFailure('payment_details_incorrect');
		} else {
			// This is probably a Stripe or network problem
			props.paymentFailure('payment_provider_unavailable');
		}
	};

	const handleCardSetupForRecurring = (clientSecret: string): void => {
		const cardElement = elements?.getElement(CardNumberElement);

		if (stripe && cardElement) {
			void stripe
				.confirmCardSetup(clientSecret, {
					payment_method: {
						card: cardElement,
						billing_details: {
							address: {
								postal_code: zipCode,
							},
						},
					},
				})
				.then((result) => {
					if (result.error) {
						handleStripeError(result.error);
					} else if (result.setupIntent.payment_method) {
						void props.onPaymentAuthorised(
							getStripePaymentIntentAuthorisation(
								result.setupIntent.payment_method,
							),
						);
					}
				});
		}
	};

	const setupRecurringHandlers = (): void => {
		props.setCreateStripePaymentMethod((clientSecret: string | null) => {
			props.setPaymentWaiting(true);

			// Recaptcha verification is required for setupIntent creation.
			// If setupIntentClientSecret is ready then complete the payment now.
			// If setupIntentClientSecret is not ready we handle it in a `useEffect` hook.
			if (clientSecret) {
				handleCardSetupForRecurring(clientSecret);
			}
		});
	};

	const handleCreatePaymentForOneOff = (): void => {
		const cardElement = elements?.getElement(CardNumberElement);

		if (stripe && cardElement) {
			const handle3DS = (clientSecret: string) => {
				trackStripe3ds();
				return stripe.handleCardAction(clientSecret);
			};

			void stripe
				.createPaymentMethod({
					type: 'card',
					card: cardElement,
					billing_details: {
						address: {
							postal_code: zipCode,
						},
					},
				})
				.then((result) => {
					if (result.error) {
						handleStripeError(result.error);
					} else {
						void props.onPaymentAuthorised(
							getStripePaymentIntentAuthorisation(
								result.paymentMethod.id,
								handle3DS,
							),
						);
					}
				});
		}
	};

	const setupOneOffHandlers = (): void => {
		props.setCreateStripePaymentMethod(() => {
			props.setPaymentWaiting(true);

			handleCreatePaymentForOneOff();
		});
	};

	useEffect(() => {
		if (stripe && elements) {
			if (props.contributionType === 'ONE_OFF') {
				setupOneOffHandlers();
			} else {
				setupRecurringHandlers();
			}
		}
	}, [stripe, elements, props.contributionType, zipCode]);

	// We keep track of the previous setup intent secret for the case that a
	// user clicks 'contribute' before the secret has loaded. In that case,
	// we don't handle the card setup in the recurring handler (we need the secret for that)
	// but instead handle it in a useEffect hook. The hook checks if the secret has
	// just been defined (i.e the previous secret wasn't defined but the current one is)
	// and that the payment is waiting (i.e the user clicked 'contribute') and then
	// handles the card setup.
	const previousSetupIntentClientSecret = usePrevious(
		props.setupIntentClientSecret,
	);

	useEffect(() => {
		const clientSecretHasUpdated =
			!previousSetupIntentClientSecret && props.setupIntentClientSecret;

		if (
			props.paymentWaiting &&
			clientSecretHasUpdated &&
			props.setupIntentClientSecret
		) {
			handleCardSetupForRecurring(props.setupIntentClientSecret);
		}
	}, [props.setupIntentClientSecret]);

	const isZipCodeFieldValid = showZipCodeField ? isValidZipCode(zipCode) : true;

	const showZipCodeError =
		props.checkoutFormHasBeenSubmitted && !isZipCodeFieldValid;

	useEffect(() => {
		const formIsComplete =
			fieldStates.CardNumber.name === 'Complete' &&
			fieldStates.Expiry.name === 'Complete' &&
			fieldStates.CVC.name === 'Complete' &&
			isZipCodeFieldValid;
		props.setStripeCardFormComplete(formIsComplete);
	}, [fieldStates, zipCode]);

	return (
		<div>
			<legend className="form__legend">
				<h3>Your card details</h3>
			</legend>

			{props.checkoutFormHasBeenSubmitted && errorMessage && (
				<InlineError> {errorMessage} </InlineError>
			)}

			<StripeCardFormField
				label={
					<>
						<label htmlFor="stripeCardNumberElement">Card number</label>
						<CreditCardIcons country={props.country} />
					</>
				}
				input={
					<CardNumberElement
						id="stripeCardNumberElement"
						options={{
							style: styles.stripeField,
						}}
						onChange={onFieldChange('CardNumber')}
						onFocus={selectField('CardNumber')}
						onBlur={clearSelectedField}
					/>
				}
				error={fieldStates.CardNumber.name === 'Error'}
				focus={selectedField === 'CardNumber'}
			/>

			<div className="ds-stripe-card-input__expiry-security-container">
				<div className="ds-stripe-card-input__expiry">
					<StripeCardFormField
						label={<label htmlFor="stripeCardExpiryElement">Expiry date</label>}
						hint={
							<div className="ds-stripe-card-input__expiry-hint">MM / YY</div>
						}
						input={
							<CardExpiryElement
								id="stripeCardExpiryElement"
								options={{
									style: styles.stripeField,
								}}
								onChange={onFieldChange('Expiry')}
								onFocus={selectField('Expiry')}
								onBlur={clearSelectedField}
							/>
						}
						error={fieldStates.Expiry.name === 'Error'}
						focus={selectedField === 'Expiry'}
					/>
				</div>

				<div className="ds-stripe-card-input__security-code">
					<StripeCardFormField
						label={<label htmlFor="stripeCardCVCElement">Security code</label>}
						hint={
							<div className="ds-stripe-card-input__security-code-hint">
								<div className="ds-stripe-card-input__security-code-hint-icon">
									<QuestionMarkHintIcon />
								</div>
								<div className="ds-stripe-card-input__security-code-hint-tooltip">
									<p className="ds-stripe-card-input__security-code-hint-tooltip-heading">
										What&apos;s this?
									</p>
									<p>
										The last three digits on the back of your card, above the
										signature
									</p>
								</div>
							</div>
						}
						input={
							<CardCvcElement
								id="stripeCardCVCElement"
								options={{
									style: styles.stripeField,
								}}
								onChange={onFieldChange('CVC')}
								onFocus={selectField('CVC')}
								onBlur={clearSelectedField}
							/>
						}
						error={fieldStates.CVC.name === 'Error'}
						focus={selectedField === 'CVC'}
					/>
				</div>
			</div>

			{showZipCodeField && (
				<div css={styles.zipCodeContainer}>
					<TextInput
						id="contributionZipCode"
						name="contribution-zip-code"
						label="ZIP code"
						value={zipCode}
						onChange={updateZipCode}
						error={showZipCodeError ? 'Please enter a valid ZIP code' : ''}
					/>
				</div>
			)}

			{recaptchaEnabled ? (
				<div className="ds-security-check">
					<div className="ds-security-check__label">
						<label htmlFor="robot_checkbox">Security check</label>
					</div>
					{props.checkoutFormHasBeenSubmitted && !props.recaptchCompleted && (
						<VerificationCopy
							countryGroupId={props.countryGroupId}
							contributionType={props.contributionType}
						/>
					)}
					<Recaptcha />
				</div>
			) : null}
		</div>
	);
}

// ----- Exports -----//

export default connector(CardForm);
