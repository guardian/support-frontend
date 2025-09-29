import { TextInput } from '@guardian/source/react-components';
import { useState } from 'react';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from 'pages/[countryGroupId]/validation';

export type EndUserType = 'your' | 'recipient';
type PersonalDetailsFieldsProps = {
	firstName: string;
	setFirstName: (value: string) => void;
	lastName: string;
	setLastName: (value: string) => void;
	endUser?: EndUserType;
};

export function PersonalFields({
	firstName,
	setFirstName,
	lastName,
	setLastName,
	endUser = 'your',
}: PersonalDetailsFieldsProps) {
	const [firstNameError, setFirstNameError] = useState<string>();
	const [lastNameError, setLastNameError] = useState<string>();
	const firstNameId =
		endUser === 'recipient' ? 'recipientFirstName' : 'firstName';
	const lastNameId = endUser === 'recipient' ? 'recipientLastName' : 'lastName';
	return (
		<>
			<div>
				<TextInput
					id={firstNameId}
					name={firstNameId}
					data-qm-masking="blocklist"
					label="First name"
					value={firstName}
					autoComplete="given-name"
					autoCapitalize="words"
					onChange={(event) => {
						setFirstName(event.target.value);
					}}
					onBlur={(event) => {
						event.target.checkValidity();
					}}
					required
					maxLength={30}
					error={firstNameError}
					pattern={doesNotContainExtendedEmojiOrLeadingSpace}
					onInvalid={(event) => {
						preventDefaultValidityMessage(event.currentTarget);
						const validityState = event.currentTarget.validity;
						if (validityState.valid) {
							setFirstNameError(undefined);
						} else {
							if (validityState.valueMissing) {
								setFirstNameError(`Please enter ${endUser} first name.`);
							} else {
								setFirstNameError('Please enter a valid first name.');
							}
						}
					}}
				/>
			</div>
			<div>
				<TextInput
					id={lastNameId}
					name={lastNameId}
					data-qm-masking="blocklist"
					label="Last name"
					value={lastName}
					autoComplete="family-name"
					autoCapitalize="words"
					onChange={(event) => {
						setLastName(event.target.value);
					}}
					onBlur={(event) => {
						event.target.checkValidity();
					}}
					required
					maxLength={40}
					error={lastNameError}
					pattern={doesNotContainExtendedEmojiOrLeadingSpace}
					onInvalid={(event) => {
						preventDefaultValidityMessage(event.currentTarget);
						const validityState = event.currentTarget.validity;
						if (validityState.valid) {
							setLastNameError(undefined);
						} else {
							if (validityState.valueMissing) {
								setLastNameError(`Please enter ${endUser} last name.`);
							} else {
								setLastNameError('Please enter a valid last name.');
							}
						}
					}}
				/>
			</div>
		</>
	);
}
