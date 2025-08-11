import { TextInput } from '@guardian/source/react-components';
import escapeStringRegexp from 'escape-string-regexp';
import { useState } from 'react';
import Signout from 'components/signout/signout';
import { preventDefaultValidityMessage } from 'pages/[countryGroupId]/validation';

type PersonalEmailFieldsProps = {
	email: string;
	setEmail: (value: string) => void;
	isEmailAddressReadOnly?: boolean;
	isSignedIn?: boolean;
	confirmedEmail?: string;
	setConfirmedEmail?: (value: string) => void;
	endUser?: 'your' | 'recipient';
};

export function PersonalEmailFields({
	email,
	setEmail,
	isEmailAddressReadOnly = false,
	isSignedIn = false,
	confirmedEmail,
	setConfirmedEmail,
	endUser = 'your',
}: PersonalEmailFieldsProps) {
	const [emailError, setEmailError] = useState<string>();
	const [confirmedEmailError, setConfirmedEmailError] = useState<string>();
	const optional = endUser === 'recipient';
	return (
		<>
			<div>
				<TextInput
					id="email"
					data-qm-masking="blocklist"
					label="Email address"
					value={email}
					type="email"
					optional={optional}
					autoComplete="email"
					onChange={(event) => {
						setEmail(event.currentTarget.value);
					}}
					onBlur={(event) => {
						event.target.checkValidity();
					}}
					readOnly={isEmailAddressReadOnly}
					name="email"
					required={!optional}
					maxLength={80}
					error={emailError}
					onInvalid={(event) => {
						preventDefaultValidityMessage(event.currentTarget);
						const validityState = event.currentTarget.validity;
						if (validityState.valid) {
							setEmailError(undefined);
						} else {
							if (validityState.valueMissing) {
								setEmailError(`Please enter ${endUser} email address.`);
							} else {
								setEmailError(`Please enter a valid ${endUser} email address.`);
							}
						}
					}}
				/>
			</div>
			{!isEmailAddressReadOnly &&
				setConfirmedEmail &&
				confirmedEmail !== undefined && (
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
								// Delay to allow the state to update before checking validity.
								// When using auto-fill we sometimes see the validity check for
								// equality with the email field fail. I think this is happening
								// because the state hasn't yet updated. Delaying this slightly
								// seems to fix the issue. It doesn't seem super elegant but I'm
								// not sure of a better way to handle this.
								setTimeout(() => {
									event.target.checkValidity();
								}, 50);
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
										setConfirmedEmailError(
											`Please confirm ${endUser} email address.`,
										);
									} else if (validityState.patternMismatch) {
										setConfirmedEmailError('The email addresses do not match.');
									} else {
										setConfirmedEmailError(
											'Please enter a valid email address.',
										);
									}
								}
							}}
						/>
					</div>
				)}
			<Signout isSignedIn={isSignedIn} />
		</>
	);
}
