import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import { TextInput } from '@guardian/source/react-components';
import { useState } from 'react';
import {
	doesNotContainExtendedEmojiOrLeadingSpace,
	preventDefaultValidityMessage,
} from 'pages/[countryGroupId]/validation';

type PersonalPhoneFieldProps = {
	phoneNumber?: string;
	setPhoneNumber?: (value: string) => void;
};

const phoneStyle = css`
	margin-top: ${space[4]}px;
	${from.tablet} {
		margin-top: ${space[5]}px;
	}
`;

export function PersonalPhoneField({
	phoneNumber,
	setPhoneNumber,
}: PersonalPhoneFieldProps) {
	const [telephoneError, setTelephoneError] = useState<string>();
	return (
		<>
			{setPhoneNumber && (
				<fieldset css={phoneStyle}>
					<TextInput
						id="telephone"
						data-qm-masking="blocklist"
						label="Telephone"
						name="telephone"
						value={phoneNumber}
						onChange={(event) => {
							setPhoneNumber(event.target.value);
						}}
						onBlur={(event) => {
							event.target.checkValidity();
						}}
						optional
						error={telephoneError}
						pattern={doesNotContainExtendedEmojiOrLeadingSpace} // We intentionally use a minimally restrictive pattern here to allow users to enter additional details beyond digits. This matches the original checkout's behavior.
						onInvalid={(event) => {
							preventDefaultValidityMessage(event.currentTarget);
							const validityState = event.currentTarget.validity;
							if (validityState.valid) {
								setTelephoneError(undefined);
							} else {
								setTelephoneError('Please enter valid telephone details.');
							}
						}}
					/>
				</fieldset>
			)}
		</>
	);
}
