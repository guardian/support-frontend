import { css, ThemeProvider } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenue,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import * as stripeJs from '@stripe/react-stripe-js';
import { CardNumberElement } from '@stripe/react-stripe-js';
import type { StripeElementChangeEvent, StripeError } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import * as React from 'react';
import './stripeForm.scss';
import { appropriateErrorMessage } from 'helpers/forms/errorReasons';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { setStripePaymentMethod } from 'helpers/redux/checkout/payment/stripe/actions';
import { getStripeSetupIntent } from 'helpers/redux/checkout/payment/stripe/thunks';
import {
	expireRecaptchaToken,
	setRecaptchaToken,
} from 'helpers/redux/checkout/recaptcha/actions';
import {
	useSubscriptionsDispatch,
	useSubscriptionsSelector,
} from 'helpers/redux/storeHooks';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { trackComponentLoad } from 'helpers/tracking/behaviour';
import { logException } from 'helpers/utilities/logger';
import { ErrorSummary } from '../submitFormErrorSummary';
import {
	CardCvcWithError,
	CardExpiryWithError,
	CardNumberWithError,
	RecaptchaWithError,
} from './composedStripeElements';

// Types
export type StripeFormPropTypes = {
	allErrors: Array<FormError<FormField>>;
	stripeKey: string;
	submitForm: () => void;
	validateForm: () => void;
	buttonText: string;
	csrf: CsrfState;
	isTestUser: boolean;
};

type CardFieldData = {
	complete: boolean;
	empty: boolean;
	error: string;
	errorEmpty: string;
	errorIncomplete: string;
};

export type CardFieldName = 'cardNumber' | 'cardExpiry' | 'cardCvc';

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

function StripeForm(props: StripeFormPropTypes): JSX.Element {
	/**
	 * Redux hooks
	 */
	const dispatch = useSubscriptionsDispatch();
	const setupIntentClientSecret = useSubscriptionsSelector(
		(state) => state.page.checkoutForm.payment.stripe.setupIntentClientSecret,
	);
	const recaptchaCompleted = useSubscriptionsSelector(
		(state) => state.page.checkoutForm.recaptcha.completed,
	);

	/**
	 * Component state
	 */
	const [cardErrors, setCardErrors] = useState<Array<FormError<CardFieldName>>>(
		[],
	);
	const [paymentWaiting, setPaymentWaiting] = useState<boolean>(false);
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
	const handleStripeError = (errorData: StripeError): void => {
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

	const handleCardSetup = (clientSecret?: string) => {
		const cardElement = elements?.getElement(CardNumberElement);
		if (stripe && clientSecret && cardElement) {
			return stripe
				.confirmCardSetup(clientSecret, {
					payment_method: { card: cardElement },
				})
				.then((result) => {
					if (result.error) {
						handleStripeError(result.error);
						return Promise.reject(result.error);
					}

					return result.setupIntent.payment_method ?? undefined;
				});
		}
	};

	const fetchPaymentIntent = (token: string) =>
		dispatch(
			getStripeSetupIntent({
				token,
				stripePublicKey: props.stripeKey,
				isTestUser: props.isTestUser,
			}),
		).catch((error: Error) => {
			logException(
				`Error getting Stripe client secret for subscription: ${error.message}`,
			);
			setCardErrors((prevData) => [
				...prevData,
				{
					field: 'cardNumber',
					message: appropriateErrorMessage('internal_error'),
				},
			]);
		});

	const setupRecurringHandlers = (): void => {
		if (!window.guardian.recaptchaEnabled) {
			void fetchPaymentIntent('dummy');
		}
	};

	const handleCardErrors = () => {
		const cardFields = Object.keys(cardFieldsData) as CardFieldName[];
		const initialValidationOutput = {
			fieldData: {
				cardNumber: {
					complete: false,
					empty: false,
					error: '',
					errorEmpty: '',
					errorIncomplete: '',
				},
				cardExpiry: {
					complete: false,
					empty: false,
					error: '',
					errorEmpty: '',
					errorIncomplete: '',
				},
				cardCvc: {
					complete: false,
					empty: false,
					error: '',
					errorEmpty: '',
					errorIncomplete: '',
				},
			},
			fieldErrors: [],
		};
		const { fieldData, fieldErrors } =
			cardFields.reduce<CardFieldsValidationOutput>(
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
					...initialValidationOutput,
				},
			);
		setCardFieldsData(fieldData);
		setCardErrors(fieldErrors);
	};

	const handleChange = (event: StripeElementChangeEvent) => {
		const elementType = event.elementType as CardFieldName;
		if (cardFieldsData[elementType].error) {
			setCardFieldsData((prevData) => ({
				...prevData,
				[elementType]: { ...prevData[elementType], error: '' },
			}));
		} else {
			setCardFieldsData((prevData) => ({
				...prevData,
				[elementType]: {
					...prevData[elementType],
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
			?.then((paymentMethod?: string) =>
				dispatch(setStripePaymentMethod(paymentMethod)),
			)
			.then(() => {
				setDisableButton(false);
				props.submitForm();
			})
			.catch(() => {
				setDisableButton(false);
			});

	const requestSCAPaymentMethod = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
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
		}
	}, [stripe]);

	useEffect(() => {
		if (paymentWaiting && setupIntentClientSecret) {
			// User has already completed the form and clicked the button, so go ahead and complete the subscription
			void handleCardSetupAndPay();
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
				void handleCardSetupAndPay();
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
		...cardErrors,
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
							onRecaptchaCompleted={(token: string) => {
								trackComponentLoad(
									'subscriptions-recaptcha-client-token-received',
								);
								dispatch(setRecaptchaToken(token));
								setRecaptchaError(null);
								void fetchPaymentIntent(token);
							}}
							onRecaptchaExpired={() => dispatch(expireRecaptchaToken())}
							label="Security check"
							// TODO: Remove type assertion when we can fix field error types
							error={recaptchaError?.message as string}
						/>
					) : null}
					<div className="component-stripe-submit-button">
						<ThemeProvider theme={buttonThemeReaderRevenue}>
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
}

export default StripeForm;
