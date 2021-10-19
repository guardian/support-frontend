/* eslint-disable react/no-unused-state */
// @ts-expect-error - required for hooks
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/core';
import { Button, buttonReaderRevenue } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import * as stripeJs from '@stripe/react-stripe-js';
import 'helpers/subscriptionsForms/validation';
import 'helpers/subscriptionsForms/formFields';
import {
	CardCvcElement,
	CardExpiryElement,
	CardNumberElement,
} from '@stripe/react-stripe-js';
import { ThemeProvider } from 'emotion-theming';
import { compose } from 'redux';
import { withError } from 'hocs/withError';
import { withLabel } from 'hocs/withLabel';
import './stripeForm.scss';
import { routes } from 'helpers/urls/routes';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import { fetchJson, requestOptions } from 'helpers/async/fetch';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import { loadRecaptchaV2 } from 'helpers/forms/recaptcha';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import type { Option } from 'helpers/types/option';
import { logException } from 'helpers/utilities/logger';
import { ErrorSummary } from '../submitFormErrorSummary';
// Types
export type StripeFormPropTypes = {
	allErrors: Array<FormError<FormField>>;
	stripeKey: string;
	setStripePaymentMethod: (...args: any[]) => any;
	submitForm: (...args: any[]) => any;
	validateForm: (...args: any[]) => any;
	buttonText: string;
	csrf: Csrf;
	isTestUser: boolean;
};
type CardFieldData = {
	complete: boolean;
	empty: boolean;
	error: string;
	errorEmpty: string;
	errorIncomplete: string;
};
type CardFieldName = 'cardNumber' | 'cardExpiry' | 'cardCvc';
type CardFieldsData = Record<CardFieldName, CardFieldData>;
type CardFieldsValidationOutput = {
	fieldData: CardFieldsData;
	fieldErrors: Array<FormError<CardFieldName>>;
};
// Styles for stripe elements
const baseStyles = {
	fontSize: '16px',
	color: '#121212',
	'::placeholder': {
		color: 'white',
	},
};
const invalidStyles = {
	color: '#c70000',
};
const marginTop = css`
	margin-top: ${space[5]}px;
`;
// Main component
const CardNumberWithError = compose(withLabel, withError)(CardNumberElement);
const CardExpiryWithError = compose(withLabel, withError)(CardExpiryElement);
const CardCvcWithError = compose(withLabel, withError)(CardCvcElement);
const RecaptchaWithError = compose(withLabel, withError)(Recaptcha);

const StripeForm = (props: StripeFormPropTypes) => {
	/**
	 * State
	 */
	const [cardErrors, setCardErrors] = useState<Array<FormError<CardFieldName>>>(
		[],
	);
	const [setupIntentClientSecret, setSetupIntentClientSecret] =
		useState<Option<string>>(null);
	const [paymentWaiting, setPaymentWaiting] = useState<boolean>(false);
	const [recaptchaCompleted, setRecaptchaCompleted] = useState<boolean>(false);
	const [recaptchaError, setRecaptchaError] =
		useState<FormError<'recaptcha'> | null>(null);
	const [cardFieldsData, setCardFieldsData] = useState<CardFieldsData>({
		cardNumber: {
			complete: false,
			empty: true,
			error: '',
			errorEmpty: 'Please enter a card number',
			errorIncomplete: 'Please enter a valid card number',
		},
		cardExpiry: {
			complete: false,
			empty: true,
			error: '',
			errorEmpty: 'Please enter an expiry date',
			errorIncomplete: 'Please enter a valid expiry date',
		},
		cardCvc: {
			complete: false,
			empty: true,
			error: '',
			errorEmpty: 'Please enter a CVC number',
			errorIncomplete: 'Please enter a valid CVC number',
		},
	});
	const [disableButton, setDisableButton] = useState<boolean>(false);
	const [readyToSubmitPendingValidation, setReadyToSubmitPendingValidation] =
		useState<boolean>(false);
	const stripe = stripeJs.useStripe();
	const elements = stripeJs.useElements();

	/**
	 * Handlers
	 */
	const handleStripeError = (errorData: any): void => {
		setPaymentWaiting(false);
		logException(`Error creating Payment Method: ${JSON.stringify(errorData)}`);

		if (errorData.type === 'validation_error') {
			// This shouldn't be possible as we disable the submit button until all fields are valid, but if it does
			// happen then display a generic error about card details
			setCardErrors((prevData) => [
				...prevData,
				{
					field: 'cardNumber',
					message: appropriateErrorMessage('payment_details_incorrect'),
				},
			]);
		} else {
			// This is probably a Stripe or network problem
			setCardErrors((prevData) => [
				...prevData,
				{
					field: 'cardNumber',
					message: appropriateErrorMessage('payment_provider_unavailable'),
				},
			]);
		}
	};

	const handleCardSetup = (clientSecret: Option<string>): Promise<string> => {
		const cardElement = elements.getElement(CardNumberElement);
		return stripe.handleCardSetup(clientSecret, cardElement).then((result) => {
			if (result.error) {
				handleStripeError(result.error);
				return Promise.reject(result.error);
			}

			return result.setupIntent.payment_method;
		});
	};

	const fetchPaymentIntent = (token) =>
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
			.then((result) => {
				if (result.client_secret) {
					setSetupIntentClientSecret(result.client_secret);
				} else {
					throw new Error(
						`Missing client_secret field in response from ${routes.stripeSetupIntentRecaptcha}`,
					);
				}
			})
			.catch((error) => {
				logException(
					`Error getting Stripe client secret for subscription: ${error}`,
				);
				setCardErrors((prevData) => [
					...prevData,
					{
						field: 'cardNumber',
						message: appropriateErrorMessage('internal_error'),
					},
				]);
			});

	// Creates a new setupIntent upon recaptcha verification
	const setupRecurringRecaptchaCallback = () => {
		window.grecaptcha.render('robot_checkbox', {
			sitekey: window.guardian.v2recaptchaPublicKey,
			callback: (token) => {
				trackComponentLoad('subscriptions-recaptcha-client-token-received');
				setRecaptchaCompleted(true);
				setRecaptchaError(null);
				fetchPaymentIntent(token);
			},
		});
	};

	const setupRecurringHandlers = (): void => {
		if (!window.guardian.recaptchaEnabled) {
			fetchPaymentIntent('dummy');
		} else if (window.grecaptcha && window.grecaptcha.render) {
			setupRecurringRecaptchaCallback();
		} else {
			window.v2OnloadCallback = setupRecurringRecaptchaCallback;
		}
	};

	const handleCardErrors = () => {
		const cardFields: CardFieldName[] = Object.keys(cardFieldsData);
		const { fieldData, fieldErrors }: CardFieldsValidationOutput =
			cardFields.reduce(
				(newData: CardFieldsValidationOutput, cardFieldName: CardFieldName) => {
					const existingFieldData = cardFieldsData[cardFieldName];
					let error;

					if (existingFieldData.empty) {
						error = existingFieldData.errorEmpty;
						newData.fieldErrors.push({
							field: cardFieldName,
							message: error,
						});
					} else if (!existingFieldData.complete) {
						error = existingFieldData.errorIncomplete;
						newData.fieldErrors.push({
							field: cardFieldName,
							message: error,
						});
					}

					return {
						fieldErrors: newData.fieldErrors,
						fieldData: {
							...newData.fieldData,
							[cardFieldName]: {
								...existingFieldData,
								...(error
									? {
											error,
									  }
									: {}),
							},
						},
					};
				},
				{
					fieldData: {},
					fieldErrors: [],
				},
			);
		setCardFieldsData(fieldData);
		setCardErrors(fieldErrors);
	};

	const handleChange = (event) => {
		if (cardFieldsData[event.elementType].error) {
			setCardFieldsData((prevData) => ({
				...prevData,
				[event.elementType]: { ...prevData[event.elementType], error: '' },
			}));
		} else {
			setCardFieldsData((prevData) => ({
				...prevData,
				[event.elementType]: {
					...prevData[event.elementType],
					complete: event.complete,
					empty: event.empty,
				},
			}));
		}
	};

	const checkRecaptcha = () => {
		if (
			window.guardian.recaptchaEnabled &&
			!recaptchaCompleted &&
			recaptchaError === null
		) {
			setRecaptchaError({
				field: 'recaptcha',
				message: "Please check the 'I'm not a robot' checkbox",
			});
		}
	};

	const handleCardSetupAndPay = () =>
		handleCardSetup(setupIntentClientSecret)
			.then(props.setStripePaymentMethod)
			.then(() => {
				setDisableButton(false);
				props.submitForm();
			})
			.catch(() => {
				setDisableButton(false);
			});

	const requestSCAPaymentMethod = (event) => {
		event.preventDefault();
		props.validateForm();
		handleCardErrors();
		checkRecaptcha();
		setReadyToSubmitPendingValidation(true);
	};

	/**
	 * Hooks
	 */
	useEffect(() => {
		if (stripe) {
			setupRecurringHandlers();
			loadRecaptchaV2();
		}
	}, [stripe]);
	useEffect(() => {
		if (paymentWaiting && setupIntentClientSecret) {
			// User has already completed the form and clicked the button, so go ahead and complete the subscription
			handleCardSetupAndPay();
		}
	}, [setupIntentClientSecret]);
	// Handle the payment once all state updates to the card data, errors list, etc
	// have completed after hitting the submit button
	useEffect(() => {
		const noValidationErrors =
			props.allErrors.length === 0 &&
			cardErrors.length === 0 &&
			!recaptchaError;

		if (stripe && readyToSubmitPendingValidation && noValidationErrors) {
			setDisableButton(true);

			if (setupIntentClientSecret) {
				handleCardSetupAndPay();
			} else if (recaptchaCompleted) {
				// User has completed the form and recaptcha, but we're still waiting for the setupIntentClientSecret to
				// come back. A hook will complete subscription once the setupIntentClientSecret is available.
				setPaymentWaiting(true);
			}
		} else if (readyToSubmitPendingValidation) {
			// Form has errors and is not ready for submission- reset and await another submit button press
			setReadyToSubmitPendingValidation(false);
		}
	}, [readyToSubmitPendingValidation, cardErrors, recaptchaError]);

	/**
	 * Rendering
	 */
	const errors = [
		...props.allErrors,
		...(cardErrors || []),
		...(recaptchaError ? [recaptchaError] : []),
	];
	return (
		<span>
			{stripe && (
				<fieldset css={marginTop}>
					<CardNumberWithError
						id="card-number"
						error={cardFieldsData.cardNumber.error}
						label="Card number"
						options={{
							style: {
								base: { ...baseStyles },
								invalid: { ...invalidStyles },
							},
						}}
						onChange={(e) => handleChange(e)}
					/>
					<CardExpiryWithError
						id="card-expiry"
						error={cardFieldsData.cardExpiry.error}
						label="Expiry date"
						options={{
							style: {
								base: { ...baseStyles },
								invalid: { ...invalidStyles },
							},
						}}
						onChange={(e) => handleChange(e)}
					/>
					<CardCvcWithError
						id="cvc"
						error={cardFieldsData.cardCvc.error}
						label="CVC"
						options={{
							style: {
								base: { ...baseStyles },
								invalid: { ...invalidStyles },
							},
						}}
						onChange={(e) => handleChange(e)}
					/>
					{window.guardian.recaptchaEnabled ? (
						<RecaptchaWithError
							id="robot_checkbox"
							label="Security check"
							error={recaptchaError && recaptchaError.message}
						/>
					) : null}
					<div className="component-stripe-submit-button">
						<ThemeProvider theme={buttonReaderRevenue}>
							<Button
								id="qa-stripe-submit-button"
								onClick={requestSCAPaymentMethod}
								priority="primary"
								icon={<SvgArrowRightStraight />}
								iconSide="right"
								disabled={disableButton}
							>
								{props.buttonText}
							</Button>
						</ThemeProvider>
					</div>
					{errors.length > 0 && <ErrorSummary errors={errors} />}
				</fieldset>
			)}
		</span>
	);
};

export default StripeForm;
