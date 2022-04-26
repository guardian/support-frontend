// ----- Imports ----- //
import { TextInput } from '@guardian/source-react-components';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import Signout from 'components/signout/signout';
import type { ContributionType } from 'helpers/contributions';
import {
	checkBillingState,
	checkEmail,
	checkFirstName,
	checkLastName,
	emailRegexPattern,
} from 'helpers/forms/formValidation';
import type { StateProvince } from 'helpers/internationalisation/country';
import type { ContributionsDispatch } from 'helpers/redux/contributionsStore';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import {
	setEmail,
	setFirstName,
	setLastName,
	updateBillingState,
} from '../contributionsLandingActions';
import type { State } from '../contributionsLandingReducer';
import ContributionState from './ContributionState';

// ----- Types ----- //

// interface ContributionFormFieldProps {
// 	firstName: string;
// 	lastName: string;
// 	email: string;
// 	billingState: StateProvince | null;
// 	checkoutFormHasBeenSubmitted: boolean;
// 	isSignedIn: boolean;
// 	setFirstName: (firstName: string) => void;
// 	setLastName: (lastName: string) => void;
// 	setEmail: (email: string) => void;
// 	updateBillingState: (billingState: string) => void;
// 	contributionType: ContributionType;
// }

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (
	formValue: string | null,
	userValue: string | null,
): string | null =>
	formValue === null || formValue === '' ? userValue : formValue;

const mapStateToProps = (state: State) => ({
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
	contributionType: state.page.form.contributionType,
});

const mapDispatchToProps = (dispatch: ContributionsDispatch) => ({
	setFirstName: (firstName: string) => {
		dispatch(setFirstName(firstName));
	},
	setLastName: (lastName: string) => {
		dispatch(setLastName(lastName));
	},
	setEmail: (email: string) => {
		dispatch(setEmail(email));
	},
	updateBillingState: (billingState: string) => {
		dispatch(updateBillingState(billingState === '' ? null : billingState));
	},
});

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
	contributionType,
	setFirstName,
	setLastName,
	setEmail,
	updateBillingState,
}: ContributionFormFieldProps) {
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
					label="Email address"
					value={email}
					type="email"
					autoComplete="email"
					supporting="example@domain.com"
					onChange={(e) => setEmail(e.target.value)}
					pattern={emailRegexPattern}
					error={
						checkoutFormHasBeenSubmitted && !checkEmail(email)
							? 'Please provide a valid email address'
							: undefined
					}
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
							label="First name"
							value={firstName}
							autoComplete="given-name"
							autoCapitalize="words"
							onChange={(e) => setFirstName(e.target.value)}
							error={
								checkoutFormHasBeenSubmitted && !checkFirstName(firstName)
									? 'Please provide a valid first name'
									: undefined
							}
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
							label="Last name"
							value={lastName}
							autoComplete="family-name"
							autoCapitalize="words"
							onChange={(e) => setLastName(e.target.value)}
							error={
								checkoutFormHasBeenSubmitted && !checkLastName(lastName)
									? 'Please provide a valid last name'
									: undefined
							}
							required
						/>
					</div>
				</div>
			) : null}

			<ContributionState
				onChange={updateBillingState}
				selectedState={billingState}
				isValid={checkBillingState(billingState)}
				formHasBeenSubmitted={checkoutFormHasBeenSubmitted}
			/>
		</div>
	);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ContributionFormFields);
