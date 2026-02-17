import { TextInput } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { useState } from 'react';
import { StateSelect } from 'components/personalDetails/stateSelect';
import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import { countriesRequiringBillingState } from 'pages/[countryGroupId]/helpers/countriesRequiringBillingState';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from 'pages/[countryGroupId]/validation';
import { CheckoutDivider } from 'pages/supporter-plus-landing/components/checkoutDivider';
import type { BillingStatePostcodeCountry } from './BillingAddressFields';
import { BillingAddressFields } from './BillingAddressFields';
import { PersonalEmailFields } from './PersonalEmailFields';
import { PersonalFields } from './PersonalFields';
import { PersonalPhoneField } from './PersonalPhoneField';

type PersonalDetailsFieldsProps = {
	countryId: IsoCountry;
	countries?: Record<string, string>;
	legend: string;
	firstName: string;
	setFirstName: (value: string) => void;
	lastName: string;
	setLastName: (value: string) => void;
	email: string;
	setEmail: (value: string) => void;
	confirmedEmail: string;
	setConfirmedEmail: (value: string) => void;
	phoneNumber: string;
	setPhoneNumber: (value: string) => void;
	billingStatePostcodeCountry?: BillingStatePostcodeCountry;
	hasDeliveryAddress?: boolean;
	isEmailAddressReadOnly?: boolean;
	isSignedIn?: boolean;
	isWeeklyGift?: boolean;
	zipCodeIsMandatory?: boolean;
};

export function PersonalDetailsFields({
	countryId,
	countries,
	legend,
	firstName,
	setFirstName,
	lastName,
	setLastName,
	email,
	setEmail,
	confirmedEmail,
	setConfirmedEmail,
	phoneNumber,
	setPhoneNumber,
	billingStatePostcodeCountry,
	hasDeliveryAddress = false,
	isEmailAddressReadOnly = false,
	isSignedIn = false,
	isWeeklyGift = false,
	zipCodeIsMandatory = false,
}: PersonalDetailsFieldsProps) {
	const [billingStateError, setBillingStateError] = useState<string>();
	const [billingPostcodeError, setBillingPostcodeError] = useState<string>();
	const personalEmailFields = (
		<PersonalEmailFields
			email={email}
			setEmail={setEmail}
			confirmedEmail={confirmedEmail}
			setConfirmedEmail={setConfirmedEmail}
			isEmailAddressReadOnly={isEmailAddressReadOnly}
			isSignedIn={isSignedIn}
		/>
	);
	return (
		<>
			<FormSection>
				<Legend>{legend}</Legend>
				{!isWeeklyGift && personalEmailFields}
				<PersonalFields
					firstName={firstName}
					setFirstName={setFirstName}
					lastName={lastName}
					setLastName={setLastName}
				/>
				{isWeeklyGift && personalEmailFields}
				{isWeeklyGift && (
					<PersonalPhoneField
						phoneNumber={phoneNumber}
						setPhoneNumber={setPhoneNumber}
					/>
				)}
				{/**
				 * We require state for non-deliverable products as we use different taxes
				 * within those regions upstream For deliverable products we take the
				 * state // and zip code with the delivery address
				 */}
				{!hasDeliveryAddress && (
					<>
						{billingStatePostcodeCountry?.setBillingState &&
							countriesRequiringBillingState.includes(countryId) && (
								<StateSelect
									countryId={countryId}
									state={billingStatePostcodeCountry.billingState}
									onStateChange={(event) => {
										billingStatePostcodeCountry.setBillingState(
											event.currentTarget.value,
										);
									}}
									onBlur={(event) => {
										event.currentTarget.checkValidity();
									}}
									onInvalid={(event) => {
										preventDefaultValidityMessage(event.currentTarget);
										const validityState = event.currentTarget.validity;
										if (validityState.valid) {
											setBillingStateError(undefined);
										} else {
											setBillingStateError(
												'Please enter a state, province or territory.',
											);
										}
									}}
									error={billingStateError}
								/>
							)}
						{billingStatePostcodeCountry?.setBillingPostcode &&
							countryId === 'US' && (
								<div>
									<TextInput
										id="zipCode"
										label="ZIP code"
										name="billing-postcode"
										onChange={(event) => {
											billingStatePostcodeCountry.setBillingPostcode(
												event.target.value,
											);
										}}
										onBlur={(event) => {
											event.target.checkValidity();
										}}
										maxLength={20}
										value={billingStatePostcodeCountry.billingPostcode}
										pattern={doesNotContainExtendedEmojiOrLeadingSpace}
										error={billingPostcodeError}
										optional={!zipCodeIsMandatory}
										onInvalid={(event) => {
											preventDefaultValidityMessage(event.currentTarget);
											const validityState = event.currentTarget.validity;
											if (validityState.valid) {
												setBillingPostcodeError(undefined);
											} else {
												setBillingPostcodeError(
													'Please enter a valid zip code.',
												);
											}
										}}
										// We have seen this field be filled in with an email address
										autoComplete={'off'}
									/>
								</div>
							)}
					</>
				)}
				{isWeeklyGift && billingStatePostcodeCountry && (
					<BillingAddressFields
						billingStatePostcodeCountry={billingStatePostcodeCountry}
						countries={countries}
						isWeeklyGift={isWeeklyGift}
					/>
				)}
			</FormSection>
			<CheckoutDivider spacing="loose" />
		</>
	);
}
