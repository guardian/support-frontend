// ----- Imports ----- //
import { TextInput } from '@guardian/src-text-input';
import React from 'react';
import { connect } from 'react-redux';
import type { ThunkDispatch } from 'redux-thunk';
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
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import type { Action } from '../contributionsLandingActions';
import {
	updateBillingState,
	updateEmail,
	updateFirstName,
	updateLastName,
} from '../contributionsLandingActions';
import type { State } from '../contributionsLandingReducer';
import ContributionState from './ContributionState';

// ----- Types ----- //

interface ContributionFormFieldProps {
	firstName: string;
	lastName: string;
	email: string;
	billingState: StateProvince | null;
	checkoutFormHasBeenSubmitted: boolean;
	isSignedIn: boolean;
	updateFirstName: (firstName: string) => void;
	updateLastName: (lastName: string) => void;
	updateEmail: (email: string) => void;
	updateBillingState: (billingState: string) => void;
	contributionType: ContributionType;
}

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
			state.page.form.formData.firstName,
			state.page.user.firstName,
		) ?? '',
	lastName:
		getCheckoutFormValue(
			state.page.form.formData.lastName,
			state.page.user.lastName,
		) ?? '',
	email:
		getCheckoutFormValue(
			state.page.form.formData.email,
			state.page.user.email,
		) ?? '',
	checkoutFormHasBeenSubmitted:
		state.page.form.formData.checkoutFormHasBeenSubmitted,
	billingState:
		getCheckoutFormValue(
			state.page.form.formData.billingState,
			state.page.user.stateField,
		) ?? '',
	isSignedIn: state.page.user.isSignedIn,
	contributionType: state.page.form.contributionType,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<State, void, Action>) => ({
	updateFirstName: (firstName: string) => {
		dispatch(updateFirstName(firstName));
	},
	updateLastName: (lastName: string) => {
		dispatch(updateLastName(lastName));
	},
	updateEmail: (email: string) => {
		dispatch(updateEmail(email));
	},
	updateBillingState: (billingState: string) => {
		dispatch(updateBillingState(billingState === '' ? null : billingState));
	},
});

// ----- Render ----- //

function ContributionFormFields({
	firstName,
	lastName,
	email,
	billingState,
	checkoutFormHasBeenSubmitted,
	isSignedIn,
	contributionType,
	updateFirstName,
	updateLastName,
	updateEmail,
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
					onChange={(e) => updateEmail(e.target.value)}
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
							onChange={(e) => updateFirstName(e.target.value)}
							error={
								checkoutFormHasBeenSubmitted && !checkFirstName(firstName)
									? 'Please provide your first name'
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
							onChange={(e) => updateLastName(e.target.value)}
							error={
								checkoutFormHasBeenSubmitted && !checkLastName(lastName)
									? 'Please provide your last name'
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
