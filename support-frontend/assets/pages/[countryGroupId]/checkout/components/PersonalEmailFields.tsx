import { TextInput } from '@guardian/source/react-components';
import escapeStringRegexp from 'escape-string-regexp';
import { useState } from 'react';
import { preventDefaultValidityMessage } from 'pages/[countryGroupId]/validation';

type PersonalEmailFieldsProps = {
	children: React.ReactNode;
	email: string;
	setEmail: (value: string) => void;
	isEmailAddressReadOnly: boolean;
	confirmedEmail: string;
	setConfirmedEmail: (value: string) => void;
	requireConfirmedEmail: boolean;
};

export function PersonalEmailFields({
	children,
	email,
	setEmail,
	isEmailAddressReadOnly,
	confirmedEmail,
	setConfirmedEmail,
	requireConfirmedEmail,
}: PersonalEmailFieldsProps) {
	const [emailError, setEmailError] = useState<string>();
	const [confirmedEmailError, setConfirmedEmailError] = useState<string>();

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
			{!isEmailAddressReadOnly && requireConfirmedEmail && (
				<div>
					<TextInput
						id="confirm-email"
						data-qm-masking="blocklist"
						label="Confirm email address"
						value={confirmedEmail}
						type="email"
						autoComplete="email"
						onChange={(event) => {
							setConfirmedEmail(event.currentTarget.value);
						}}
						onBlur={(event) => {
							event.target.checkValidity();
						}}
						name="confirm-email"
						required
						maxLength={80}
						error={confirmedEmailError}
						pattern={escapeStringRegexp(email)}
						onInvalid={(event) => {
							preventDefaultValidityMessage(event.currentTarget);
							const validityState = event.currentTarget.validity;
							if (validityState.valid) {
								setConfirmedEmailError(undefined);
							} else {
								if (validityState.valueMissing) {
									setConfirmedEmailError('Please confirm your email address.');
								} else if (validityState.patternMismatch) {
									setConfirmedEmailError('The email addresses do not match.');
								} else {
									setConfirmedEmailError('Please enter a valid email address.');
								}
							}
						}}
					/>
				</div>
			)}
			{children}
		</>
	);
}
