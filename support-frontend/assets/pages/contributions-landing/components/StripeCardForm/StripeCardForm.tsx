// ----- Imports ----- //
// @ts-expect-error - required for hooks
import { css } from '@emotion/core';
import { TextInput } from '@guardian/src-text-input';
import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
} from '@stripe/react-stripe-js';
import * as stripeJs from '@stripe/react-stripe-js';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import QuestionMarkHintIcon from 'components/svgs/questionMarkHintIcon';
import { fetchJson, requestOptions } from 'helpers/async/fetch';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentResult } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/forms/paymentMethods';
import type {
	State,
	Stripe3DSResult,
} from 'pages/contributions-landing/contributionsLandingReducer';
import 'helpers/forms/paymentIntegrations/readerRevenueApis';
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
import 'helpers/contributions';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import { logException } from 'helpers/utilities/logger';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import type { IsoCountry } from 'helpers/internationalisation/country';
import CreditCardsROW from './creditCardsROW.svg';
import CreditCardsUS from './creditCardsUS.svg';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { routes } from 'helpers/urls/routes';
import { InlineError } from '@guardian/src-user-feedback';
import { StripeCardFormField } from './StripeCardFormField';
import './stripeCardForm.scss';
import { isValidZipCode } from 'helpers/forms/formValidation';
// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
	onPaymentAuthorised: (paymentMethodId: string) => Promise<PaymentResult>;
	paymentFailure: (paymentError: ErrorReason) => Action;
	contributionType: ContributionType;
	setCreateStripePaymentMethod: (
		arg0: (clientSecret: string | null) => void,
	) => Action;
	setHandleStripe3DS: (
		arg0: (clientSecret: string) => Promise<Stripe3DSResult>,
	) => Action;
	setPaymentWaiting: (isWaiting: boolean) => Action;
	paymentWaiting: boolean;
	setStripeCardFormComplete: (isComplete: boolean) => Action;
	setStripeSetupIntentClientSecret: (clientSecret: string) => Action;
	setStripeRecurringRecaptchaVerified: (arg0: boolean) => Action;
	checkoutFormHasBeenSubmitted: boolean;
	stripeKey: string;
	country: IsoCountry;
	countryGroupId: CountryGroupId;
	csrf: CsrfState;
	setupIntentClientSecret: string | null;
	recurringRecaptchaVerified: boolean;
	formIsSubmittable: boolean;
	setOneOffRecaptchaToken: (arg0: string) => Action;
	oneOffRecaptchaToken: string;
	isTestUser: boolean;
};

const mapStateToProps = (state: State) => ({
	contributionType: state.page.form.contributionType,
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
	paymentWaiting: state.page.form.isWaiting,
	country: state.common.internationalisation.countryId,
	countryGroupId: state.common.internationalisation.countryGroupId,
	csrf: state.page.csrf,
	setupIntentClientSecret:
		state.page.form.stripeCardFormData.setupIntentClientSecret,
	recurringRecaptchaVerified:
		state.page.form.stripeCardFormData.recurringRecaptchaVerified,
	formIsSubmittable: state.page.form.formIsSubmittable,
	oneOffRecaptchaToken: state.page.form.oneOffRecaptchaToken,
});

const mapDispatchToProps = (dispatch: (...args: any[]) => any) => ({
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
		handleStripe3DS: (clientSecret: string) => Promise<Stripe3DSResult>,
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

type CardFieldState =
	| {
			name: 'Error';
			errorMessage: string;
	  }
	| {
			name: 'Incomplete';
	  }
	| {
			name: 'Complete';
	  };
type CardFieldName = 'CardNumber' | 'Expiry' | 'CVC';
const fieldStyle = {
	base: {
		fontFamily:
			"'GuardianTextSans', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
		'::placeholder': {
			color: '#999999',
		},
		fontSize: '17px',
		lineHeight: 1.5,
	},
};
const zipCodeContainerStyles = css`
	margin-top: 0.65rem;
`;

const renderVerificationCopy = (
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
) => {
	trackComponentLoad(
		`recaptchaV2-verification-warning-${countryGroupId}-${contributionType}-loaded`,
	);
	return (
		<div className="form__error">
			{' '}
			{"Please tick to verify you're a human"}{' '}
		</div>
	);
};

const errorMessageFromState = (state: CardFieldState): string | null =>
	state.name === 'Error' ? state.errorMessage : null;

// Hook for monitoring the previous state of a prop
const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

const CardForm = (props: PropTypes) => {
	/**
	 * State
	 */
	const [currentlySelected, setCurrentlySelected] =
		useState<CardFieldName | null>(null);
	const [fieldStates, setFieldStates] = useState<
		Record<CardFieldName, CardFieldState>
	>({
		CardNumber: {
			name: 'Incomplete',
		},
		Expiry: {
			name: 'Incomplete',
		},
		CVC: {
			name: 'Incomplete',
		},
	});
	const stripe = stripeJs.useStripe();
	const elements = stripeJs.useElements();
	// Used to avoid calling grecaptcha.render twice when switching between monthly + annual
	const [calledRecaptchaRender, setCalledRecaptchaRender] =
		useState<boolean>(false);
	const [zipCode, setZipCode] = useState('');
	const showZipCodeField = props.country === 'US';

	const updateZipCode = (event) => setZipCode(event.target.value);

	/**
	 * Handlers
	 */
	const onChange = (fieldName: CardFieldName) => (update) => {
		const newFieldState = () => {
			if (update.error) {
				return {
					name: 'Error',
					errorMessage: update.error.message,
				};
			}

			if (update.complete) {
				return {
					name: 'Complete',
				};
			}

			return {
				name: 'Incomplete',
			};
		};

		setFieldStates((prevData) => ({
			...prevData,
			[fieldName]: newFieldState(),
		}));
	};

	const handleStripeError = (errorData: any): void => {
		props.setPaymentWaiting(false);
		logException(`Error creating Payment Method: ${JSON.stringify(errorData)}`);

		if (errorData.type === 'validation_error') {
			// This shouldn't be possible as we disable the submit button until all fields are valid, but if it does
			// happen then display a generic error about card details
			props.paymentFailure('payment_details_incorrect');
		} else {
			// This is probably a Stripe or network problem
			props.paymentFailure('payment_provider_unavailable');
		}
	};

	const recaptchaElementNotEmpty = (): boolean => {
		const el = document.getElementById('robot_checkbox');

		if (el) {
			return el.children.length > 0;
		}

		return true;
	};

	// Creates a new setupIntent upon recaptcha verification
	const setupRecurringRecaptchaCallback = () => {
		setCalledRecaptchaRender(true);

		// Fix for safari, where the calledRecaptchaRender state handling does not work. TODO - find a better solution
		if (recaptchaElementNotEmpty()) {
			return;
		}

		window.grecaptcha.render('robot_checkbox', {
			sitekey: props.isTestUser
				? window.guardian.v2recaptchaPublicKey.uat
				: window.guardian.v2recaptchaPublicKey.default,
			callback: (token) => {
				trackComponentLoad('contributions-recaptcha-client-token-received');
				props.setStripeRecurringRecaptchaVerified(true);
				fetchJson(
					routes.stripeSetupIntentRecaptcha,
					requestOptions(
						{
							token,
							stripePublicKey: props.stripeKey,
							isTestUser: props.isTestUser,
						},
						'same-origin',
						'POST',
						props.csrf,
					),
				)
					.then((json) => {
						if (json.client_secret) {
							trackComponentLoad('contributions-recaptcha-verified');
							props.setStripeSetupIntentClientSecret(json.client_secret);
						} else {
							throw new Error(
								`Missing client_secret field in server response: ${JSON.stringify(
									json,
								)}`,
							);
						}
					})
					.catch((err) => {
						logException(
							`Error getting Setup Intent client_secret from ${routes.stripeSetupIntentRecaptcha}: ${err}`,
						);
						props.paymentFailure('internal_error');
						props.setPaymentWaiting(false);
					});
			},
		});
	};

	const setupRecaptchaTokenForOneOff = () => {
		window.grecaptcha.render('robot_checkbox', {
			sitekey: props.isTestUser
				? window.guardian.v2recaptchaPublicKey.uat
				: window.guardian.v2recaptchaPublicKey.default,
			callback: (token) => {
				trackComponentLoad('contributions-recaptcha-client-token-received');
				props.setOneOffRecaptchaToken(token);
			},
		});
	};

	const setupOneOffRecaptcha = (): void => {
		if (window.guardian.recaptchaEnabled) {
			if (window.grecaptcha && window.grecaptcha.render) {
				setupRecaptchaTokenForOneOff();
			} else {
				window.v2OnloadCallback = setupRecaptchaTokenForOneOff;
			}
		}
	};

	const setupOneOffHandlers = (): void => {
		props.setCreateStripePaymentMethod(() => {
			props.setPaymentWaiting(true);
			const cardElement = elements.getElement(CardNumberElement);
			stripe
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
						props.onPaymentAuthorised(result.paymentMethod.id);
					}
				});
		});
		props.setHandleStripe3DS((clientSecret: string) => {
			trackComponentLoad('stripe-3ds');
			return stripe.handleCardAction(clientSecret);
		});
	};

	const handleCardSetupForRecurring = (clientSecret: string): void => {
		const cardElement = elements.getElement(CardNumberElement);
		stripe
			.handleCardSetup(clientSecret, cardElement, {
				payment_method_data: {
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
				} else {
					props.onPaymentAuthorised(result.setupIntent.payment_method);
				}
			});
	};

	const setupRecurringRecaptcha = (): void => {
		if (window.guardian.recaptchaEnabled) {
			if (window.grecaptcha && window.grecaptcha.render) {
				setupRecurringRecaptchaCallback();
			} else {
				window.v2OnloadCallback = setupRecurringRecaptchaCallback;
			}
		}
	};

	const setupRecurringHandlers = (): void => {
		// Start by requesting the client_secret for a new Payment Method.
		// Note - because this value is requested asynchronously when the component loads,
		// it's possible for it to arrive after the user clicks 'Contribute'.
		// This is handled in the callback below by checking the value of paymentWaiting.
		props.setCreateStripePaymentMethod((clientSecret: string | null) => {
			props.setPaymentWaiting(true);

			/* Recaptcha verification is required for setupIntent creation.
      If setupIntentClientSecret is ready then complete the payment now.
      If setupIntentClientSecret is not ready then componentDidUpdate will complete the payment when it arrives. */
			if (clientSecret) {
				handleCardSetupForRecurring(clientSecret);
			}
		});
	};

	/**
	 * Hooks
	 */
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
	// If we have just received the setupIntentClientSecret and the user has already clicked 'Contribute'
	// then go ahead and process the recurring contribution
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

	/**
	 * Rendering
	 */
	const fieldError?: string =
		errorMessageFromState(fieldStates.CardNumber) ||
		errorMessageFromState(fieldStates.Expiry) ||
		errorMessageFromState(fieldStates.CVC);
	const showZipCodeError =
		props.checkoutFormHasBeenSubmitted && !isZipCodeFieldValid();

	const incompleteMessage = (): string | null | undefined => {
		if (
			props.checkoutFormHasBeenSubmitted &&
			(fieldStates.CardNumber.name === 'Incomplete' ||
				fieldStates.Expiry.name === 'Incomplete' ||
				fieldStates.CVC.name === 'Incomplete')
		) {
			return 'Please complete your card details';
		}

		return undefined;
	};

	const errorMessage?: string =
		fieldError || incompleteMessage();

	const showCards = (country: IsoCountry) => {
		if (country === 'US') {
			return <CreditCardsUS className="form__credit-card-icons" />;
		}

		return <CreditCardsROW className="form__credit-card-icons" />;
	};

	const recaptchaVerified =
		props.contributionType === 'ONE_OFF'
			? props.oneOffRecaptchaToken
			: props.recurringRecaptchaVerified;
	return (
		<div>
			<legend className="form__legend">
				<h3>Your card details</h3>
			</legend>
			{errorMessage ? <InlineError> {errorMessage} </InlineError> : null}

			<StripeCardFormField
				label={
					<>
						<label htmlFor="stripeCardNumberElement">Card number</label>
						{showCards(props.country)}
					</>
				}
				input={
					<CardNumberElement
						id="stripeCardNumberElement"
						options={{
							style: fieldStyle,
						}}
						onChange={onChange('CardNumber')}
						onFocus={() => setCurrentlySelected('CardNumber')}
						onBlur={setCurrentlySelected(null)}
					/>
				}
				error={fieldStates.CardNumber.name === 'Error'}
				focus={currentlySelected === 'CardNumber'}
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
									style: fieldStyle,
								}}
								placeholder=""
								onChange={onChange('Expiry')}
								onFocus={() => setCurrentlySelected('Expiry')}
								onBlur={setCurrentlySelected(null)}
							/>
						}
						error={fieldStates.Expiry.name === 'Error'}
						focus={currentlySelected === 'Expiry'}
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
									style: fieldStyle,
								}}
								placeholder=""
								onChange={onChange('CVC')}
								onFocus={() => setCurrentlySelected('CVC')}
								onBlur={setCurrentlySelected(null)}
							/>
						}
						error={fieldStates.CVC.name === 'Error'}
						focus={currentlySelected === 'CVC'}
					/>
				</div>
			</div>

			{showZipCodeField && (
				<div css={zipCodeContainerStyles}>
					<TextInput
						id="contributionZipCode"
						name="contribution-zip-code"
						label="ZIP code"
						value={zipCode}
						onChange={updateZipCode}
						error={showZipCodeError ? 'Please enter a valid ZIP code' : null}
					/>
				</div>
			)}

			{window.guardian.recaptchaEnabled ? (
				<div className="ds-security-check">
					<div className="ds-security-check__label">
						<label htmlFor="robot_checkbox">Security check</label>
					</div>
					{props.checkoutFormHasBeenSubmitted && !recaptchaVerified
						? renderVerificationCopy(
								props.countryGroupId,
								props.contributionType,
						  )
						: null}
					<Recaptcha />
				</div>
			) : null}
		</div>
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(CardForm);
