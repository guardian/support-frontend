import { TextInput } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { useState } from 'react';
import { StateSelect } from 'components/personalDetails/stateSelect';
import { FormSection, Legend } from 'pages/[countryGroupId]/components/form';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from 'pages/[countryGroupId]/validation';
import { PersonalEmailFields } from './PersonalEmailFields';
import { PersonalFields } from './PersonalFields';

type PersonalDetailsFieldsProps = {
	countryId: IsoCountry;
	legend: string;
	hasDeliveryAddress: boolean;
	firstName: string;
	setFirstName: (value: string) => void;
	lastName: string;
	setLastName: (value: string) => void;
	email: string;
	setEmail: (value: string) => void;
	confirmedEmail?: string;
	setConfirmedEmail?: (value: string) => void;
	billingState?: string;
	setBillingState?: (value: string) => void;
	billingPostcode?: string;
	setBillingPostcode?: (value: string) => void;
	isEmailAddressReadOnly?: boolean;
	isSignedIn?: boolean;
	isWeeklyGift?: boolean;
};

export function PersonalDetailsFields({
	countryId,
	legend,
	hasDeliveryAddress,
	firstName,
	setFirstName,
	lastName,
	setLastName,
	email,
	setEmail,
	confirmedEmail,
	setConfirmedEmail,
	billingState,
	setBillingState,
	billingPostcode,
	setBillingPostcode,
	isEmailAddressReadOnly = false,
	isSignedIn = false,
	isWeeklyGift = false,
}: PersonalDetailsFieldsProps) {
	const [billingStateError, setBillingStateError] = useState<string>();
	const [billingPostcodeError, setBillingPostcodeError] = useState<string>();
	const endUser = isWeeklyGift ? 'recipient' : 'your';
	return (
		<FormSection>
			<Legend>{legend}</Legend>
			{!isWeeklyGift && (
				<PersonalEmailFields
					email={email}
					setEmail={setEmail}
					endUser={endUser}
					isEmailAddressReadOnly={isEmailAddressReadOnly}
					confirmedEmail={confirmedEmail}
					setConfirmedEmail={setConfirmedEmail}
					isSignedIn={isSignedIn}
				/>
			)}
			<PersonalFields
				firstName={firstName}
				setFirstName={setFirstName}
				lastName={lastName}
				setLastName={setLastName}
				email={email}
				setEmail={setEmail}
				endUser={endUser}
			/>
			{isWeeklyGift && (
				<PersonalEmailFields
					email={email}
					setEmail={setEmail}
					endUser={endUser}
				/>
			)}
			{/**
			 * We require state for non-deliverable products as we use different taxes
			 * within those regions upstream For deliverable products we take the
			 * state // and zip code with the delivery address
			 */}
			{!isWeeklyGift && !hasDeliveryAddress && (
				<>
					{billingState &&
						setBillingState &&
						['US', 'CA', 'AU'].includes(countryId) && (
							<StateSelect
								countryId={countryId}
								state={billingState}
								onStateChange={(event) => {
									setBillingState(event.currentTarget.value);
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
					{billingPostcode && setBillingPostcode && countryId === 'US' && (
						<div>
							<TextInput
								id="zipCode"
								label="ZIP code"
								name="billing-postcode"
								onChange={(event) => {
									setBillingPostcode(event.target.value);
								}}
								onBlur={(event) => {
									event.target.checkValidity();
								}}
								maxLength={20}
								value={billingPostcode}
								pattern={doesNotContainExtendedEmojiOrLeadingSpace}
								error={billingPostcodeError}
								optional
								onInvalid={(event) => {
									preventDefaultValidityMessage(event.currentTarget);
									const validityState = event.currentTarget.validity;
									if (validityState.valid) {
										setBillingPostcodeError(undefined);
									} else {
										if (validityState.patternMismatch) {
											setBillingPostcodeError('Please enter a valid zip code.');
										}
									}
								}}
								// We have seen this field be filled in with an email address
								autoComplete={'off'}
							/>
						</div>
					)}
				</>
			)}
		</FormSection>
	);
}
