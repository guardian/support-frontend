// ----- Imports ----- //
import { css } from '@emotion/react';
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
import type { ThunkDispatch } from 'redux-thunk';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import QuestionMarkHintIcon from 'components/svgs/questionMarkHintIcon';
import { fetchJson, requestOptions } from 'helpers/async/fetch';
import type { ContributionType } from 'helpers/contributions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { usePrevious } from 'helpers/customHooks/usePrevious';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import { isValidZipCode } from 'helpers/forms/formValidation';
import { Stripe } from 'helpers/forms/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { routes } from 'helpers/urls/routes';
import { logException } from 'helpers/utilities/logger';
import type { Action } from 'pages/contributions-landing/contributionsLandingActions';
import {
	onThirdPartyPaymentAuthorised,
	paymentFailure,
	setCreateStripePaymentMethod,
	setHandleStripe3DS,
	paymentWaiting as setPaymentWaiting,
	setStripeCardFormComplete,
	setStripeRecurringRecaptchaVerified,
	setStripeSetupIntentClientSecret,
	updateRecaptchaToken,
} from 'pages/contributions-landing/contributionsLandingActions';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import CreditCardsROW from './creditCardsROW.svg';
import CreditCardsUS from './creditCardsUS.svg';
import { StripeCardFormField } from './StripeCardFormField';
import { useCardFormFieldStates } from './useCardFormFieldStates';
import { useSelectedField } from './useSelectedField';
import './stripeCardForm.scss';

// ----- Redux -----//

const mapStateToProps = (state: State) => ({
	contributionType: state.page.form.contributionType,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
	paymentWaiting: state.page.form.isWaiting,
	country: state.common.internationalisation.countryId,
	currency: state.common.internationalisation.currencyId,
	countryGroupId: state.common.internationalisation.countryGroupId,
	csrf: state.page.csrf,
	setupIntentClientSecret:
		state.page.form.stripeCardFormData.setupIntentClientSecret,
	recurringRecaptchaVerified:
		state.page.form.stripeCardFormData.recurringRecaptchaVerified,
	formIsSubmittable: state.page.form.formIsSubmittable,
	oneOffRecaptchaToken: state.page.form.oneOffRecaptchaToken,
	isTestUser: state.page.user.isTestUser ?? false,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<State, void, Action>) => ({
	onPaymentAuthorised: (paymentMethodId: string) =>
		dispatch(
			onThirdPartyPaymentAuthorised({
				paymentMethod: Stripe,
				stripePaymentMethod: 'StripeCheckout',
				paymentMethodId,
			}),
		),
	paymentFailure: (paymentError: ErrorReason) =>
		dispatch(paymentFailure(paymentError)),
	setCreateStripePaymentMethod: (
		createStripePaymentMethod: (clientSecret: string | null) => void,
	) => dispatch(setCreateStripePaymentMethod(createStripePaymentMethod)),
	setHandleStripe3DS: (
		handleStripe3DS: (clientSecret: string) => Promise<PaymentIntentResult>,
	) => dispatch(setHandleStripe3DS(handleStripe3DS)),
	setStripeCardFormComplete: (isComplete: boolean) =>
		dispatch(setStripeCardFormComplete(isComplete)),
	setPaymentWaiting: (isWaiting: boolean) =>
		dispatch(setPaymentWaiting(isWaiting)),
	setStripeSetupIntentClientSecret: (clientSecret: string) =>
		dispatch(setStripeSetupIntentClientSecret(clientSecret)),
	setOneOffRecaptchaToken: (recaptchaToken: string) =>
		dispatch(updateRecaptchaToken(recaptchaToken)),
	setStripeRecurringRecaptchaVerified: (recaptchaVerified: boolean) =>
		dispatch(setStripeRecurringRecaptchaVerified(recaptchaVerified)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

// ----- Component -----//

interface PropsFromParent {
	stripeKey: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;

type PropTypes = PropsFromRedux & PropsFromParent;

function CardForm(props: PropTypes) {
	const stripe = stripeJs.useStripe();
	const elements = stripeJs.useElements();

	const { fieldStates, onFieldChange, errorMessage } = useCardFormFieldStates();

	const { selectedField, selectField, clearSelectedField } = useSelectedField();

	// Used to avoid calling grecaptcha.render twice when switching between monthly + annual
	const [calledRecaptchaRender, setCalledRecaptchaRender] =
		useState<boolean>(false);

	const [zipCode, setZipCode] = useState('');

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

	// Creates a new setupIntent upon recaptcha verification
	const setupRecurringRecaptchaCallback = () => {
		setCalledRecaptchaRender(true);

		// Fix for safari, where the calledRecaptchaRender state handling does not work.
		// TODO: find a better solution
		if (recaptchaElementNotEmpty()) {
			return;
		}

		window.grecaptcha?.render('robot_checkbox', {
			sitekey: window.guardian.v2recaptchaPublicKey,
			callback: (token: string) => {
				trackRecaptchaClientTokenReceived();
				props.setStripeRecurringRecaptchaVerified(true);

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
		});
	};

	const setupRecurringRecaptcha = (): void => {
		if (window.guardian.recaptchaEnabled) {
			if (window.grecaptcha?.render) {
				setupRecurringRecaptchaCallback();
			} else {
				window.v2OnloadCallback = setupRecurringRecaptchaCallback;
			}
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
						void props.onPaymentAuthorised(result.setupIntent.payment_method);
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

	const setupOneOffRecaptchaCallback = () => {
		window.grecaptcha?.render('robot_checkbox', {
			sitekey: window.guardian.v2recaptchaPublicKey,
			callback: (token: string) => {
				trackRecaptchaClientTokenReceived();
				props.setOneOffRecaptchaToken(token);
			},
		});
	};

	const setupOneOffRecaptcha = (): void => {
		if (window.guardian.recaptchaEnabled) {
			if (window.grecaptcha?.render) {
				setupOneOffRecaptchaCallback();
			} else {
				window.v2OnloadCallback = setupOneOffRecaptchaCallback;
			}
		}
	};

	const handleCreatePaymentForOneOff = (): void => {
		const cardElement = elements?.getElement(CardNumberElement);

		if (stripe && cardElement) {
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
						void props.onPaymentAuthorised(result.paymentMethod.id);
					}
				});
		}
	};

	const setupOneOffHandlers = (): void => {
		props.setCreateStripePaymentMethod(() => {
			props.setPaymentWaiting(true);

			handleCreatePaymentForOneOff();
		});

		// @ts-expect-error TODO: This needs fixing in the reducer; we may always get undefined because we can't be sure the Stripe SDK will load
		props.setHandleStripe3DS((clientSecret: string) => {
			trackStripe3ds();
			return stripe?.handleCardAction(clientSecret);
		});
	};

	useEffect(() => {
		if (stripe && elements) {
			if (props.contributionType === 'ONE_OFF') {
				setupOneOffRecaptcha();
			} else if (!calledRecaptchaRender) {
				setupRecurringRecaptcha();
			}
		}
	}, [stripe, elements, props.contributionType]);

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

	const isZipCodeFieldValid = () =>
		showZipCodeField ? isValidZipCode(zipCode) : true;

	useEffect(() => {
		const formIsComplete =
			fieldStates.CardNumber.name === 'Complete' &&
			fieldStates.Expiry.name === 'Complete' &&
			fieldStates.CVC.name === 'Complete' &&
			isZipCodeFieldValid();
		props.setStripeCardFormComplete(formIsComplete);
	}, [fieldStates, zipCode]);

	const showZipCodeError =
		props.checkoutFormHasBeenSubmitted && !isZipCodeFieldValid();

	const recaptchaVerified =
		props.contributionType === 'ONE_OFF'
			? props.oneOffRecaptchaToken
			: props.recurringRecaptchaVerified;

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

			{window.guardian.recaptchaEnabled ? (
				<div className="ds-security-check">
					<div className="ds-security-check__label">
						<label htmlFor="robot_checkbox">Security check</label>
					</div>
					{props.checkoutFormHasBeenSubmitted && !recaptchaVerified && (
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

// ---- Helper components ---- //

interface VerificationCopyProps {
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
}

function VerificationCopy({
	countryGroupId,
	contributionType,
}: VerificationCopyProps) {
	useEffect(() => {
		trackRecaptchaVerificationWarning(countryGroupId, contributionType);
	}, []);

	return (
		<div className="form__error">
			{' '}
			{"Please tick to verify you're a human"}{' '}
		</div>
	);
}

interface CreditCardIconsProps {
	country: IsoCountry;
}
function CreditCardIcons({ country }: CreditCardIconsProps) {
	if (country === 'US') {
		return <CreditCardsUS className="form__credit-card-icons" />;
	}

	return <CreditCardsROW className="form__credit-card-icons" />;
}

// ---- Helper functions ---- //

// --- Stripe helper functions --- //

function createStripeSetupIntent(
	token: string,
	stripeKey: string,
	isTestUser: boolean,
	csrf: Csrf,
): Promise<string> {
	return fetchJson(
		routes.stripeSetupIntentRecaptcha,
		requestOptions(
			{
				token,
				stripePublicKey: stripeKey,
				isTestUser: isTestUser,
			},
			'same-origin',
			'POST',
			csrf,
		),
	).then((json) => {
		if (json.client_secret && typeof json.client_secret === 'string') {
			trackRecaptchaVerified();
			return json.client_secret;
		} else {
			throw noClientSecretError(json);
		}
	});
}

// --- Tracker helper functions --- //

function trackRecaptchaClientTokenReceived() {
	trackComponentLoad('contributions-recaptcha-client-token-received');
}

function trackRecaptchaVerified() {
	trackComponentLoad('contributions-recaptcha-verified');
}

function trackStripe3ds() {
	trackComponentLoad('stripe-3ds');
}

function trackRecaptchaVerificationWarning(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
) {
	trackComponentLoad(
		`recaptchaV2-verification-warning-${countryGroupId}-${contributionType}-loaded`,
	);
}

// --- Error helper functions --- //

function noClientSecretError(json: unknown) {
	return new Error(
		`Missing client_secret field in server response: ${JSON.stringify(json)}`,
	);
}

// --- Log helper functions --- //

function logCreateSetupIntentError(err: Error) {
	logException(
		`Error getting Setup Intent client_secret from ${routes.stripeSetupIntentRecaptcha}: ${err.message}`,
	);
}

function logCreatePaymentMethodError(errorData: StripeError) {
	logException(`Error creating Payment Method: ${JSON.stringify(errorData)}`);
}

// --- DOM helper functions --- //

const recaptchaElementNotEmpty = (): boolean => {
	const el = document.getElementById('robot_checkbox');

	if (el) {
		return el.children.length > 0;
	}

	return true;
};

// ---- Styles ---- //

const styles = {
	stripeField: {
		base: {
			fontFamily:
				"'GuardianTextSans', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
			'::placeholder': {
				color: '#999999',
			},
			fontSize: '17px',
			lineHeight: '1.5',
		},
	},
	zipCodeContainer: css`
		margin-top: 0.65rem;
	`,
};

// ----- Exports -----//

export default connector(CardForm);
