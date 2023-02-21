// ----- Imports ----- //
import { css } from '@emotion/react';
import { from, space, visuallyHidden } from '@guardian/source-foundations';
import { TextInput } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import { emailRegexPattern } from 'helpers/forms/formValidation';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';

const hiddenHeading = css`
	${visuallyHidden};
`;

const fieldGroupStyles = css`
	position: relative;
	margin-top: ${space[4]}px;

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
	contributionType: ContributionType;
	isSignedIn: boolean;
	onEmailChange: (email: string) => void;
	onFirstNameChange: (firstName: string) => void;
	onLastNameChange: (lastName: string) => void;
	signOutLink: React.ReactNode;
	contributionState: React.ReactNode;
	errors?: PersonalDetailsState['errors'];
};

export function PersonalDetails({
	email,
	firstName,
	lastName,
	contributionType,
	isSignedIn,
	onEmailChange,
	onFirstNameChange,
	onLastNameChange,
	errors,
	signOutLink,
	contributionState,
}: PersonalDetailsProps): JSX.Element {
	return (
		<div css={fieldGroupStyles}>
			<h3 css={hiddenHeading}>Your details</h3>
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

			{contributionType !== 'ONE_OFF' ? (
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
			) : null}

			{contributionState}
		</div>
	);
}

export default PersonalDetails;
