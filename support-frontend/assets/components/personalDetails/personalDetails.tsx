// ----- Imports ----- //
import { TextInput } from '@guardian/source-react-components';
import type { ContributionType } from 'helpers/contributions';
import { emailRegexPattern } from 'helpers/forms/formValidation';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { applyPersonalDetailsRules } from 'helpers/subscriptionsForms/rules';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { classNameWithModifiers } from 'helpers/utilities/utilities';

export type PersonalDetailsProps = {
	email: string;
	firstName: string;
	lastName: string;
	checkoutFormHasBeenSubmitted: boolean;
	contributionType: ContributionType;
	isSignedInPersonalDetails: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
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
	checkoutFormHasBeenSubmitted,
	contributionType,
	isSignedInPersonalDetails,
	userTypeFromIdentityResponse,
	onEmailChange,
	onFirstNameChange,
	onLastNameChange,
	signOutLink,
	contributionState,
}: PersonalDetailsProps): JSX.Element {
	const formErrors = applyPersonalDetailsRules({
		firstName,
		lastName,
		email,
		isSignedIn: isSignedInPersonalDetails,
		userTypeFromIdentityResponse,
	});

	const getFormFieldError = (formField: string) =>
		checkoutFormHasBeenSubmitted
			? firstError(formField, formErrors)
			: undefined;

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
					error={getFormFieldError('email')}
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
							error={getFormFieldError('firstName')}
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
							error={getFormFieldError('lastName')}
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
