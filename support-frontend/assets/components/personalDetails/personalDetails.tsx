// ----- Imports ----- //
import { css } from '@emotion/react';
import {
	from,
	headline,
	space,
	visuallyHidden,
} from '@guardian/source-foundations';
import { TextInput } from '@guardian/source-react-components';
import { emailRegexPattern } from 'helpers/forms/formValidation';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';

const header = css`
	${headline.xsmall({ fontWeight: 'bold' })};
	margin-top: ${space[2]}px;
	margin-bottom: ${space[4]}px;
	${from.tablet} {
		font-size: 28px;
	}
`;

const hiddenHeading = css`
	${visuallyHidden};
`;

const fieldGroupStyles = (hideDetailsHeading?: boolean) => css`
	position: relative;
	margin-top: ${hideDetailsHeading ? `${space[4]}px` : '0'};

	& > *:not(:first-of-type) {
		margin-top: ${space[3]}px;
	}
	${from.tablet} {
		& > *:not(:first-of-type) {
			margin-top: ${space[4]}px;
		}
	}
`;

export type PersonalDetailsProps = {
	email: string;
	firstName: string;
	lastName: string;
	isSignedIn: boolean;
	onEmailChange: (email: string) => void;
	onFirstNameChange: (firstName: string) => void;
	onLastNameChange: (lastName: string) => void;
	signOutLink: React.ReactNode;
	contributionState: React.ReactNode;
	hideNameFields?: boolean;
	contributionZipcode?: React.ReactNode;
	overrideHeadingCopy?: string;
	hideDetailsHeading?: true;
	errors?: PersonalDetailsState['errors'];
};

export function PersonalDetails({
	email,
	firstName,
	lastName,
	isSignedIn,
	onEmailChange,
	onFirstNameChange,
	onLastNameChange,
	errors,
	signOutLink,
	contributionState,
	hideNameFields,
	contributionZipcode,
	hideDetailsHeading,
	overrideHeadingCopy,
}: PersonalDetailsProps): JSX.Element {
	return (
		<div css={fieldGroupStyles(hideDetailsHeading)}>
			<h2 css={[header, hideDetailsHeading && hiddenHeading]}>
				{overrideHeadingCopy ?? 'Your details'}
			</h2>
			<div>
				<TextInput
					id="email"
					data-qm-masking="blocklist"
					label="Email address"
					value={email}
					type="email"
					autoComplete="email"
					onChange={(e) => onEmailChange(e.target.value)}
					pattern={emailRegexPattern}
					error={errors?.email?.[0]}
					disabled={isSignedIn}
				/>
			</div>

			{signOutLink}

			{!hideNameFields && (
				<>
					<div>
						<TextInput
							id="firstName"
							data-qm-masking="blocklist"
							label="First name"
							value={firstName}
							autoComplete="given-name"
							autoCapitalize="words"
							onChange={(e) => onFirstNameChange(e.target.value)}
							error={errors?.firstName?.[0]}
							required
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
							onChange={(e) => onLastNameChange(e.target.value)}
							error={errors?.lastName?.[0]}
							required
						/>
					</div>
				</>
			)}

			{contributionState}

			{contributionZipcode}
		</div>
	);
}

export default PersonalDetails;
