// ----- Imports ----- //
import { TextInput } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import { emailRegexPattern } from 'helpers/forms/formValidation';
import { classNameWithModifiers } from 'helpers/utilities/utilities';

export type PersonalDetailsProps = {
	email: string;
	firstName: string;
	lastName: string;
	contributionType: ContributionType;
	isSignedInPersonalDetails: boolean;
	onEmailChange: (email: string) => void;
	onFirstNameChange: (firstName: string) => void;
	onLastNameChange: (lastName: string) => void;
	signOutLink: React.ReactNode;
	contributionState: React.ReactNode;
};

export function PersonalDetails({
	email,
	firstName,
	lastName,
	contributionType,
	isSignedInPersonalDetails,
	onEmailChange,
	onFirstNameChange,
	onLastNameChange,
	signOutLink,
	contributionState,
}: PersonalDetailsProps): JSX.Element {
	return (
		<div className="form-fields">
			<h3 className="hidden-heading">Your details</h3>

			<div
				className={classNameWithModifiers('form__field', [
					'contribution-email',
				])}
			>
				<TextInput
					id="contributionEmail"
					data-qm-masking="blocklist"
					label="Email address"
					value={email}
					type="email"
					autoComplete="email"
					supporting="example@domain.com"
					onChange={(e) => onEmailChange(e.target.value)}
					pattern={emailRegexPattern}
					error={''}
					disabled={isSignedInPersonalDetails}
				/>
			</div>

			{signOutLink}

			{contributionType !== 'ONE_OFF' ? (
				<div>
					<div
						className={classNameWithModifiers('form__field', [
							'contribution-fname',
						])}
					>
						<TextInput
							id="contributionFirstName"
							data-qm-masking="blocklist"
							label="First name"
							value={firstName}
							autoComplete="given-name"
							autoCapitalize="words"
							onChange={(e) => onFirstNameChange(e.target.value)}
							error={''}
							required
						/>
					</div>
					<div
						className={classNameWithModifiers('form__field', [
							'contribution-lname',
						])}
					>
						<TextInput
							id="contributionLastName"
							data-qm-masking="blocklist"
							label="Last name"
							value={lastName}
							autoComplete="family-name"
							autoCapitalize="words"
							onChange={(e) => onLastNameChange(e.target.value)}
							error={''}
							required
						/>
					</div>
				</div>
			) : null}

			{contributionState}
		</div>
	);
}

export default PersonalDetails;
