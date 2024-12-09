import { TextInput } from '@guardian/source/react-components';
import { useState } from 'react';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from 'pages/[countryGroupId]/validation';

type PersonalDetailsFieldsProps = {
	children: React.ReactNode;
	firstName: string;
	setFirstName: (value: string) => void;
	lastName: string;
	setLastName: (value: string) => void;
	email: string;
	setEmail: (value: string) => void;
	isEmailAddressReadOnly: boolean;
};

export function PersonalDetailsFields({
	children,
	firstName,
	setFirstName,
	lastName,
	setLastName,
	email,
	setEmail,
	isEmailAddressReadOnly,
}: PersonalDetailsFieldsProps) {
	const [firstNameError, setFirstNameError] = useState<string>();
	const [lastNameError, setLastNameError] = useState<string>();
	const [emailError, setEmailError] = useState<string>();

	return (
		<>
			<div>
				<TextInput
					id="email"
					data-qm-masking="blocklist"
					label="Email address"
					value={email}
					type="email"
					autoComplete="email"
					onChange={(event) => {
						setEmail(event.currentTarget.value);
					}}
					onBlur={(event) => {
						event.target.checkValidity();
					}}
					readOnly={isEmailAddressReadOnly}
					name="email"
					required
					maxLength={80}
					error={emailError}
					onInvalid={(event) => {
						preventDefaultValidityMessage(event.currentTarget);
						const validityState = event.currentTarget.validity;
						if (validityState.valid) {
							setEmailError(undefined);
						} else {
							if (validityState.valueMissing) {
								setEmailError('Please enter your email address.');
							} else {
								setEmailError('Please enter a valid email address.');
							}
						}
					}}
				/>
			</div>
			{children}
			<div>
				<TextInput
					id="firstName"
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
					name="firstName"
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
								setFirstNameError('Please enter your first name.');
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
					value={lastName}
					autoComplete="family-name"
					autoCapitalize="words"
					onChange={(event) => {
						setLastName(event.target.value);
					}}
					onBlur={(event) => {
						event.target.checkValidity();
					}}
					name="lastName"
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
								setLastNameError('Please enter your last name.');
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
