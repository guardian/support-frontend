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

export function PersonalPhoneField({
	phoneNumber,
	setPhoneNumber,
}: PersonalPhoneFieldProps) {
	const [telephoneError, setTelephoneError] = useState<string>();
	return (
		<>
			{setPhoneNumber && (
				<div>
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
						pattern={doesNotContainExtendedEmojiOrLeadingSpace} // Original checkout appears to be a minimally validated string field, possibly to provide more details than a number?
						supporting="We may use this to get in touch with you about your subscription."
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
				</div>
			)}
		</>
	);
}
