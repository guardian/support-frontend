// ----- Imports ----- //
import { TextInput } from '@guardian/source-react-components';
import Signout from 'components/signout/signout';
import type { ContributionType } from 'helpers/contributions';
import {
	checkBillingState,
	emailRegexPattern,
} from 'helpers/forms/formValidation';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { StateProvince } from 'helpers/internationalisation/country';
import { applyPersonalDetailsRules } from 'helpers/subscriptionsForms/rules';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import ContributionState from 'pages/contributions-landing/components/ContributionState';

export type PersonalDetailsProps = {
	email: string;
	firstName: string;
	lastName: string;
	billingState: string;
	checkoutFormHasBeenSubmitted: boolean;
	contributionType: ContributionType;
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
	onEmailChange: (email: string) => void;
	onFirstNameChange: (firstName: string) => void;
	onLastNameChange: (lastName: string) => void;
	updateBillState: (billingState: StateProvince | null) => void;
};

export function PersonalDetails({
	email,
	firstName,
	lastName,
	billingState,
	checkoutFormHasBeenSubmitted,
	contributionType,
	isSignedIn,
	userTypeFromIdentityResponse,
	onEmailChange,
	onFirstNameChange,
	onLastNameChange,
	updateBillState,
}: PersonalDetailsProps): JSX.Element {
	const formErrors = applyPersonalDetailsRules({
		firstName,
		lastName,
		email,
		isSignedIn,
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
					disabled={isSignedIn}
				/>
			</div>

			<Signout />

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

			<ContributionState
				onChange={(newBillingState) =>
					updateBillState(newBillingState === '' ? null : newBillingState)
				}
				selectedState={billingState}
				isValid={checkBillingState(billingState)}
				formHasBeenSubmitted={checkoutFormHasBeenSubmitted}
			/>
		</div>
	);
}

export default PersonalDetails;
