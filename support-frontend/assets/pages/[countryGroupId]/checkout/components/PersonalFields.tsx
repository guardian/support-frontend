import { TextInput } from '@guardian/source/react-components';
import { useState } from 'react';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from 'pages/[countryGroupId]/validation';

type PersonalDetailsFieldsProps = {
	firstName: string;
	setFirstName: (value: string) => void;
	lastName: string;
	setLastName: (value: string) => void;
	endUser?: string;
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
	return (
		<>
			<div>
				<TextInput
					id="firstName"
					data-qm-masking="blocklist"
					label="First name"
					name="firstName"
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
					maxLength={40}
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
					id="lastName"
					data-qm-masking="blocklist"
					label="Last name"
					name="lastName"
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
