import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { Radio, RadioGroup } from '@guardian/source/react-components';
import { useState } from 'react';
import DirectDebitForm from 'components/directDebit/directDebitForm/directDebitForm';
import { paymentMethodData } from 'components/paymentMethodSelector/paymentMethodData';
import { Recaptcha } from 'components/recaptcha/recaptcha';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { StripeCardForm } from 'components/stripeCardForm/stripeCardForm';
import {
	DirectDebit,
	isPaymentMethod,
	type PaymentMethod,
	PayPal,
	Stripe,
	toPaymentMethodSwitchNaming,
} from 'helpers/forms/paymentMethods';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendEventPaymentMethodSelected } from 'helpers/tracking/quantumMetric';
import { stripeCreateSetupIntentRecaptcha } from '../checkout/helpers/stripe';
import { FormSection, Legend } from './form';
import {
	checkedRadioLabelColour,
	defaultRadioLabelColour,
	paymentMethodBody,
	PaymentMethodRadio,
	PaymentMethodSelector,
} from './paymentMethod';

function paymentMethodIsActive(paymentMethod: PaymentMethod) {
	return isSwitchOn(
		`recurringPaymentMethods.${toPaymentMethodSwitchNaming(paymentMethod)}`,
	);
}

type PaymentSectionProps = {
	paymentMethodError: string | undefined;
	setPaymentMethodError: (error: string | undefined) => void;
	setStripeClientSecret: (clientSecret: string) => void;
	setStripeClientSecretInProgress: (inProgress: boolean) => void;
	recaptchaToken: string | undefined;
	setRecaptchaToken: (token: string | undefined) => void;
	paymentMethod: PaymentMethod | 'StripeExpressCheckoutElement' | undefined;
	setPaymentMethod: (paymentMethod: PaymentMethod) => void;
	sectionNumber: number;
	stripePublicKey: string;
	isTestUser: boolean;
	countryGroupId: CountryGroupId;
	countryId: IsoCountry;
};

export default function PaymentSection({
	paymentMethodError,
	setPaymentMethodError,
	setStripeClientSecret,
	setStripeClientSecretInProgress,
	recaptchaToken,
	setRecaptchaToken,
	paymentMethod,
	setPaymentMethod,
	sectionNumber,
	stripePublicKey,
	isTestUser,
	countryGroupId,
	countryId,
}: PaymentSectionProps) {
	const validPaymentMethods = [
		/* NOT YET IMPLEMENTED
		countryGroupId === 'EURCountries' && Sepa,
    countryId === 'US' && AmazonPay,
    */
		countryId === 'GB' && DirectDebit,
		Stripe,
		PayPal,
	]
		.filter(isPaymentMethod)
		.filter(paymentMethodIsActive);

	/** Direct debit details */
	const [accountHolderName, setAccountHolderName] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [sortCode, setSortCode] = useState('');
	const [accountHolderConfirmation, setAccountHolderConfirmation] =
		useState(false);

	return (
		<FormSection>
			<Legend>
				{sectionNumber}. Payment method
				<SecureTransactionIndicator hideText={true} cssOverrides={css``} />
			</Legend>

			<RadioGroup
				role="radiogroup"
				label="Select payment method"
				hideLabel
				error={paymentMethodError}
			>
				{validPaymentMethods.map((validPaymentMethod) => {
					const selected = paymentMethod === validPaymentMethod;
					const { label, icon } = paymentMethodData[validPaymentMethod];
					return (
						<PaymentMethodSelector selected={selected}>
							<PaymentMethodRadio selected={selected}>
								<Radio
									label={
										<>
											{label}
											<div>{icon}</div>
										</>
									}
									name="paymentMethod"
									value={validPaymentMethod}
									cssOverrides={
										selected ? checkedRadioLabelColour : defaultRadioLabelColour
									}
									onChange={() => {
										setPaymentMethod(validPaymentMethod);
										setPaymentMethodError(undefined);
										// Track payment method selection with QM
										sendEventPaymentMethodSelected(validPaymentMethod);
									}}
								/>
							</PaymentMethodRadio>
							{validPaymentMethod === 'Stripe' && selected && (
								<div css={paymentMethodBody}>
									<input
										type="hidden"
										name="recaptchaToken"
										value={recaptchaToken}
									/>
									<StripeCardForm
										onCardNumberChange={() => {
											// no-op
										}}
										onExpiryChange={() => {
											// no-op
										}}
										onCvcChange={() => {
											// no-op
										}}
										errors={{}}
										recaptcha={
											<Recaptcha
												// We could change the parents type to Promise and use await here, but that has
												// a lot of refactoring with not too much gain
												onRecaptchaCompleted={(token) => {
													setStripeClientSecretInProgress(true);
													setRecaptchaToken(token);
													void stripeCreateSetupIntentRecaptcha(
														isTestUser,
														stripePublicKey,
														token,
													).then((client_secret) => {
														setStripeClientSecret(client_secret);
														setStripeClientSecretInProgress(false);
													});
												}}
												onRecaptchaExpired={() => {
													setRecaptchaToken(undefined);
												}}
											/>
										}
									/>
								</div>
							)}

							{validPaymentMethod === 'DirectDebit' && selected && (
								<div
									css={css`
										padding: ${space[5]}px ${space[3]}px ${space[6]}px;
									`}
								>
									<DirectDebitForm
										countryGroupId={countryGroupId}
										accountHolderName={accountHolderName}
										accountNumber={accountNumber}
										accountHolderConfirmation={accountHolderConfirmation}
										sortCode={sortCode}
										recaptchaCompleted={false}
										updateAccountHolderName={(name: string) => {
											setAccountHolderName(name);
										}}
										updateAccountNumber={(number: string) => {
											setAccountNumber(number);
										}}
										updateSortCode={(sortCode: string) => {
											setSortCode(sortCode);
										}}
										updateAccountHolderConfirmation={(
											confirmation: boolean,
										) => {
											setAccountHolderConfirmation(confirmation);
										}}
										recaptcha={
											<Recaptcha
												// We could change the parents type to Promise and uses await here, but that has
												// a lot of refactoring with not too much gain
												onRecaptchaCompleted={(token) => {
													setRecaptchaToken(token);
												}}
												onRecaptchaExpired={() => {
													setRecaptchaToken(undefined);
												}}
											/>
										}
										formError={''}
										errors={{}}
									/>
								</div>
							)}
						</PaymentMethodSelector>
					);
				})}
			</RadioGroup>
		</FormSection>
	);
}
