// ----- Imports ----- //
import { TextInput } from '@guardian/source-react-components';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import Signout from 'components/signout/signout';
import {
	checkBillingState,
	emailRegexPattern,
} from 'helpers/forms/formValidation';
import { validatePersonalDetails } from 'helpers/redux/checkout/personalDetails/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import { applyPersonalDetailsRules } from 'helpers/subscriptionsForms/rules';
import { firstError } from 'helpers/subscriptionsForms/validation';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import {
	setEmail,
	setFirstName,
	setLastName,
	updateBillingState,
} from '../contributionsLandingActions';
import ContributionState from './ContributionState';

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (
	formValue: string | null,
	userValue: string | null,
): string | null =>
	formValue === null || formValue === '' ? userValue : formValue;

const mapStateToProps = (state: ContributionsState) => ({
	firstName:
		getCheckoutFormValue(
			state.page.checkoutForm.personalDetails.firstName,
			state.page.user.firstName,
		) ?? '',
	lastName:
		getCheckoutFormValue(
			state.page.checkoutForm.personalDetails.lastName,
			state.page.user.lastName,
		) ?? '',
	email:
		getCheckoutFormValue(
			state.page.checkoutForm.personalDetails.email,
			state.page.user.email,
		) ?? '',
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
	billingState:
		getCheckoutFormValue(
			state.page.form.formData.billingState,
			state.page.user.stateField,
		) ?? '',
	isSignedIn: state.page.checkoutForm.personalDetails.isSignedIn,
	userTypeFromIdentityResponse:
		state.page.checkoutForm.personalDetails.userTypeFromIdentityResponse,
	contributionType: getContributionType(state),
});

const mapDispatchToProps = {
	setFirstName,
	setLastName,
	setEmail,
	updateBillingState,
	validatePersonalDetails,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ContributionFormFieldProps = ConnectedProps<typeof connector>;

// ----- Render ----- //

function ContributionFormFields({
	firstName,
	lastName,
	email,
	billingState,
	checkoutFormHasBeenSubmitted,
	isSignedIn,
	userTypeFromIdentityResponse,
	contributionType,
	setFirstName,
	setLastName,
	setEmail,
	validatePersonalDetails,
	updateBillingState,
}: ContributionFormFieldProps) {
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
					onChange={(e) => setEmail(e.target.value)}
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
							onChange={(e) => setFirstName(e.target.value)}
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
							onChange={(e) => setLastName(e.target.value)}
							onBlur={() => validatePersonalDetails()}
							error={getFormFieldError('lastName')}
							required
						/>
					</div>
				</div>
			) : null}

			<ContributionState
				onChange={(newBillingState) =>
					updateBillingState(newBillingState === '' ? null : newBillingState)
				}
				selectedState={billingState}
				isValid={checkBillingState(billingState)}
				formHasBeenSubmitted={checkoutFormHasBeenSubmitted}
			/>
		</div>
	);
}

export default connector(ContributionFormFields);
